import { LoginForm } from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <div 
      className="flex items-center justify-center min-h-screen w-full relative overflow-hidden"
      style={{
        background: 'radial-gradient(circle at top left, #0f172a, #020617)',
      }}
    >
      {/* Elementos Decorativos de Fundo Fluídos */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-600/5 rounded-full blur-[150px] pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-md px-4">
        <LoginForm />
      </div>
    </div>
  );
}