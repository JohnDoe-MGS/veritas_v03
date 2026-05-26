"use client";

import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { ActionPlan } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/lib/supabaseClient';

const DUMMY_PLANS: ActionPlan[] = [
  { id: 'P001', type: 'Ação', title: 'Revisar políticas de acesso', description: '', priority: 'Alta', status: 'Em Andamento', assignee: 'Ana Silva', startDate: '2025-06-01T00:00:00.000Z', dueDate: '2025-08-01T00:00:00.000Z', relatedRisks: ['R004'], budget: 5000, progress: 40, attachments: [] },
  { id: 'P002', type: 'Ação', title: 'Implementar criptografia de banco de dados', description: '', priority: 'Crítica', status: 'Planejado', assignee: 'TI', startDate: '2025-07-01T00:00:00.000Z', dueDate: '2025-10-01T00:00:00.000Z', relatedRisks: ['R001'], budget: 25000, progress: 0, attachments: [] },
  { id: 'P003', type: 'Ação', title: 'Treinamento de equipe sobre LGPD', description: '', priority: 'Média', status: 'Concluído', assignee: 'RH', startDate: '2025-05-10T00:00:00.000Z', dueDate: '2025-06-10T00:00:00.000Z', completionDate: '2025-06-09T00:00:00.000Z', relatedRisks: ['R002'], budget: 8000, progress: 100, attachments: [] },
  { id: 'P004', type: 'Contingência', title: 'Plano de Comunicação de Crise para Vazamento de Dados', description: '', priority: 'Crítica', status: 'Planejado', assignee: 'Comunicação', startDate: '2025-02-01T00:00:00.000Z', dueDate: '2025-03-01T00:00:00.000Z', simulationDueDate: '2025-07-15T00:00:00.000Z', relatedRisks: ['R001'], budget: 10000, progress: 100, attachments: [] },
  { id: 'P005', type: 'Contingência', title: 'Acionar Seguro de Responsabilidade Cibernética', description: '', priority: 'Alta', status: 'Planejado', assignee: 'Financeiro', startDate: '2025-02-01T00:00:00.000Z', dueDate: '2025-03-01T00:00:00.000Z', simulationDueDate: '2025-12-01T00:00:00.000Z', relatedRisks: ['R001'], budget: 2000, progress: 100, attachments: [] },
];

interface ActionPlanContextType {
  actionPlans: ActionPlan[];
  addActionPlan: (planData: Omit<ActionPlan, 'id'>) => Promise<void>;
  updateActionPlan: (planId: string, updatedData: Partial<Omit<ActionPlan, 'id'>>) => Promise<void>;
  deleteActionPlan: (planId: string) => Promise<void>;
  loading: boolean;
}

const ActionPlanContext = createContext<ActionPlanContextType | undefined>(undefined);

const isSupabaseConfigured = () => {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://seu-projeto.supabase.co' &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co'
  );
};

export const ActionPlanProvider = ({ children }: { children: ReactNode }) => {
  const [localPlans, setLocalPlans] = useLocalStorage<ActionPlan[]>('action_plans', DUMMY_PLANS);
  const [actionPlans, setActionPlans] = useState<ActionPlan[]>(DUMMY_PLANS);
  const [loading, setLoading] = useState(true);

  const fetchPlans = async () => {
    setLoading(true);
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('action_plans')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        if (data) {
          const formattedData: ActionPlan[] = data.map((p: any) => ({
            id: p.id,
            title: p.title,
            description: p.description || '',
            type: p.type,
            priority: p.priority,
            status: p.status,
            assignee: p.assignee,
            startDate: p.start_date,
            dueDate: p.due_date,
            completionDate: p.completion_date,
            simulationDueDate: p.simulation_due_date,
            relatedRisks: p.related_risks || [],
            budget: Number(p.budget) || 0,
            progress: p.progress || 0,
            attachments: p.attachments || []
          }));
          setActionPlans(formattedData);
          setLocalPlans(formattedData);
        }
      } catch (err) {
        console.error('Erro ao buscar planos de ação no Supabase, usando localStorage:', err);
        setActionPlans(localPlans);
      }
    } else {
      setActionPlans(localPlans);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPlans();
  }, [localPlans]);

  const addActionPlan = async (planData: Omit<ActionPlan, 'id'>) => {
    const newId = uuidv4();
    const newPlan: ActionPlan = { ...planData, id: newId };

    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase.from('action_plans').insert({
          id: newId,
          title: planData.title,
          description: planData.description,
          type: planData.type,
          priority: planData.priority,
          status: planData.status,
          assignee: planData.assignee,
          start_date: planData.startDate,
          due_date: planData.dueDate,
          completion_date: planData.completionDate,
          simulation_due_date: planData.simulationDueDate,
          related_risks: planData.relatedRisks,
          budget: planData.budget,
          progress: planData.progress,
          attachments: planData.attachments
        });
        if (error) throw error;
      } catch (err) {
        console.error('Erro ao salvar plano no Supabase:', err);
      }
    }

    setLocalPlans(prev => [...prev, newPlan]);
  };

  const updateActionPlan = async (planId: string, updatedData: Partial<Omit<ActionPlan, 'id'>>) => {
    if (isSupabaseConfigured()) {
      try {
        const payload: any = {};
        if (updatedData.title !== undefined) payload.title = updatedData.title;
        if (updatedData.description !== undefined) payload.description = updatedData.description;
        if (updatedData.type !== undefined) payload.type = updatedData.type;
        if (updatedData.priority !== undefined) payload.priority = updatedData.priority;
        if (updatedData.status !== undefined) payload.status = updatedData.status;
        if (updatedData.assignee !== undefined) payload.assignee = updatedData.assignee;
        if (updatedData.startDate !== undefined) payload.start_date = updatedData.startDate;
        if (updatedData.dueDate !== undefined) payload.due_date = updatedData.dueDate;
        if (updatedData.completionDate !== undefined) payload.completion_date = updatedData.completionDate;
        if (updatedData.simulationDueDate !== undefined) payload.simulation_due_date = updatedData.simulationDueDate;
        if (updatedData.relatedRisks !== undefined) payload.related_risks = updatedData.relatedRisks;
        if (updatedData.budget !== undefined) payload.budget = updatedData.budget;
        if (updatedData.progress !== undefined) payload.progress = updatedData.progress;
        if (updatedData.attachments !== undefined) payload.attachments = updatedData.attachments;

        const { error } = await supabase.from('action_plans').update(payload).eq('id', planId);
        if (error) throw error;
      } catch (err) {
        console.error('Erro ao atualizar plano no Supabase:', err);
      }
    }

    setLocalPlans(prev =>
      prev.map(plan => (plan.id === planId ? { ...plan, ...updatedData } : plan))
    );
  };

  const deleteActionPlan = async (planId: string) => {
    if (isSupabaseConfigured()) {
      try {
        const { error } = await supabase.from('action_plans').delete().eq('id', planId);
        if (error) throw error;
      } catch (err) {
        console.error('Erro ao excluir plano no Supabase:', err);
      }
    }

    setLocalPlans(prev => prev.filter(plan => plan.id !== planId));
  };

  const value = { actionPlans, addActionPlan, updateActionPlan, deleteActionPlan, loading };

  return <ActionPlanContext.Provider value={value}>{children}</ActionPlanContext.Provider>;
};

export const useActionPlans = (): ActionPlanContextType => {
  const context = useContext(ActionPlanContext);
  if (context === undefined) {
    throw new Error('useActionPlans deve ser usado dentro de um ActionPlanProvider');
  }
  return context;
};