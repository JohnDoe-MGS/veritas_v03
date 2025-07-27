"use client";

import { useRisks } from "@/contexts/RiskContext";
import { Risk } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Undo, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Can } from "@/components/auth/Can";

export default function LixeiraPage() {
    const { risks, restoreRisk, deleteRiskPermanently } = useRisks();
    const { toast } = useToast();

    const archivedRisks = risks.filter(risk => risk.status === 'Arquivado');

    const handleRestore = (risk: Risk) => {
        restoreRisk(risk.id);
        toast({ title: "Risco Restaurado", description: `O risco "${risk.title}" foi restaurado para a Matriz de Riscos.` });
    };

    const handleDeletePermanent = (risk: Risk) => {
        deleteRiskPermanently(risk.id);
        toast({ variant: "destructive", title: "Exclusão Permanente", description: `O risco "${risk.title}" foi excluído permanentemente.` });
    };

    return(
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-6">Lixeira</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Itens Arquivados</CardTitle>
                    <CardDescription>
                        Itens arquivados são removidos das listas principais, mas podem ser restaurados ou excluídos permanentemente por um administrador.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead scope="col">Título</TableHead>
                                <TableHead scope="col">Tipo</TableHead>
                                <TableHead scope="col" className="text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {archivedRisks.length > 0 ? archivedRisks.map(risk => (
                                <TableRow key={risk.id}>
                                    <TableCell>{risk.title}</TableCell>
                                    <TableCell><span className="text-sm text-muted-foreground">Risco</span></TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Can role="admin">
                                            <Button variant="outline" size="sm" onClick={() => handleRestore(risk)}><Undo className="mr-2 h-4 w-4" /> Restaurar</Button>
                                            <Button variant="destructive" size="sm" onClick={() => handleDeletePermanent(risk)}><Trash2 className="mr-2 h-4 w-4" /> Excluir Perm.</Button>
                                        </Can>
                                    </TableCell>
                                </TableRow>
                            )) : (
                                <TableRow><TableCell colSpan={3} className="text-center h-24">A lixeira está vazia.</TableCell></TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}