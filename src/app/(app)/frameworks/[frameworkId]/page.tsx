"use client";

import { useFrameworks } from "@/contexts/FrameworkContext";
import { Requirement } from "@/lib/types";
import { useParams } from "next/navigation";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EvidenceUploader } from "@/components/frameworks/EvidenceUploader";
import { Can } from "@/components/auth/Can";

const StatusSelector = ({ requirement }: { requirement: Requirement }) => {
    const { updateRequirementStatus } = useFrameworks();
    const params = useParams();
    const frameworkId = params.frameworkId as string;

    const handleStatusChange = (newStatus: Requirement['status']) => {
        updateRequirementStatus(frameworkId, requirement.id, newStatus);
    };

    return (
        <Can role="admin">
            <Select onValueChange={handleStatusChange} defaultValue={requirement.status}>
                <SelectTrigger className="w-40">
                    <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Não Iniciado">Não Iniciado</SelectItem>
                    <SelectItem value="Em Progresso">Em Progresso</SelectItem>
                    <SelectItem value="Concluído">Concluído</SelectItem>
                </SelectContent>
            </Select>
        </Can>
    );
};

export default function FrameworkDetailPage() {
  const params = useParams();
  const { getFrameworkById } = useFrameworks();
  const frameworkId = params.frameworkId as string;
  const framework = getFrameworkById(frameworkId);

  if (!framework) return <div>Framework não encontrado.</div>;
  
  const requirementsByClause = framework.requirements.reduce((acc, req) => {
    (acc[req.clause] = acc[req.clause] || []).push(req);
    return acc;
  }, {} as Record<string, Requirement[]>);

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold">{framework.name}</h1>
      <p className="text-muted-foreground mt-2">{framework.description}</p>
      <Accordion type="single" collapsible className="w-full mt-8" defaultValue={Object.keys(requirementsByClause)[0]}>
        {Object.entries(requirementsByClause).map(([clause, requirements]) => (
          <AccordionItem key={clause} value={clause}>
            <AccordionTrigger className="text-lg font-semibold">{clause}</AccordionTrigger>
            <AccordionContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead scope="col" className="w-[40%]">Requisito</TableHead>
                    <TableHead scope="col">Responsável</TableHead>
                    <TableHead scope="col">Status</TableHead>
                    <TableHead scope="col">Evidências</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requirements.map(req => (
                    <TableRow key={req.id}>
                      <TableCell>{req.description}</TableCell>
                      <TableCell>{req.assignee}</TableCell>
                      <TableCell><StatusSelector requirement={req} /></TableCell>
                      <TableCell><EvidenceUploader requirement={req} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}