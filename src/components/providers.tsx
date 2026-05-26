"use client";

import React, { ReactNode } from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import { AuditProvider } from '@/contexts/AuditContext';
import { RiskProvider } from '@/contexts/RiskContext';
import { FrameworkProvider } from '@/contexts/FrameworkContext';
import { ActionPlanProvider } from '@/contexts/ActionPlanContext';
import { DocumentProvider } from '@/contexts/DocumentContext';
import { NotificationProvider } from '@/contexts/NotificationContext';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <AuditProvider>
        <RiskProvider>
          <FrameworkProvider>
            <ActionPlanProvider>
              <DocumentProvider>
                <NotificationProvider>
                  {children}
                </NotificationProvider>
              </DocumentProvider>
            </ActionPlanProvider>
          </FrameworkProvider>
        </RiskProvider>
      </AuditProvider>
    </AuthProvider>
  );
}
