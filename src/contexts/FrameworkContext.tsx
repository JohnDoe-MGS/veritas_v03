"use client";

import React, { createContext, useContext, ReactNode, useCallback } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Framework, Requirement } from '@/lib/types';
import { useAudit } from './AuditContext';

const DUMMY_FRAMEWORKS: Framework[] = [
  {
    id: "iso-37301",
    name: "ISO 37301",
    description: "Sistema de Gestão de Compliance",
    type: 'ISO',
    status: 'Em Implementação',
    lastAssessment: "2025-07-20T14:00:00.000Z",
    complianceLevel: 50,
    requirements: [
      { id: 'req-4-1', clause: '4. Contexto da Organização', description: 'Entender a organização e seu contexto', status: 'Concluído', assignee: 'Ana Silva', dueDate: "2025-08-30T14:00:00.000Z", evidence: ['SWOT_Analysis_2025.pdf'] },
      { id: 'req-4-2', clause: '4. Contexto da Organização', description: 'Entender as necessidades e expectativas das partes interessadas', status: 'Concluído', assignee: 'Bruno Costa', dueDate: "2025-09-15T14:00:00.000Z", evidence: ['Stakeholder_Map_v2.xlsx', 'Interview_Notes.docx'] },
      { id: 'req-5-1', clause: '5. Liderança', description: 'Liderança e comprometimento', status: 'Em Progresso', assignee: 'Ana Silva', dueDate: "2025-09-30T14:00:00.000Z", evidence: [] },
      { id: 'req-6-1', clause: '6. Planejamento', description: 'Ações para abordar riscos e oportunidades', status: 'Não Iniciado', assignee: 'Carlos Souza', dueDate: "2025-10-20T14:00:00.000Z", evidence: [] },
    ]
  },
  {
    id: "coso",
    name: "COSO",
    description: "Controles Internos e Gestão de Riscos",
    type: 'COSO',
    status: 'Planejado',
    lastAssessment: new Date().toISOString(),
    complianceLevel: 0,
    requirements: []
  },
];

interface FrameworkContextType {
  frameworks: Framework[];
  getFrameworkById: (id: string) => Framework | undefined;
  updateRequirementStatus: (frameworkId: string, requirementId: string, status: Requirement['status']) => void;
  addEvidenceToRequirement: (frameworkId: string, requirementId: string, fileName: string) => void;
  removeEvidenceFromRequirement: (frameworkId: string, requirementId: string, fileName: string) => void;
}

const FrameworkContext = createContext<FrameworkContextType | undefined>(undefined);

export const FrameworkProvider = ({ children }: { children: ReactNode }) => {
  const [frameworks, setFrameworks] = useLocalStorage<Framework[]>('frameworks', DUMMY_FRAMEWORKS);
  const { logAction } = useAudit();

  const getFrameworkById = useCallback((id: string) => {
    return frameworks.find(f => f.id === id);
  }, [frameworks]);

  const updateRequirement = (frameworkId: string, requirementId: string, updateFn: (req: Requirement) => Requirement) => {
    setFrameworks(prevFrameworks =>
      prevFrameworks.map(fw => {
        if (fw.id === frameworkId) {
          const updatedRequirements = fw.requirements.map(req =>
            req.id === requirementId ? updateFn(req) : req
          );
          const totalRequirements = updatedRequirements.length;
          const completedRequirements = updatedRequirements.filter(r => r.status === 'Concluído').length;
          const newComplianceLevel = totalRequirements > 0
            ? Math.round((completedRequirements / totalRequirements) * 100)
            : 0;

          return {
            ...fw,
            requirements: updatedRequirements,
            complianceLevel: newComplianceLevel,
            lastAssessment: new Date().toISOString(),
          };
        }
        return fw;
      })
    );
  };

  const updateRequirementStatus = (frameworkId: string, requirementId: string, status: Requirement['status']) => {
    let reqDescription = '';
    updateRequirement(frameworkId, requirementId, req => {
      reqDescription = req.description;
      return { ...req, status: status };
    });
    logAction(`Status do requisito "${reqDescription.slice(0,20)}..." alterado para ${status}.`);
  };

  const addEvidenceToRequirement = (frameworkId: string, requirementId: string, fileName: string) => {
    let reqDescription = '';
    updateRequirement(frameworkId, requirementId, req => {
      reqDescription = req.description;
      return { ...req, evidence: [...req.evidence, fileName] };
    });
    logAction(`Evidência "${fileName}" adicionada ao requisito "${reqDescription.slice(0,20)}...".`);
  };
  
  const removeEvidenceFromRequirement = (frameworkId: string, requirementId: string, fileName: string) => {
    let reqDescription = '';
    updateRequirement(frameworkId, requirementId, req => {
      reqDescription = req.description;
      return { ...req, evidence: req.evidence.filter(f => f !== fileName) };
    });
    logAction(`Evidência "${fileName}" removida do requisito "${reqDescription.slice(0,20)}...".`);
  };

  const value = { frameworks, getFrameworkById, updateRequirementStatus, addEvidenceToRequirement, removeEvidenceFromRequirement };

  return <FrameworkContext.Provider value={value}>{children}</FrameworkContext.Provider>;
};

export const useFrameworks = (): FrameworkContextType => {
  const context = useContext(FrameworkContext);
  if (context === undefined) {
    throw new Error('useFrameworks deve ser usado dentro de um FrameworkProvider');
  }
  return context;
};