"use client";

import { useAudit } from "@/contexts/AuditContext";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export function RecentActivities() {
    const { auditTrail } = useAudit();

    return (
        <Card>
            <CardHeader>
                <CardTitle>Atividades Recentes</CardTitle>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-72">
                    <div className="space-y-4">
                        {auditTrail.length > 0 ? auditTrail.map((entry) => (
                            <div key={entry.id} className="flex items-start">
                                <div className="ml-4 space-y-1">
                                    <p className="text-sm font-medium leading-none">{entry.action}</p>
                                    <p className="text-sm text-muted-foreground">
                                        Por {entry.user} - {formatDistanceToNow(new Date(entry.timestamp), { addSuffix: true, locale: ptBR })}
                                    </p>
                                </div>
                            </div>
                        )) : <p className="text-sm text-muted-foreground text-center">Nenhuma atividade registrada.</p>}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    )
}