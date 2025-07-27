"use client";

import { Bell, AlertCircle, Repeat } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useNotifications } from "@/contexts/NotificationContext";
import { formatDateToDisplay } from "@/lib/utils";

export function NotificationBell() {
    const { notifications, unreadCount, markAllAsRead } = useNotifications();

    return (
        <Popover onOpenChange={(open) => {
            if (!open && unreadCount > 0) {
                markAllAsRead();
            }
        }}>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                            {unreadCount}
                        </span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80">
                <div className="p-4">
                    <h4 className="font-medium leading-none mb-4">Notificações</h4>
                    <div className="space-y-4 max-h-80 overflow-y-auto">
                        {notifications.length > 0 ? (
                            notifications.map(n => {
                                const isSimulation = n.type === 'Simulação Vencida';
                                const Icon = isSimulation ? Repeat : AlertCircle;
                                const dueDateLabel = isSimulation ? "Prazo da Simulação" : "Prazo";

                                return (
                                    <div key={n.id} className="flex items-start">
                                        <Icon className={`h-4 w-4 mt-1 ${isSimulation ? 'text-blue-500' : 'text-red-500'}`} />
                                        <div className="ml-3">
                                            <p className="text-sm font-medium">{n.message}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {dueDateLabel}: {formatDateToDisplay(n.dueDate)}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <p className="text-sm text-muted-foreground text-center">Nenhuma notificação.</p>
                        )}
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}