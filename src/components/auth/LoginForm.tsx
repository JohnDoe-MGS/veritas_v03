"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { ShieldCheck, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { motion } from 'framer-motion';

const loginSchema = z.object({
  email: z.string().email({ message: "Por favor, insira um email válido." }),
  password: z.string().min(1, { message: "A senha é obrigatória." }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setLoading(true);
    try {
      await login(data.email, data.password);
      toast({
        title: "Bem-vindo de volta!",
        description: "Autenticação realizada com sucesso. Carregando painel...",
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Ocorreu um erro ao autenticar.";
      toast({
        variant: "destructive",
        title: "Falha na Autenticação",
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-8 rounded-2xl shadow-2xl relative"
    >
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500 rounded-t-2xl" />
      
      <div className="text-center mb-8">
        <div className="inline-flex p-3 bg-blue-500/10 rounded-xl mb-3 border border-blue-500/20">
          <ShieldCheck className="h-8 w-8 text-blue-400" />
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-white">VERITAS <span className="text-blue-500 font-medium text-lg tracking-normal">GRC</span></h2>
        <p className="text-slate-400 text-sm mt-2">
          Insira suas credenciais para acessar o ambiente corporativo
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-slate-300 text-xs font-semibold uppercase tracking-wider">Email Corporativo</Label>
          <Input 
            id="email" 
            type="email" 
            placeholder="nome@empresa.com" 
            className="bg-slate-950/50 border-slate-800 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-blue-500/20 transition-all"
            {...form.register("email")} 
          />
          {form.formState.errors.email && (
            <p className="text-xs text-rose-500 font-medium">{form.formState.errors.email.message}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="password" className="text-slate-300 text-xs font-semibold uppercase tracking-wider">Senha de Acesso</Label>
          </div>
          <Input 
            id="password" 
            type="password" 
            placeholder="••••••••"
            className="bg-slate-950/50 border-slate-800 text-white focus:border-blue-500 focus:ring-blue-500/20 transition-all"
            {...form.register("password")} 
          />
          {form.formState.errors.password && (
            <p className="text-xs text-rose-500 font-medium">{form.formState.errors.password.message}</p>
          )}
        </div>

        <Button 
          type="submit" 
          disabled={loading} 
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium py-2.5 rounded-xl shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.01]"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-white" />
              Autenticando...
            </span>
          ) : "Entrar na Plataforma"}
        </Button>
      </form>
    </motion.div>
  );
}