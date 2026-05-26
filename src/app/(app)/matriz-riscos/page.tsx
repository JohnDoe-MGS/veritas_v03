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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { PlusCircle, MoreHorizontal, FileDown, FileText, Loader2, Edit, Trash } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export default function MatrizDeRiscosPage() {
  const { risks, archiveRisk, deleteRiskPermanently } = useRisks();
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
        toast({ title: "Relatório gerado com sucesso!", description: "O PDF foi baixado." });
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
            <DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Ações</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setEditingRisk(risk)}><Edit className="mr-2 h-4 w-4" /> Editar</DropdownMenuItem>
              <DropdownMenuItem onClick={() => archiveRisk(risk.id)}><FileDown className="mr-2 h-4 w-4" /> Arquivar</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setDeletingRisk(risk)} className="text-red-600"><Trash className="mr-2 h-4 w-4" /> Excluir</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </Can>
      );
    } }
  ];

  const activeRisks = risks.filter(r => r.status !== 'Arquivado');

  return (
    <div className="container mx-auto py-10 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Matriz de Riscos</h1>
          <p className="text-muted-foreground mt-1">Identifique, analise e monitore os riscos corporativos da VERITAS.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={handleExportCsv} className="flex items-center gap-2">
            <FileDown className="h-4 w-4" /> Exportar CSV
          </Button>
          <Button variant="outline" onClick={handleExportPdf} disabled={isGeneratingPdf} className="flex items-center gap-2">
            {isGeneratingPdf ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
            Exportar PDF
          </Button>
          <Can role="admin">
            <Button onClick={() => setAddDialogOpen(true)} className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" /> Novo Risco
            </Button>
          </Can>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-lg border shadow-sm">
        <RiskDataTable columns={columns} data={activeRisks} />
      </div>

      {/* Dialog para Criar Risco */}
      <Dialog open={isAddDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Cadastrar Novo Risco</DialogTitle>
          </DialogHeader>
          <RiskForm onFormSubmit={() => { setAddDialogOpen(false); toast({ title: "Risco criado com sucesso!" }); }} />
        </DialogContent>
      </Dialog>

      {/* Dialog para Editar Risco */}
      <Dialog open={!!editingRisk} onOpenChange={(open) => !open && setEditingRisk(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Editar Risco</DialogTitle>
          </DialogHeader>
          {editingRisk && (
            <RiskForm riskToEdit={editingRisk} onFormSubmit={() => { setEditingRisk(null); toast({ title: "Risco atualizado com sucesso!" }); }} />
          )}
        </DialogContent>
      </Dialog>

      {/* AlertDialog para Excluir Risco */}
      <AlertDialog open={!!deletingRisk} onOpenChange={(open) => !open && setDeletingRisk(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza absoluta?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente o risco &quot;{deletingRisk?.title}&quot; e removerá todos os dados do sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              if (deletingRisk) {
                deleteRiskPermanently(deletingRisk.id);
                setDeletingRisk(null);
                toast({ variant: "destructive", title: "Risco excluído permanentemente." });
              }
            }} className="bg-red-600 hover:bg-red-700 text-white">
              Confirmar Exclusão
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}