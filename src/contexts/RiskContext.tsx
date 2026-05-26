"use client";

import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Risk } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';
import { useAudit } from './AuditContext';
import { supabase } from '@/lib/supabaseClient';

const DUMMY_RISKS: Risk[] = [
  { id: 'R001', title: 'Vazamento de Dados de Clientes', description: 'Exposição não autorizada de dados sensíveis de clientes.', category: 'Operacional', probability: 5, impact: 5, riskLevel: 'Crítico', status: 'Ativo', owner: 'TI', dueDate: '2025-06-01T00:00:00.000Z', createdAt: '2025-01-10T00:00:00.000Z', updatedAt: '2025-01-10T00:00:00.000Z', attachments: [], actionPlans: ['P002', 'P004', 'P005'], auditTrail: [] },
  { id: 'R002', title: 'Não conformidade com a LGPD', description: 'Processos internos não aderentes à Lei Geral de Proteção de Dados.', category: 'Regulatório', probability: 4, impact: 4, riskLevel: 'Alto', status: 'Ativo', owner: 'Jurídico', dueDate: '2025-07-15T00:00:00.000Z', createdAt: '2025-02-20T00:00:00.000Z', updatedAt: '2025-02-20T00:00:00.000Z', attachments: [], actionPlans: ['P003'], auditTrail: [] },
  { id: 'R003', title: 'Falha no sistema de backup', description: 'Risco de perda de dados críticos por falha nos backups.', category: 'Operacional', probability: 3, impact: 3, riskLevel: 'Médio', status: 'Mitigado', owner: 'TI', dueDate: '2025-09-30T00:00:00.000Z', createdAt: '2025-03-01T00:00:00.000Z', updatedAt: '2025-03-01T00:00:00.000Z', attachments: [], actionPlans: [], auditTrail: [] },
  { id: 'R004', title: 'Fraude Financeira Interna', description: 'Possibilidade de desvio de recursos por colaboradores.', category: 'Financeiro', probability: 2, impact: 5, riskLevel: 'Médio', status: 'Monitorado', owner: 'Financeiro', dueDate: '2025-11-30T00:00:00.000Z', createdAt: '2025-04-15T00:00:00.000Z', updatedAt: '2025-04-15T00:00:00.000Z', attachments: [], actionPlans: ['P001'], auditTrail: [] },
  { id: 'R005', title: 'Relatório Regulatório Atrasado', description: 'Entrega de relatório fora do prazo para agência reguladora.', category: 'Regulatório', probability: 2, impact: 2, riskLevel: 'Baixo', status: 'Arquivado', owner: 'Contabilidade', dueDate: '2025-01-30T00:00:00.000Z', createdAt: '2025-01-05T00:00:00.000Z', updatedAt: '2025-01-05T00:00:00.000Z', attachments: [], actionPlans: [], auditTrail: [] },
];

interface RiskContextType {
  risks: Risk[];
  addRisk: (riskData: Omit<Risk, 'id' | 'createdAt' | 'updatedAt' | 'auditTrail'>) => Promise<void>;
  updateRisk: (riskId: string, updatedData: Partial<Omit<Risk, 'id'>>) => Promise<void>;
  archiveRisk: (riskId: string) => Promise<void>;
  restoreRisk: (riskId: string) => Promise<void>;
  deleteRiskPermanently: (riskId: string) => Promise<void>;
  loading: boolean;
}

const RiskContext = createContext<RiskContextType | undefined>(undefined);

const isSupabaseConfigured = () => {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://seu-projeto.supabase.co' &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co'
  );
};

export const RiskProvider = ({ children }: { children: ReactNode }) => {
  const [localRisks, setLocalRisks] = useLocalStorage<Risk[]>('risks', DUMMY_RISKS);
  const [risks, setRisks] = useState<Risk[]>(DUMMY_RISKS);
  const [loading, setLoading] = useState(true);
  const { logAction } = useAudit();

  const fetchRisks = async () => {
    setLoading(true);
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('risks')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        if (data) {
          const formattedData: Risk[] = data.map((r: any) => ({
            id: r.id,
            title: r.title,
            description: r.description || '',
            category: r.category,
            probability: r.probability,
            impact: r.impact,
            riskLevel: r.risk_level,
            status: r.status,
            owner: r.owner,
            dueDate: r.due_date,
            createdAt: r.created_at,
            updatedAt: r.updated_at,
            attachments: r.attachments || [],
            actionPlans: r.action_plans || [],
            auditTrail: []
          }));
          setRisks(formattedData);
          setLocalRisks(formattedData); // Manter sincronia local
        }
      } catch (err) {
        console.error('Erro ao buscar riscos do Supabase, utilizando localStorage:', err);
        setRisks(localRisks);
      }
    } else {
      setRisks(localRisks);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRisks();
  }, [localRisks]);

  const addRisk = async (riskData: Omit<Risk, 'id' | 'createdAt' | 'updatedAt' | 'auditTrail'>) => {
    const now = new Date().toISOString();
    const newId = uuidv4();
    const newRisk: Risk = { ...riskData, id: newId, createdAt: now, updatedAt: now, auditTrail: [] };

    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase.from('risks').insert({
          id: newId,
          title: riskData.title,
          description: riskData.description,
          category: riskData.category,
          probability: riskData.probability,
          impact: riskData.impact,
          risk_level: riskData.riskLevel,
          status: riskData.status,
          owner: riskData.owner,
          due_date: riskData.dueDate,
          attachments: riskData.attachments,
          action_plans: riskData.actionPlans
        });
        if (error) throw error;
      } catch (err) {
        console.error('Erro ao salvar no Supabase, salvando localmente:', err);
      }
    }

    setLocalRisks(prev => [newRisk, ...prev]);
    logAction(`Novo risco criado: "${newRisk.title}"`);
  };

  const updateRisk = async (riskId: string, updatedData: Partial<Omit<Risk, 'id'>>) => {
    const now = new Date().toISOString();
    let riskTitle = '';

    if (isSupabaseConfigured()) {
      try {
        const payload: any = {};
        if (updatedData.title !== undefined) payload.title = updatedData.title;
        if (updatedData.description !== undefined) payload.description = updatedData.description;
        if (updatedData.category !== undefined) payload.category = updatedData.category;
        if (updatedData.probability !== undefined) payload.probability = updatedData.probability;
        if (updatedData.impact !== undefined) payload.impact = updatedData.impact;
        if (updatedData.riskLevel !== undefined) payload.risk_level = updatedData.riskLevel;
        if (updatedData.status !== undefined) payload.status = updatedData.status;
        if (updatedData.owner !== undefined) payload.owner = updatedData.owner;
        if (updatedData.dueDate !== undefined) payload.due_date = updatedData.dueDate;
        if (updatedData.attachments !== undefined) payload.attachments = updatedData.attachments;
        if (updatedData.actionPlans !== undefined) payload.action_plans = updatedData.actionPlans;
        payload.updated_at = now;

        const { error } = await supabase.from('risks').update(payload).eq('id', riskId);
        if (error) throw error;
      } catch (err) {
        console.error('Erro ao atualizar no Supabase, atualizando localmente:', err);
      }
    }

    setLocalRisks(prevRisks =>
      prevRisks.map(risk => {
        if (risk.id === riskId) {
          riskTitle = updatedData.title || risk.title;
          return { ...risk, ...updatedData, updatedAt: now };
        }
        return risk;
      })
    );
    logAction(`Risco "${riskTitle}" foi atualizado.`);
  };

  const archiveRisk = async (riskId: string) => {
    await updateRisk(riskId, { status: 'Arquivado' });
    logAction(`Risco arquivado com ID: ${riskId}`);
  };

  const restoreRisk = async (riskId: string) => {
    await updateRisk(riskId, { status: 'Ativo' });
    logAction(`Risco restaurado com ID: ${riskId}`);
  };

  const deleteRiskPermanently = async (riskId: string) => {
    let riskTitle = '';
    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase.from('risks').delete().eq('id', riskId);
        if (error) throw error;
      } catch (err) {
        console.error('Erro ao excluir no Supabase:', err);
      }
    }

    setLocalRisks(prev => prev.filter(r => {
      if (r.id === riskId) {
        riskTitle = r.title;
        return false;
      }
      return true;
    }));
    logAction(`Risco "${riskTitle}" foi excluído permanentemente.`);
  };

  const value = { risks, addRisk, updateRisk, archiveRisk, restoreRisk, deleteRiskPermanently, loading };

  return <RiskContext.Provider value={value}>{children}</RiskContext.Provider>;
};

export const useRisks = (): RiskContextType => {
  const context = useContext(RiskContext);
  if (context === undefined) {
    throw new Error('useRisks deve ser usado dentro de um RiskProvider');
  }
  return context;
};