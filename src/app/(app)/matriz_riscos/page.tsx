"use client";

import { useState } from 'react';
import { useRisks } from "@/contexts/RiskContext";
import { Risk } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import { formatDateToDisplay, formatDateForFilename, riskLevelColors } from "@/lib/utils";
import { useExportToCsv } from "@/hooks/useExportToCsv";
import { generateRiskReportPDF } from '@/lib/pdfGenerator';
import { Can } from '@/components/auth/Can';

// Componentes UI
import { RiskDataTable } from "@/components/matriz-riscos/RiskDataTable";
import { RiskForm } from "@/components/matriz-riscos/RiskForm";
import { Button } from '@/components/ui/button';
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { PlusCircle, MoreHorizontal, FileDown, FileText, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export default function MatrizDeRiscosPage() {
  const { risks, archiveRisk, deleteRiskPermanently } = useRisks(); // Usando archiveRisk
  const { exportToCsv } = useExportToCsv();
  const { toast } = useToast();

  const [isAddDialogOpen, setAddDialogOpen] = useState(false);
  const [editingRisk, setEditingRisk] = useState<Risk | null>(null);
  const [deletingRisk, setDeletingRisk] = useState<Risk | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const handleExportPdf = () => {
    setIsGeneratingPdf(true);
    try {
      setTimeout(() => {
        generateRiskReportPDF(risks.filter(r => r.status !== 'Arquivado'));
        setIsGeneratingPdf(false);
      }, 500);
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      setIsGeneratingPdf(false);
      toast({ variant: "destructive", title: "Erro ao gerar PDF" });
    }
  };

  const handleExportCsv = () => {
    const dataToExport = risks.filter(r => r.status !== 'Arquivado').map(risk => ({
        ID: risk.id, Titulo: risk.title, Categoria: risk.category, NivelRisco: risk.riskLevel, Status: risk.status, Responsavel: risk.owner,
        Prazo: formatDateToDisplay(risk.dueDate), CriadoEm: formatDateToDisplay(risk.createdAt),
    }));
    const today = formatDateForFilename(new Date());
    exportToCsv(dataToExport, `VERITAS_Matriz_de_Riscos_${today}`);
  };

  const columns: ColumnDef<Risk>[] = [
    { id: "select", header: ({ table }) => (<Checkbox checked={table.getIsAllPageRowsSelected()} onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)} />), cell: ({ row }) => (<Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} />) },
    { accessorKey: "title", header: "Título" },
    { accessorKey: "riskLevel", header: "Nível", cell: ({ row }) => { const level: Risk['riskLevel'] = row.getValue("riskLevel"); return <Badge className={`${riskLevelColors[level]} text-white`}>{level}</Badge> }},
    { accessorKey: "status", header: "Status" },
    { accessorKey: "owner", header: "Responsável" },
    { accessorKey: "dueDate", header: "Prazo", cell: ({ row }) => formatDateToDisplay(row.getValue("dueDate")) },
    { id: "actions", cell: ({ row }) => { const risk = row.original; return (
        <Can role="admin">
          <DropdownMenu>
            <DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal /></Button></DropdownMenu