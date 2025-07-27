import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Risk } from './types';
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { formatDateForFilename } from './utils';

export const generateRiskReportPDF = (risks: Risk[]) => {
    const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
    });

    doc.setFontSize(20);
    doc.text("VERITAS", 14, 22);
    doc.setFontSize(12);
    doc.text("Relatório da Matriz de Riscos", 14, 30);
    doc.setFontSize(10);
    doc.text(`Gerado em: ${format(new Date(), "dd/MM/yyyy HH:mm", { locale: ptBR })}`, 14, 36);

    const tableHeaders = ["ID", "Título", "Categoria", "Nível", "Status", "Responsável", "Prazo"];
    const tableBody = risks.map(risk => [
        risk.id.slice(0, 8) + '...',
        risk.title,
        risk.category,
        risk.riskLevel,
        risk.status,
        risk.owner,
        format(new Date(risk.dueDate), "dd/MM/yy")
    ]);

    autoTable(doc, {
        startY: 45,
        head: [tableHeaders],
        body: tableBody,
        theme: 'striped',
        headStyles: {
            fillColor: [30, 64, 175]
        },
        didDrawPage: (data) => {
            doc.setFontSize(10);
            doc.text(`Página ${doc.internal.getNumberOfPages()}`, data.settings.margin.left, doc.internal.pageSize.height - 10);
        }
    });

    const today = formatDateForFilename(new Date());
    doc.save(`VERITAS_Relatorio_de_Riscos_${today}.pdf`);
};