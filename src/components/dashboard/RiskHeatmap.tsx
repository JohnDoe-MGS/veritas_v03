"use client";

import { useRisks } from "@/contexts/RiskContext";
import { calculateRiskLevel } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMemo } from "react";

const impactLabels: Record<number, string> = { 5: 'Muito Alto', 4: 'Alto', 3: 'Médio', 2: 'Baixo', 1: 'Muito Baixo' };
const probabilityLabels: Record<number, string> = { 1: 'Rara', 2: 'Improvável', 3: 'Possível', 4: 'Provável', 5: 'Quase Certo' };
const levelColors: Record<string, string> = { Baixo: 'bg-green-100 text-green-800', Médio: 'bg-yellow-100 text-yellow-800', Alto: 'bg-orange-100 text-orange-800', Crítico: 'bg-red-100 text-red-800' };

export function RiskHeatmap() {
    const { risks } = useRisks();
    const heatmapData = useMemo(() => {
        const matrix = Array(5).fill(0).map(() => Array(5).fill(0));
        risks.filter(r => r.status !== 'Arquivado').forEach(risk => {
            matrix[5 - risk.impact][risk.probability - 1]++;
        });
        return matrix;
    }, [risks]);

    return (
        <Card>
            <CardHeader><CardTitle>Matriz de Calor de Riscos (Probabilidade x Impacto)</CardTitle></CardHeader>
            <CardContent>
                <div className="flex">
                    <div className="flex flex-col justify-between items-center pt-8 pb-10 -mr-4 text-xs text-muted-foreground w-12">
                        <span>Impacto</span>
                    </div>
                    <div>
                        <table className="border-collapse w-full">
                            <tbody>
                                {heatmapData.map((row, rowIndex) => (
                                    <tr key={rowIndex}>
                                        <td className="w-12 text-xs text-muted-foreground text-center">{impactLabels[5 - rowIndex]}</td>
                                        {row.map((count, colIndex) => {
                                            const impact = 5 - rowIndex;
                                            const probability = colIndex + 1;
                                            const level = calculateRiskLevel(probability, impact);
                                            return (
                                                <td key={colIndex} className={`border border-background w-1/5 h-16 text-center ${levelColors[level]}`}>
                                                    <div className="text-2xl font-bold">{count > 0 ? count : ''}</div>
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td></td>
                                    {Object.values(probabilityLabels).map(label => <th key={label} className="text-xs font-normal text-muted-foreground pt-2">{label}</th>)}
                                </tr>
                                 <tr>
                                    <td></td>
                                    <th colSpan={5} className="text-xs font-normal text-muted-foreground pt-2">Probabilidade</th>
                                 </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}