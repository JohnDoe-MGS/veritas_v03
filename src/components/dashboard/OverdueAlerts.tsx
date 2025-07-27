"use client";

import { useRisks } from "@/contexts/RiskContext";
import { AlertTriangle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatDateToDisplay } from "@/lib/utils";
import { useActionPlans } from "@/contexts/ActionPlanContext";

export function OverdueAlerts() {
    const { risks } = useRisks();
    const { actionPlans } = useActionPlans();
    const now = new Date();

    const overdueRisks = risks.filter(r => r.status === 'Ativo' && new Date(r.dueDate) < now);
    const overduePlans = actionPlans.filter(p => p.status === 'Em Andamento' && new Date(p.dueDate) < now);
    
    const allOverdueItems = [...overdueRisks, ...overduePlans];

    return (
        <Card className="border-red-500/50">
            <CardHeader className="flex flex-row items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                <CardTitle>Alertas de Prazos Vencidos</CardTitle>
            </CardHeader>
            <CardContent>
                {allOverdueItems.length > 0 ? (
                    <ul className="space-y-2">
                        {allOverdueItems.map(item => (
                            <li key={item.id} className="text-sm">
                                <span className="font-semibold">{item.title}</span>
                                <span className="text-muted-foreground"> - Venceu em {formatDateToDisplay(item.dueDate)}</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-sm text-muted-foreground">Nenhum prazo vencido. Bom trabalho!</p>
                )}
            </CardContent>
        </Card>
    );
}