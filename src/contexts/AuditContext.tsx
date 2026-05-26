"use client";

import React, { createContext, useContext, ReactNode } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { AuditEntry } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from './AuthContext';

interface AuditContextType {
  auditTrail: AuditEntry[];
  logAction: (action: string) => void;
}

const AuditContext = createContext<AuditContextType | undefined>(undefined);

export const AuditProvider = ({ children }: { children: ReactNode }) => {
  const [auditTrail, setAuditTrail] = useLocalStorage<AuditEntry[]>('audit_trail', []);
  const { user } = useAuth();

  const logAction = (action: string) => {
    const newEntry: AuditEntry = {
      id: uuidv4(),
      user: user ? user.name : 'Sistema',
      action,
      timestamp: new Date().toISOString(),
    };
    setAuditTrail(prevTrail => [newEntry, ...prevTrail]);
  };

  return (
    <AuditContext.Provider value={{ auditTrail, logAction }}>
      {children}
    </AuditContext.Provider>
  );
};

export const useAudit = (): AuditContextType => {
  const context = useContext(AuditContext);
  if (context === undefined) {
    throw new Error('useAudit deve ser usado dentro de um AuditProvider');
  }
  return context;
};
