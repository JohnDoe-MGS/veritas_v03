import { useToast } from "@/components/ui/use-toast";

export function useExportToCsv() {
    const { toast } = useToast();

    const exportToCsv = (data: any[], filename: string) => {
        if (!data || data.length === 0) {
            toast({
                variant: "destructive",
                title: "Nenhum dado para exportar",
                description: "A tabela está vazia.",
            });
            return;
        }

        const headers = Object.keys(data[0]);
        const csvHeader = headers.join(',');

        const csvRows = data.map(row => {
            return headers.map(header => {
                let cell = row[header] === null || row[header] === undefined ? '' : row[header];
                
                if (typeof cell === 'string' && (cell.includes(',') || cell.includes('"'))) {
                    cell = `"${cell.replace(/"/g, '""')}"`;
                }

                return cell;
            }).join(',');
        });

        const csvContent = [csvHeader, ...csvRows].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.href) {
            URL.revokeObjectURL(link.href);
        }
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', `${filename}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast({
            title: "Exportação Concluída",
            description: `O arquivo ${filename}.csv foi baixado com sucesso.`,
        });
    };

    return { exportToCsv };
}