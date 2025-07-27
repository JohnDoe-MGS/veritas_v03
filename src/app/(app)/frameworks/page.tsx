"use client";

import { useFrameworks } from "@/contexts/FrameworkContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export default function FrameworkComparisonPage() {
    const { frameworks } = useFrameworks();

    return(
        <div className="container mx-auto py-10">
            <h1 className="text-3xl font-bold mb-6">Análise Comparativa de Frameworks</h1>
            <Card>
                <CardContent className="pt-6">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead scope="col">Framework</TableHead>
                                <TableHead scope="col">Tipo</TableHead>
                                <TableHead scope="col">Status</TableHead>
                                <TableHead scope="col" className="text-center">Requisitos Totais</TableHead>
                                <TableHead scope="col" className="text-center">Gaps (Pendentes)</TableHead>
                                <TableHead scope="col" className="w-[200px]">Nível de Compliance</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {frameworks.map(fw => {
                                const totalReqs = fw.requirements.length;
                                const completedReqs = fw.requirements.filter(r => r.status === 'Concluído').length;
                                const pendingReqs = totalReqs - completedReqs;

                                return (
                                    <TableRow key={fw.id}>
                                        <TableCell className="font-medium">{fw.name}</TableCell>
                                        <TableCell><Badge variant="secondary">{fw.type}</Badge></TableCell>
                                        <TableCell>{fw.status}</TableCell>
                                        <TableCell className="text-center">{totalReqs}</TableCell>
                                        <TableCell className="text-center font-semibold text-red-600">{pendingReqs}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Progress value={fw.complianceLevel} className="w-full" />
                                                <span className="font-mono text-sm">{fw.complianceLevel}%</span>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}