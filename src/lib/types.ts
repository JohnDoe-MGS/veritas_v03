export interface AuditEntry {
  id: string;
  user: string;
  action: string;
  timestamp: string;
}

export interface Requirement {
  id: string;
  clause: string;
  description: string;
  status: 'Não Iniciado' | 'Em Progresso' | 'Concluído';
  evidence: string[];
  assignee: string;
  dueDate: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
}

export interface Risk {
  id: string;
  title: string;
  description: string;
  category: 'Operacional' | 'Financeiro' | 'Regulatório' | 'Reputacional' | 'Estratégico';
  probability: 1 | 2 | 3 | 4 | 5;
  impact: 1 | 2 | 3 | 4 | 5;
  riskLevel: 'Baixo' | 'Médio' | 'Alto' | 'Crítico';
  status: 'Ativo' | 'Mitigado' | 'Monitorado' | 'Arquivado';
  owner: string;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  attachments: string[];
  actionPlans: string[];
  auditTrail: AuditEntry[];
}

export interface Framework {
  id: string;
  name: string;
  description: string;
  type: 'ISO' | 'COSO' | 'DOJ' | 'Outro';
  requirements: Requirement[];
  complianceLevel: number;
  lastAssessment: string;
  status: 'Implementado' | 'Em Implementação' | 'Planejado';
}

export interface ActionPlan {
  id: string;
  title: string;
  description: string;
  type: 'Ação' | 'Contingência';
  priority: 'Baixa' | 'Média' | 'Alta' | 'Crítica';
  status: 'Planejado' | 'Em Andamento' | 'Concluído' | 'Cancelado';
  assignee: string;
  startDate: string;
  dueDate: string;
  completionDate?: string;
  simulationDueDate?: string;
  relatedRisks: string[];
  budget: number;
  progress: number;
  attachments: string[];
}

export interface Document {
  id: string;
  title: string;
  category: string;
  type: 'policy' | 'procedure' | 'guideline' | 'template' | 'report';
  description: string;
  lastUpdated: string;
  version: string;
  author: string;
  tags: string[];
  status: 'active' | 'draft' | 'archived';
  size: string;
  favorite?: boolean;
}