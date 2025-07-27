import { LoginForm } from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <div 
      className="flex items-center justify-center min-h-screen w-full"
      style={{
        background: 'linear-gradient(135deg, #1e3a8a, #3b82f6)',
      }}
    >
      <LoginForm />
    </div>
  );
}