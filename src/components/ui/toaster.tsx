"use client";

import { useToast } from "./use-toast";
import { X } from "lucide-react";
import { Button } from "./button";

export function Toaster() {
  const { toasts, dismiss } = useToast();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-full max-w-sm">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`flex items-start justify-between p-4 rounded-lg border shadow-lg transition-all duration-300 transform translate-y-0 scale-100 ${
            t.variant === "destructive"
              ? "bg-red-600 text-white border-red-700"
              : "bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-800"
          }`}
        >
          <div className="grid gap-1">
            {t.title && <h4 className="font-semibold text-sm">{t.title}</h4>}
            {t.description && <p className="text-xs opacity-90">{t.description}</p>}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className={`h-5 w-5 p-0 -mt-1 -mr-1 rounded-full ${
              t.variant === "destructive"
                ? "text-white hover:bg-red-700"
                : "text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
            onClick={() => dismiss(t.id)}
          >
            <X className="h-3 w-3" />
            <span className="sr-only">Fechar</span>
          </Button>
        </div>
      ))}
    </div>
  );
}
