"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useRisks } from "@/contexts/RiskContext";
import { useMemo } from "react";

export function RiskCategoryChart() {
    const { risks } = useRisks();

    const chartData = useMemo(() => {
        const categories: Record<string, number> = {
            'Operacional': 0,
            'Financeiro': 0,
            'Regulatório': 0,
            'Reputacional': 0,
            'Estratégico': 0,
        };
        
        for (const risk of risks) {
            if (risk.status !== 'Arquivado') {
                categories[risk.category]++;
            }
        }
        
        return Object.entries(categories).map(([name, total]) => ({ name, total }));
    }, [risks]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Riscos por Categoria</CardTitle>
            </CardHeader>
            <CardContent>
                <ChartContainer className="h-[300px] w-full" role="figure" aria-label="Gráfico de barras mostrando a contagem de riscos por categoria.">
                    <ResponsiveContainer>
                        <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                            <YAxis type="category" dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} width={80} />
                            <XAxis type="number" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                            <Bar dataKey="total" fill="#f97316" radius={4} />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}