"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { ShieldCheck, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

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
        title: "Sucesso!",
        description: "Login realizado com sucesso. Redirecionando...",
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Ocorreu um erro.";
      toast({
        variant: "destructive",
        title: "Erro no Login",
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mx-auto max-w-sm w-full shadow-lg rounded-lg" style={{ borderRadius: '8px' }}>
      <CardHeader className="text-center">
        <ShieldCheck className="mx-auto h-12 w-12 text-compliance-primary" style={{ color: '#1e40af' }}/>
        <CardTitle className="text-3xl font-bold mt-2 tracking-wider">VERITAS</CardTitle>
        <CardDescription>Acesse sua conta para gerenciar o compliance</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="admin@veritas.com" {...form.register("email")} />
            {form.formState.errors.email && (<p className="text-sm text-red-500">{form.formState.errors.email.message}</p>)}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input id="password" type="password" {...form.register("password")} />
             {form.formState.errors.password && (<p className="text-sm text-red-500">{form.formState.errors.password.message}</p>)}
          </div>
          <Button type="submit" className="w-full" disabled={loading} style={{ backgroundColor: '#1e40af' }}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Entrar"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}