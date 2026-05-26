"use client";

import { LoginForm } from '@/components/auth/LoginForm';
import { motion } from 'framer-motion';

export default function LoginPage() {
  return (
    <div 
      className="flex items-center justify-center min-h-screen w-full relative overflow-hidden px-4 py-8 sm:px-6 md:px-8"
      style={{
        background: 'radial-gradient(circle at center, #0f172a 0%, #020617 100%)',
      }}
    >
      {/* Ondas Fluidas SVG Animadas com Alta Aceleração */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-30 select-none">
        <svg className="w-full h-full absolute inset-0" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" viewBox="0 0 1440 800">
          <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0.02" />
            </linearGradient>
            <linearGradient id="grad2" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.01" />
            </linearGradient>
          </defs>
          
          {/* Onda 1 */}
          <motion.path 
            d="M0,100 C300,150 600,50 900,180 C1200,310 1300,100 1440,150 L1440,800 L0,800 Z" 
            fill="url(#grad1)"
            animate={{
              d: [
                "M0,100 C300,150 600,50 900,180 C1200,310 1300,100 1440,150 L1440,800 L0,800 Z",
                "M0,130 C400,80 700,200 1000,120 C1300,40 1350,180 1440,120 L1440,800 L0,800 Z",
                "M0,100 C300,150 600,50 900,180 C1200,310 1300,100 1440,150 L1440,800 L0,800 Z"
              ]
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          {/* Onda 2 */}
          <motion.path 
            d="M0,250 C400,200 800,350 1100,220 C1400,90 1420,280 1440,240 L1440,800 L0,800 Z" 
            fill="url(#grad2)"
            animate={{
              d: [
                "M0,250 C400,200 800,350 1100,220 C1400,90 1420,280 1440,240 L1440,800 L0,800 Z",
                "M0,210 C350,300 750,220 1050,280 C1350,340 1400,200 1440,260 L1440,800 L0,800 Z",
                "M0,250 C400,200 800,350 1100,220 C1400,90 1420,280 1440,240 L1440,800 L0,800 Z"
              ]
            }}
            transition={{
              duration: 35,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </svg>
      </div>

      {/* Orbes de Luz Fluídas com Movimentação Aleatória Suave */}
      <motion.div 
        className="absolute w-[250px] h-[250px] sm:w-[450px] sm:h-[450px] bg-blue-600/10 rounded-full blur-[90px] sm:blur-[130px] pointer-events-none"
        animate={{
          x: [0, 100, -80, 50, 0],
          y: [0, -120, 80, -60, 0],
          scale: [1, 1.15, 0.9, 1.05, 1]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div 
        className="absolute w-[200px] h-[200px] sm:w-[350px] sm:h-[350px] bg-emerald-600/5 rounded-full blur-[100px] sm:blur-[140px] pointer-events-none"
        animate={{
          x: [0, -120, 90, -50, 0],
          y: [0, 80, -110, 70, 0],
          scale: [1, 0.85, 1.1, 0.95, 1]
        }}
        transition={{
          duration: 24,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <div className="relative z-10 w-full max-w-[420px] transition-all duration-300">
        <LoginForm />
      </div>
    </div>
  );
}
