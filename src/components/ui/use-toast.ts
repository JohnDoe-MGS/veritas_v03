"use client";

import { useState, useEffect } from 'react';

export interface ToastProps {
  id: string;
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
}

type ToastInput = Omit<ToastProps, 'id'>;

let listeners: Array<(toasts: ToastProps[]) => void> = [];
let memoryToasts: ToastProps[] = [];

export function toast(input: ToastInput) {
  const id = Math.random().toString(36).substring(2, 9);
  const newToast = { ...input, id };
  memoryToasts = [...memoryToasts, newToast];
  listeners.forEach((listener) => listener(memoryToasts));

  setTimeout(() => {
    memoryToasts = memoryToasts.filter((t) => t.id !== id);
    listeners.forEach((listener) => listener(memoryToasts));
  }, 4000);

  return {
    id,
    dismiss: () => {
      memoryToasts = memoryToasts.filter((t) => t.id !== id);
      listeners.forEach((listener) => listener(memoryToasts));
    },
  };
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastProps[]>(memoryToasts);

  useEffect(() => {
    listeners.push(setToasts);
    return () => {
      listeners = listeners.filter((l) => l !== setToasts);
    };
  }, []);

  return {
    toasts,
    toast,
    dismiss: (id: string) => {
      memoryToasts = memoryToasts.filter((t) => t.id !== id);
      listeners.forEach((listener) => listener(memoryToasts));
    },
  };
}
