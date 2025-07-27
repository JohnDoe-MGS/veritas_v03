"use client";

import React, { createContext, useContext, ReactNode } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { ActionPlan } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

const DUMMY_PLANS: ActionPlan[] = [
    { id: 'P001', type: 'Ação', title: 'Revisar políticas de acesso', description: '', priority: 'Alta', status: 'Em Andamento', assignee: 'Ana Silva', startDate: '2025-06-01T00:00:00.000Z', dueDate: '2025-08-01T00:00:00.000Z', relatedRisks: ['R004'], budget: 5000, progress: 40, attachments: [] },
    { id: 'P002', type: 'Ação', title: 'Implementar criptografia de banco de dados', description: '', priority: 'Crítica', status: 'Pendente', assignee: 'TI', startDate: '2025-07-01T00:00:00.000Z', dueDate: '2025-10-01T00:00:00.000Z', relatedRisks: ['R001'], budget: 25000, progress: 0, attachments: [] },
    { id: 'P003', type: 'Ação', title: 'Treinamento de equipe sobre LGPD', description: '', priority: 'Média', status: 'Concluído', assignee: 'RH', startDate: '2025-05-10T00:00:00.000Z', dueDate: '2025-06-10T00:00:00.000Z', completionDate: '2025-06-09T00:00:00.000Z', relatedRisks: ['R002'], budget: 8000, progress: 100, attachments: [] },
    { id: 'P004', type: 'Contingência', title: 'Plano de Comunicação de Crise para Vazamento de Dados', description: '', priority: 'Crítica', status: 'Planejado', assignee: 'Comunicação', startDate: '2025-02-01T00:00:00.000Z', dueDate: '2025-03-01T00:00:00.000Z', simulationDueDate: '2025-07-15T00:00:00.000Z', relatedRisks: ['R001'], budget: 10000, progress: 100, attachments: [] },
    { id: 'P005', type: 'Contingência', title: 'Acionar Seguro de Responsabilidade Cibernética', description: '', priority: 'Alta', status: 'Planejado', assignee: 'Financeiro', startDate: '2025-02-01T00:00:00.000Z', dueDate: '2025-03-01T00:00:00.000Z', simulationDueDate: '2025-12-01T00:00:00.000Z', relatedRisks: ['R001'], budget: 2000, progress: 100, attachments: [] },
];

interface ActionPlanContextType {
  actionPlans: ActionPlan[];
  addActionPlan: (planData: Omit<ActionPlan, 'id'>) => void;
  updateActionPlan: (planId: string, updatedData: Partial<Omit<ActionPlan, 'id'>>) => void;
  deleteActionPlan: (planId: string) => void;
}

const ActionPlanContext = createContext<ActionPlanContextType | undefined>(undefined);

export const ActionPlanProvider = ({ children }: { children: ReactNode }) => {
  const [actionPlans, setActionPlans] = useLocalStorage<ActionPlan[]>('action_plans', DUMMY_PLANS);

  const addActionPlan = (planData: Omit<ActionPlan, 'id'>) => {
    const newPlan: ActionPlan = { ...planData, id: uuidv4() };
    setActionPlans(prev => [...prev, newPlan]);
  };

  const updateActionPlan = (planId: string, updatedData: Partial<Omit<ActionPlan, 'id'>>) => {
    setActionPlans(prev =>
      prev.map(plan => (plan.id === planId ? { ...plan, ...updatedData } : plan))
    );
  };

  const deleteActionPlan = (planId: string) => {
    setActionPlans(prev => prev.filter(plan => plan.id !== planId));
  };

  const value = { actionPlans, addActionPlan, updateActionPlan, deleteActionPlan };

  return <ActionPlanContext.Provider value={value}>{children}</ActionPlanContext.Provider>;
};

export const useActionPlans = (): ActionPlanContextType => {
  const context = useContext(ActionPlanContext);
  if (context === undefined) {
    throw new Error('useActionPlans deve ser usado dentro de um ActionPlanProvider');
  }
  return context;
};