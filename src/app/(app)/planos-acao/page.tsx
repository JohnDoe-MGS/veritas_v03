"use client";

import { useState, useMemo } from 'react';
import { useActionPlans } from '@/contexts/ActionPlanContext';
import { ActionPlan } from '@/lib/types';
import { ColumnDef } from "@tanstack/react-table";

// Componentes
import { ActionPlanForm } from '@/components/planos-acao/ActionPlanForm';
import { RiskDataTable } from '@/components/matriz-riscos/RiskDataTable';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader } from "@/components/ui/alert-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Can } from '@/components/auth/Can';
import { PlusCircle, MoreHorizontal } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';


export default function PlanosDeAcaoPage() {
  const { actionPlans, deleteActionPlan } = useActionPlans();
  
  const [isAddDialogOpen, setAddDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<ActionPlan | null>(null);
  const [deletingPlan, setDeletingPlan] = useState<ActionPlan | null>(null);

  const { regularPlans, contingencyPlans } = useMemo(() => {
    const regular = actionPlans.filter(p => p.type === 'Ação');
    const contingency = actionPlans.filter(p => p.type === 'Contingência');
    return { regularPlans: regular, contingencyPlans: contingency };
  }, [actionPlans]);

  const columns: ColumnDef<ActionPlan>[] = [
    { accessorKey: "title", header: "Título" },
    { accessorKey: "priority", header: "Prioridade" },
    { accessorKey: "status", header: "Status" },
    {
      id: "actions",
      cell: ({ row }) => {
        const plan = row.original;
        return (
          <Can role="admin">
            <DropdownMenu>
              <DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal /></Button></DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Ações</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => setEditingPlan(plan)}>Editar</DropdownMenuItem>
                <DropdownMenuItem className="text-red-500" onClick={() => setDeletingPlan(plan)}>Excluir</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </Can>
        );
      },
    },
  ];

  return (
    <div className="container mx-auto py-10">
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Gerenciamento de Planos</h1>
            <Can role="admin">
                <Dialog open={isAddDialogOpen} onOpenChange={setAddDialogOpen}>
                    <DialogTrigger asChild><Button><PlusCircle className="mr-2 h-4 w-4" />Adicionar Plano</Button></DialogTrigger>
                    <DialogContent><DialogHeader><DialogTitle>Novo Plano</DialogTitle></DialogHeader><ActionPlanForm onFormSubmit={() => setAddDialogOpen(false)} /></DialogContent>
                </Dialog>
            </Can>
        </div>
        
        <Tabs defaultValue="actions" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="actions">Planos de Ação</TabsTrigger>
                <TabsTrigger value="contingency">Planos de Contingência</TabsTrigger>
            </TabsList>
            <TabsContent value="actions">
                <Card className="mt-4"><CardContent className="pt-6"><RiskDataTable columns={columns} data={regularPlans} /></CardContent></Card>
            </TabsContent>
            <TabsContent value="contingency">
                <Card className="mt-4"><CardContent className="pt-6"><RiskDataTable columns={columns} data={contingencyPlans} /></CardContent></Card>
            </TabsContent>
        </Tabs>

        <Dialog open={!!editingPlan} onOpenChange={(open) => !open && setEditingPlan(null)}>
            <DialogContent><DialogHeader><DialogTitle>Editar Plano: {editingPlan?.title}</DialogTitle></DialogHeader><ActionPlanForm planToEdit={editingPlan!} onFormSubmit={() => setEditingPlan(null)} /></DialogContent>
        </Dialog>

        <AlertDialog open={!!deletingPlan} onOpenChange={(open) => !open && setDeletingPlan(null)}>
            <AlertDialogContent>
                <AlertDialogHeader><AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle></AlertDialogHeader>
                <AlertDialogDescription>Deseja realmente excluir o plano "{deletingPlan?.title}"?</AlertDialogDescription>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={() => { if(deletingPlan) deleteActionPlan(deletingPlan.id) }}>Excluir</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </div>
  );
}