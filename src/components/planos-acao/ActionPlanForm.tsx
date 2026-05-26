"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useActionPlans } from '@/contexts/ActionPlanContext';
import { useRisks } from '@/contexts/RiskContext';
import { ActionPlan } from '@/lib/types';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { DatePicker } from '@/components/ui/date-picker';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';

const planSchema = z.object({
  title: z.string().min(3, { message: "O título deve ter pelo menos 3 caracteres." }),
  description: z.string().optional(),
  type: z.enum(['Ação', 'Contingência']),
  priority: z.enum(['Baixa', 'Média', 'Alta', 'Crítica']),
  status: z.enum(['Planejado', 'Em Andamento', 'Concluído', 'Cancelado']),
  assignee: z.string().min(1, { message: "O responsável é obrigatório." }),
  startDate: z.date({ required_error: "A data de início é obrigatória." }),
  dueDate: z.date({ required_error: "A data de prazo é obrigatória." }),
  budget: z.coerce.number().min(0, { message: "O orçamento deve ser maior ou igual a 0." }),
  progress: z.coerce.number().min(0).max(100, { message: "O progresso deve ser entre 0% e 100%." }),
  relatedRisks: z.array(z.string()),
});

type PlanFormValues = z.infer<typeof planSchema>;

interface ActionPlanFormProps {
  planToEdit?: ActionPlan;
  onFormSubmit: () => void;
}

export function ActionPlanForm({ planToEdit, onFormSubmit }: ActionPlanFormProps) {
  const { addActionPlan, updateActionPlan } = useActionPlans();
  const { risks } = useRisks();

  const form = useForm<PlanFormValues>({
    resolver: zodResolver(planSchema),
    defaultValues: {
      title: planToEdit?.title || "",
      description: planToEdit?.description || "",
      type: planToEdit?.type || 'Ação',
      priority: planToEdit?.priority || 'Média',
      status: planToEdit?.status || 'Planejado',
      assignee: planToEdit?.assignee || "",
      startDate: planToEdit ? new Date(planToEdit.startDate) : new Date(),
      dueDate: planToEdit ? new Date(planToEdit.dueDate) : new Date(),
      budget: planToEdit?.budget || 0,
      progress: planToEdit?.progress || 0,
      relatedRisks: planToEdit?.relatedRisks || [],
    },
  });

  const onSubmit = (data: PlanFormValues) => {
    const planData = {
      ...data,
      description: data.description || "",
      startDate: data.startDate.toISOString(),
      dueDate: data.dueDate.toISOString(),
      attachments: planToEdit?.attachments || [],
    };

    if (planToEdit) {
      updateActionPlan(planToEdit.id, planData);
    } else {
      addActionPlan(planData);
    }
    onFormSubmit();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-h-[75vh] overflow-y-auto pr-4">
        <FormField name="title" control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel>Título do Plano</FormLabel>
            <FormControl><Input placeholder="Ex: Treinamento de segurança de dados..." {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField name="description" control={form.control} render={({ field }) => (
          <FormItem>
            <FormLabel>Descrição (Opcional)</FormLabel>
            <FormControl><Textarea placeholder="Descreva os passos e objetivos do plano..." {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <div className="grid grid-cols-2 gap-4">
          <FormField name="type" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Plano</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                <SelectContent>
                  <SelectItem value="Ação">Ação corretiva/preventiva</SelectItem>
                  <SelectItem value="Contingência">Contingência</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )} />

          <FormField name="priority" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Prioridade</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                <SelectContent>
                  <SelectItem value="Baixa">Baixa</SelectItem>
                  <SelectItem value="Média">Média</SelectItem>
                  <SelectItem value="Alta">Alta</SelectItem>
                  <SelectItem value="Crítica">Crítica</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField name="status" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                <SelectContent>
                  <SelectItem value="Planejado">Planejado</SelectItem>
                  <SelectItem value="Em Andamento">Em Andamento</SelectItem>
                  <SelectItem value="Concluído">Concluído</SelectItem>
                  <SelectItem value="Cancelado">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )} />

          <FormField name="assignee" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Responsável</FormLabel>
              <FormControl><Input placeholder="Ex: Nome da equipe ou colaborador..." {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField name="startDate" control={form.control} render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Data de Início</FormLabel>
              <DatePicker date={field.value} setDate={field.onChange} />
              <FormMessage />
            </FormItem>
          )} />

          <FormField name="dueDate" control={form.control} render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Prazo de Conclusão</FormLabel>
              <DatePicker date={field.value} setDate={field.onChange} />
              <FormMessage />
            </FormItem>
          )} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField name="budget" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Orçamento (R$)</FormLabel>
              <FormControl><Input type="number" step="0.01" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField name="progress" control={form.control} render={({ field }) => (
            <FormItem>
              <FormLabel>Progresso (%)</FormLabel>
              <FormControl><Input type="number" min="0" max="100" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>

        <FormField name="relatedRisks" control={form.control} render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Riscos Associados</FormLabel>
            <ScrollArea className="h-28 border rounded-md p-2">
              <div className="space-y-2">
                {risks.filter(r => r.status !== 'Arquivado').map((risk) => (
                  <label key={risk.id} className="flex items-center space-x-2 text-sm cursor-pointer p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
                    <Checkbox
                      checked={field.value.includes(risk.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          field.onChange([...field.value, risk.id]);
                        } else {
                          field.onChange(field.value.filter((id) => id !== risk.id));
                        }
                      }}
                    />
                    <span>{risk.title} ({risk.riskLevel})</span>
                  </label>
                ))}
                {risks.filter(r => r.status !== 'Arquivado').length === 0 && (
                  <span className="text-xs text-muted-foreground italic">Nenhum risco ativo cadastrado.</span>
                )}
              </div>
            </ScrollArea>
          </FormItem>
        )} />

        <Button type="submit" className="w-full">{planToEdit ? 'Salvar Alterações' : 'Criar Plano de Ação'}</Button>
      </form>
    </Form>
  );
}
