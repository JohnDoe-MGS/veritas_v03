"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useRisks } from "@/contexts/RiskContext";
import { useActionPlans } from "@/contexts/ActionPlanContext";
import { AlertTriangle, Activity, ShieldCheck, Target } from "lucide-react";
import { useMemo } from "react";

export function StatsCards() {
  const { risks } = useRisks();
  const { actionPlans } = useActionPlans();

  const { totalRisks, criticalRisks, activePlans, complianceScore } = useMemo(() => {
    const activeRisks = risks.filter(r => r.status !== 'Arquivado');
    const total = activeRisks.length;
    const critical = activeRisks.filter(r => r.riskLevel === 'Crítico').length;
    const mitigatedOrMonitored = activeRisks.filter(r => r.status === 'Mitigado' || r.status === 'Monitorado').length;
    
    const score = total > 0 ? Math.round((mitigatedOrMonitored / total) * 100) : 100;
    
    return {
      totalRisks: total,
      criticalRisks: critical,
      activePlans: actionPlans.filter(p => p.status === 'Em Andamento').length,
      complianceScore: score,
    };
  }, [risks, actionPlans]);

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Total de Riscos Ativos</CardTitle><Target/></CardHeader><CardContent><div className="text-2xl font-bold">{totalRisks}</div></CardContent></Card>
      <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Riscos Críticos</CardTitle><AlertTriangle className="text-red-500"/></CardHeader><CardContent><div className="text-2xl font-bold">{criticalRisks}</div></CardContent></Card>
      <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Planos em Andamento</CardTitle><Activity className="text-blue-500"/></CardHeader><CardContent><div className="text-2xl font-bold">{activePlans}</div></CardContent></Card>
      <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Compliance Score</CardTitle><ShieldCheck className="text-green-500"/></CardHeader><CardContent><div className="text-2xl font-bold">{complianceScore}%</div></CardContent></Card>
    </div>
  );
}