"use client";

import { useEffect, useId } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRisks } from '@/contexts/RiskContext';
import { calculateRiskLevel } from '@/lib/utils';
import { Risk } from '@/lib/types';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { DatePicker } from '../ui/date-picker';

const riskSchema = z.object({
  title: z.string().min(3, { message: "O título deve ter pelo menos 3 caracteres." }),
  description: z.string().min(10, { message: "A descrição é obrigatória." }),
  category: z.enum(['Operacional', 'Financeiro', 'Regulatório', 'Reputacional', 'Estratégico']),
  probability: z.coerce.number().min(1).max(5),
  impact: z.coerce.number().min(1).max(5),
  riskLevel: z.enum(['Baixo', 'Médio', 'Alto', 'Crítico']),
  owner: z.string().min(1, { message: "O responsável é obrigatório." }),
  status: z.enum(['Ativo', 'Mitigado', 'Monitorado', 'Arquivado']),
  dueDate: z.date({ required_error: "A data de prazo é obrigatória." }),
});

type RiskFormValues = z.infer<typeof riskSchema>;

interface RiskFormProps {
  riskToEdit?: Risk;
  onFormSubmit: () => void;
}

export function RiskForm({ riskToEdit, onFormSubmit }: RiskFormProps) {
  const { addRisk, updateRisk } = useRisks();

  const form = useForm<RiskFormValues>({
    resolver: zodResolver(riskSchema),
    defaultValues: {
      title: riskToEdit?.title || "",
      description: riskToEdit?.description || "",
      category: riskToEdit?.category || 'Operacional',
      probability: riskToEdit?.probability || 1,
      impact: riskToEdit?.impact || 1,
      riskLevel: riskToEdit?.riskLevel || 'Baixo',
      owner: riskToEdit?.owner || "",
      status: riskToEdit?.status || 'Ativo',
      dueDate: riskToEdit ? new Date(riskToEdit.dueDate) : new Date(),
    },
  });

  const probability = form.watch('probability');
  const impact = form.watch('impact');

  useEffect(() => {
    const level = calculateRiskLevel(probability, impact);
    form.setValue('riskLevel', level);
  }, [probability, impact, form]);

  const onSubmit = (data: RiskFormValues) => {
    const riskData = {
        ...data,
        dueDate: data.dueDate.toISOString(),
        attachments: riskToEdit?.attachments || [],
        actionPlans: riskToEdit?.actionPlans || [],
    };

    if (riskToEdit) {
        updateRisk(riskToEdit.id, riskData);
    } else {
        addRisk(riskData as any);
    }
    onFormSubmit();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-h-[70vh] overflow-y-auto pr-4">
        <FormField name="title" control={form.control} render={({ field }) => (
            <FormItem><FormLabel>Título do Risco</FormLabel><FormControl><Input placeholder="Ex: Vazamento de dados..." {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField name="description" control={form.control} render={({ field }) => (
            <FormItem><FormLabel>Descrição Detalhada</FormLabel><FormControl><Textarea placeholder="Descreva o risco, suas causas e consequências..." {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <div className="grid grid-cols-2 gap-4">
            <FormField name="probability" control={form.control} render={({ field }) => (
                <FormItem><FormLabel>Probabilidade</FormLabel><Select onValueChange={(value) => field.onChange(Number(value))} defaultValue={String(field.value)}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent>{[1,2,3,4,5].map(p => <SelectItem key={p} value={String(p)}>{p}</SelectItem>)}</SelectContent></Select></FormItem>
            )} />
            <FormField name="impact" control={form.control} render={({ field }) => (
                <FormItem><FormLabel>Impacto</FormLabel><Select onValueChange={(value) => field.onChange(Number(value))} defaultValue={String(field.value)}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent>{[1,2,3,4,5].map(i => <SelectItem key={i} value={String(i)}>{i}</SelectItem>)}</SelectContent></Select></FormItem>
            )} />
        </div>
        <FormField name="riskLevel" control={form.control} render={({ field }) => (
            <FormItem><FormLabel>Nível de Risco (Calculado)</FormLabel><FormControl><Input {...field} readOnly className="font-bold bg-gray-100" /></FormControl></FormItem>
        )} />
        <FormField name="dueDate" control={form.control} render={({ field }) => (
            <FormItem className='flex flex-col'><FormLabel>Prazo</FormLabel><DatePicker date={field.value} setDate={field.onChange} /><FormMessage /></FormItem>
        )} />
        <Button type="submit">{riskToEdit ? 'Salvar Alterações' : 'Criar Risco'}</Button>
      </form>
    </Form>
  );
}