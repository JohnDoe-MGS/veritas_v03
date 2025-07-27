"use client";

import React, { createContext, useContext, ReactNode } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Risk, AuditEntry } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';
import { useAudit } from './AuditContext';

const DUMMY_RISKS: Risk[] = [
  { id: 'R001', title: 'Vazamento de Dados de Clientes', description: 'Exposição não autorizada de dados sensíveis de clientes.', category: 'Operacional', probability: 5, impact: 5, riskLevel: 'Crítico', status: 'Ativo', owner: 'TI', dueDate: '2025-06-01T00:00:00.000Z', createdAt: '2025-01-10T00:00:00.000Z', updatedAt: '2025-01-10T00:00:00.000Z', attachments: [], actionPlans: ['P002', 'P004', 'P005'], auditTrail: [] },
  { id: 'R002', title: 'Não conformidade com a LGPD', description: 'Processos internos não aderentes à Lei Geral de Proteção de Dados.', category: 'Regulatório', probability: 4, impact: 4, riskLevel: 'Alto', status: 'Ativo', owner: 'Jurídico', dueDate: '2025-07-15T00:00:00.000Z', createdAt: '2025-02-20T00:00:00.000Z', updatedAt: '2025-02-20T00:00:00.000Z', attachments: [], actionPlans: ['P003'], auditTrail: [] },
  { id: 'R003', title: 'Falha no sistema de backup', description: 'Risco de perda de dados críticos por falha nos backups.', category: 'Operacional', probability: 3, impact: 3, riskLevel: 'Médio', status: 'Em Mitigação', owner: 'TI', dueDate: '2025-09-30T00:00:00.000Z', createdAt: '2025-03-01T00:00:00.000Z', updatedAt: '2025-03-01T00:00:00.000Z', attachments: [], actionPlans: [], auditTrail: [] },
  { id: 'R004', title: 'Fraude Financeira Interna', description: 'Possibilidade de desvio de recursos por colaboradores.', category: 'Financeiro', probability: 2, impact: 5, riskLevel: 'Médio', status: 'Monitorado', owner: 'Financeiro', dueDate: '2025-11-30T00:00:00.000Z', createdAt: '2025-04-15T00:00:00.000Z', updatedAt: '2025-04-15T00:00:00.000Z', attachments: [], actionPlans: ['P001'], auditTrail: [] },
  { id: 'R005', title: 'Relatório Regulatório Atrasado', description: 'Entrega de relatório fora do prazo para agência reguladora.', category: 'Regulatório', probability: 2, impact: 2, riskLevel: 'Baixo', status: 'Arquivado', owner: 'Contabilidade', dueDate: '2025-01-30T00:00:00.000Z', createdAt: '2025-01-05T00:00:00.000Z', updatedAt: '2025-01-05T00:00:00.000Z', attachments: [], actionPlans: [], auditTrail: [] },
];

interface RiskContextType {
  risks: Risk[];
  addRisk: (riskData: Omit<Risk, 'id' | 'createdAt' | 'updatedAt' | 'auditTrail'>) => void;
  updateRisk: (riskId: string, updatedData: Partial<Omit<Risk, 'id'>>) => void;
  archiveRisk: (riskId: string) => void;
  restoreRisk: (riskId: string) => void;
  deleteRiskPermanently: (riskId: string) => void;
}

const RiskContext = createContext<RiskContextType | undefined>(undefined);

export const RiskProvider = ({ children }: { children: ReactNode }) => {
  const [risks, setRisks] = useLocalStorage<Risk[]>('risks', DUMMY_RISKS);
  const { logAction } = useAudit();

  const addRisk = (riskData: Omit<Risk, 'id' | 'createdAt' | 'updatedAt' | 'auditTrail'>) => {
    const now = new Date().toISOString();
    const newRisk: Risk = { ...riskData, id: uuidv4(), createdAt: now, updatedAt: now, auditTrail: [] };
    setRisks(prevRisks => [...prevRisks, newRisk]);
    logAction(`Novo risco criado: "${newRisk.title}"`);
  };

  const updateRisk = (riskId: string, updatedData: Partial<Omit<Risk, 'id'>>) => {
    let riskTitle = '';
    setRisks(prevRisks =>
      prevRisks.map(risk => {
        if (risk.id === riskId) {
          riskTitle = updatedData.title || risk.title;
          return { ...risk, ...updatedData, updatedAt: new Date().toISOString() };
        }
        return risk;
      })
    );
    logAction(`Risco "${riskTitle}" foi atualizado.`);
  };

  const archiveRisk = (riskId: string) => {
    let riskTitle = '';
    setRisks(prev => prev.map(r => {
        if(r.id === riskId) { riskTitle = r.title; return {...r, status: 'Arquivado'}; }
        return r;
    }));
    logAction(`Risco "${riskTitle}" foi arquivado.`);
  }

  const restoreRisk = (riskId: string) => {
    let riskTitle = '';
    setRisks(prev => prev.map(r => {
        if(r.id === riskId) { riskTitle = r.title; return {...r, status: 'Ativo'}; }
        return r;
    }));
    logAction(`Risco "${riskTitle}" foi restaurado.`);
  }

  const deleteRiskPermanently = (riskId: string) => {
    let riskTitle = '';
    setRisks(prev => prev.filter(r => {
        if(r.id === riskId) { riskTitle = r.title; return false; }
        return true;
    }));
    logAction(`Risco "${riskTitle}" foi excluído permanentemente.`);
  };

  const value = { risks, addRisk, updateRisk, archiveRisk, restoreRisk, deleteRiskPermanently };

  return <RiskContext.Provider value={value}>{children}</RiskContext.Provider>;
};

export const useRisks = (): RiskContextType => {
  const context = useContext(RiskContext);
  if (context === undefined) {
    throw new Error('useRisks deve ser usado dentro de um RiskProvider');
  }
  return context;
};