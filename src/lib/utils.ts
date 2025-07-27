import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { Risk } from "./types";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function calculateRiskLevel(probability: number, impact: number): Risk['riskLevel'] {
  const score = probability * impact;
  if (score <= 6) return 'Baixo';
  if (score <= 12) return 'Médio';
  if (score <= 20) return 'Alto';
  return 'Crítico';
}

export const riskLevelColors: Record<Risk['riskLevel'], string> = {
  Baixo: 'bg-green-500 hover:bg-green-600',
  Médio: 'bg-yellow-500 hover:bg-yellow-600',
  Alto: 'bg-orange-500 hover:bg-orange-600',
  Crítico: 'bg-red-500 hover:bg-red-600',
};

export function formatDateToDisplay(date: Date | string | number): string {
    if (!date) return '';
    return format(new Date(date), 'dd/MM/yyyy', { locale: ptBR });
}

export function formatDateForFilename(date: Date | string | number): string {
    if (!date) return '';
    return format(new Date(date), 'dd-MM-yyyy', { locale: ptBR });
}