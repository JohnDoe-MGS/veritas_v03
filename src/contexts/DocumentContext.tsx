"use client";

import React, { createContext, useContext, ReactNode } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { v4 as uuidv4 } from 'uuid';
import { Document } from '@/lib/types';
import { useAudit } from './AuditContext';

const DUMMY_DOCUMENTS: Document[] = [
  { id: '1', title: 'Política Anticorrupção e Antissuborno', category: 'Políticas', type: 'policy', description: 'Política corporativa para prevenção de práticas de corrupção e suborno em todas as operações.', lastUpdated: '2025-01-15', version: '3.1', author: 'Compliance Team', tags: ['anticorrupção', 'suborno', 'ética', 'política'], status: 'active', size: '2.3 MB', favorite: true },
  { id: '2', title: 'Procedimento de Due Diligence de Terceiros', category: 'Procedimentos', type: 'procedure', description: 'Procedimento detalhado para verificação e aprovação de parceiros comerciais e fornecedores.', lastUpdated: '2025-01-10', version: '2.0', author: 'Legal Team', tags: ['due diligence', 'terceiros', 'fornecedores', 'verificação'], status: 'active', size: '1.8 MB' },
  { id: '3', title: 'Guia de Investigações Internas', category: 'Diretrizes', type: 'guideline', description: 'Diretrizes para condução de investigações internas em casos de suspeita de má conduta.', lastUpdated: '2025-01-05', version: '1.5', author: 'Internal Audit', tags: ['investigação', 'má conduta', 'processo', 'auditoria'], status: 'active', size: '3.1 MB' },
  { id: '4', title: 'Template - Avaliação de Riscos', category: 'Templates', type: 'template', description: 'Template padronizado para condução de avaliações de riscos de compliance.', lastUpdated: '2024-12-20', version: '2.2', author: 'Risk Management', tags: ['template', 'riscos', 'avaliação', 'compliance'], status: 'active', size: '456 KB' },
  { id: '5', title: 'Relatório Anual de Compliance 2023', category: 'Relatórios', type: 'report', description: 'Relatório consolidado das atividades de compliance realizadas durante o ano de 2023.', lastUpdated: '2025-01-30', version: '1.0', author: 'Compliance Officer', tags: ['relatório', '2023', 'anual', 'atividades'], status: 'active', size: '5.7 MB', favorite: true },
  { id: '6', title: 'Código de Conduta Empresarial', category: 'Políticas', type: 'policy', description: 'Código de conduta que estabelece os princípios éticos e comportamentais esperados.', lastUpdated: '2024-11-15', version: '4.0', author: 'HR & Compliance', tags: ['código', 'conduta', 'ética', 'comportamento'], status: 'active', size: '1.2 MB' },
];

interface DocumentContextType {
  documents: Document[];
  toggleFavorite: (docId: string) => void;
}

const DocumentContext = createContext<DocumentContextType | undefined>(undefined);

export const DocumentProvider = ({ children }: { children: ReactNode }) => {
  const [documents, setDocuments] = useLocalStorage<Document[]>('bluebook_documents', DUMMY_DOCUMENTS);
  const { logAction } = useAudit();

  const toggleFavorite = (docId: string) => {
    let docTitle = '';
    let isFavorite = false;
    setDocuments(docs =>
      docs.map(doc => {
        if (doc.id === docId) {
          docTitle = doc.title;
          isFavorite = !doc.favorite;
          return { ...doc, favorite: !doc.favorite };
        }
        return doc;
      })
    );
    logAction(`Documento "${docTitle}" foi ${isFavorite ? 'marcado como favorito' : 'desmarcado como favorito'}.`);
  };

  const value = { documents, toggleFavorite };

  return <DocumentContext.Provider value={value}>{children}</DocumentContext.Provider>;
};

export const useDocuments = (): DocumentContextType => {
  const context = useContext(DocumentContext);
  if (context === undefined) {
    throw new Error('useDocuments deve ser usado dentro de um DocumentProvider');
  }
  return context;
};