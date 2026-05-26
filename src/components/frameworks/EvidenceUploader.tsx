"use client";

import React, { useRef } from 'react';
import { useParams } from 'next/navigation';
import { useFrameworks } from '@/contexts/FrameworkContext';
import { Requirement } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Paperclip, Trash2, Upload } from 'lucide-react';
import { Can } from '@/components/auth/Can';

interface EvidenceUploaderProps {
  requirement: Requirement;
}

export function EvidenceUploader({ requirement }: EvidenceUploaderProps) {
  const params = useParams();
  const frameworkId = params.frameworkId as string;
  const { addEvidenceToRequirement, removeEvidenceFromRequirement } = useFrameworks();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      addEvidenceToRequirement(frameworkId, requirement.id, file.name);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="space-y-2">
      {/* Existing Evidence List */}
      {requirement.evidence && requirement.evidence.length > 0 ? (
        <ul className="space-y-1">
          {requirement.evidence.map((evidenceName) => (
            <li key={evidenceName} className="flex items-center justify-between text-xs bg-gray-100 dark:bg-gray-800 p-1.5 rounded border">
              <span className="flex items-center max-w-[150px] truncate" title={evidenceName}>
                <Paperclip className="h-3 w-3 mr-1 flex-shrink-0 text-muted-foreground" />
                {evidenceName}
              </span>
              <Can role="admin">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={() => removeEvidenceFromRequirement(frameworkId, requirement.id, evidenceName)}
                >
                  <Trash2 className="h-3 w-3" />
                  <span className="sr-only">Remover</span>
                </Button>
              </Can>
            </li>
          ))}
        </ul>
      ) : (
        <span className="text-xs text-muted-foreground italic block">Sem evidências</span>
      )}

      {/* Upload Trigger */}
      <Can role="admin">
        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={handleUploadClick}
            className="w-full text-xs h-8 flex items-center justify-center gap-1.5"
          >
            <Upload className="h-3 w-3" />
            Anexar Evidência
          </Button>
        </div>
      </Can>
    </div>
  );
}
