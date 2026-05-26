"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { ShieldCheck, Loader2 } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { motion } from 'framer-motion';

// Esquema Zod flexível para aceitar 'admin' ou email válido de corporações
const loginSchema = z.object({
  email: z.string().refine(
    (val) => val === "admin" || z.string().email().safeParse(val).success,
    { message: "Insira um e-mail corporativo válido ou 'admin' para homologar." }
  ),
  password: z.string().min(1, { message: "A senha é obrigatória." }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
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

  // Coordenadas das micro-partículas estelares ao redor do botão (Volume triplicado: 18 partículas)
  const particles = [
    { id: 1, x: -60, y: -20, delay: 0.1 },
    { id: 2, x: 65, y: -25, delay: 0.3 },
    { id: 3, x: -55, y: 20, delay: 0.2 },
    { id: 4, x: 60, y: 25, delay: 0.4 },
    { id: 5, x: 0, y: -28, delay: 0.5 },
    { id: 6, x: -5, y: 28, delay: 0.6 },
    { id: 7, x: -110, y: -15, delay: 0.15 },
    { id: 8, x: 110, y: -18, delay: 0.35 },
    { id: 9, x: -105, y: 15, delay: 0.25 },
    { id: 10, x: 105, y: 18, delay: 0.45 },
    { id: 11, x: -80, y: -24, delay: 0.55 },
    { id: 12, x: 80, y: 24, delay: 0.22 },
    { id: 13, x: -30, y: -26, delay: 0.12 },
    { id: 14, x: 30, y: 26, delay: 0.32 },
    { id: 15, x: -120, y: 0, delay: 0.42 },
    { id: 16, x: 120, y: 0, delay: 0.62 },
    { id: 17, x: -10, y: -28, delay: 0.72 },
    { id: 18, x: 10, y: 28, delay: 0.82 },
  ];

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
          Acesse a plataforma de Governança, Riscos e Compliance
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-slate-300 text-xs font-semibold uppercase tracking-wider">Usuário ou E-mail</Label>
          <Input 
            id="email" 
            type="text" 
            placeholder="admin ou nome@empresa.com" 
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

        <div className="relative pt-2">
          {/* Pontos brancos estelares interativos ao passar o mouse (80% menores: w-0.5 h-0.5 / 1.5px) */}
          {isHovered && !loading && particles.map((p) => (
            <motion.div
              key={p.id}
              className="absolute rounded-full pointer-events-none z-20 bg-white"
              style={{
                width: '1.2px',
                height: '1.2px',
                left: `calc(50% + ${p.x}px)`,
                top: `calc(50% + ${p.y}px)`,
                boxShadow: '0 0 4px 1px rgba(255, 255, 255, 0.8)',
              }}
              animate={{
                scale: [1, 1.8, 1],
                opacity: [0.4, 0.9, 0.4],
                x: [p.x, p.x * 1.08, p.x],
                y: [p.y, p.y * 1.08, p.y],
              }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                delay: p.delay,
                ease: "easeInOut"
              }}
            />
          ))}


          <motion.button 
            type="submit" 
            disabled={loading} 
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            whileHover={{ scale: 1.015, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.4)" }}
            whileTap={{ scale: 0.985 }}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold py-3 rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed z-10 relative overflow-hidden"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-white" />
                <span>Autenticando...</span>
              </>
            ) : "Entrar na Plataforma"}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
}

