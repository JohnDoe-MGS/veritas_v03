"use client";

import React, { createContext, useContext, useMemo } from 'react';
import { useRisks } from './RiskContext';
import { useActionPlans } from './ActionPlanContext';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface Notification {
  id: string;
  message: string;
  type: 'Simulação Vencida' | 'Prazo Vencido' | 'Alerta';
  dueDate: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAllAsRead: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const { risks } = useRisks();
  const { actionPlans } = useActionPlans();
  const [readIds, setReadIds] = useLocalStorage<string[]>('read_notifications', []);

  const notifications = useMemo(() => {
    const list: Notification[] = [];
    const now = new Date();

    // 1. Riscos vencidos
    risks.forEach(r => {
      if (r.status === 'Ativo' && new Date(r.dueDate) < now) {
        list.push({
          id: `risk-overdue-${r.id}`,
          message: `Revisão pendente: "${r.title}"`,
          type: 'Prazo Vencido',
          dueDate: r.dueDate
        });
      }
    });

    // 2. Planos vencidos e Simulações vencidas
    actionPlans.forEach(p => {
      if (p.status !== 'Concluído' && p.status !== 'Cancelado') {
        if (new Date(p.dueDate) < now) {
          list.push({
            id: `plan-overdue-${p.id}`,
            message: `Plano atrasado: "${p.title}"`,
            type: 'Prazo Vencido',
            dueDate: p.dueDate
          });
        }
        if (p.simulationDueDate && new Date(p.simulationDueDate) < now) {
          list.push({
            id: `plan-sim-overdue-${p.id}`,
            message: `Simulação pendente: "${p.title}"`,
            type: 'Simulação Vencida',
            dueDate: p.simulationDueDate
          });
        }
      }
    });

    return list;
  }, [risks, actionPlans]);

  const unreadCount = useMemo(() => {
    return notifications.filter(n => !readIds.includes(n.id)).length;
  }, [notifications, readIds]);

  const markAllAsRead = () => {
    const allIds = notifications.map(n => n.id);
    setReadIds(allIds);
  };

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAllAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications deve ser usado dentro de um NotificationProvider');
  }
  return context;
};
