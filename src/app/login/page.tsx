"use client";

import { LoginForm } from '@/components/auth/LoginForm';
import { motion } from 'framer-motion';

export default function LoginPage() {
  return (
    <div 
      className="flex items-center justify-center min-h-screen w-full relative overflow-hidden px-4 py-8 sm:px-6 md:px-8"
      style={{
        background: 'radial-gradient(circle at center, #1e293b 0%, #0f172a 100%)',
      }}
    >

      {/* Ondas Fluidas SVG Animadas com Alta Aceleração */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40 select-none">
        <svg className="w-full h-full absolute inset-0" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" viewBox="0 0 1440 800">
          <defs>
            <linearGradient id="blueGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1d4ed8" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#0f172a" stopOpacity="0.02" />
            </linearGradient>
            <linearGradient id="blueGrad2" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0.01" />
            </linearGradient>
            <linearGradient id="blueGrad3" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0.01" />
            </linearGradient>
            <linearGradient id="blueGrad4" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#2563eb" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#020617" stopOpacity="0.01" />
            </linearGradient>
            <linearGradient id="blueGrad5" x1="100%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.06" />
              <stop offset="100%" stopColor="#1e40af" stopOpacity="0.01" />
            </linearGradient>
            <linearGradient id="blueGrad6" x1="50%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.09" />
              <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0.02" />
            </linearGradient>
          </defs>
          
          {/* Onda 1 */}
          <motion.path 
            d="M0,100 C300,150 600,50 900,180 C1200,310 1300,100 1440,150 L1440,800 L0,800 Z" 
            fill="url(#blueGrad1)"
            animate={{
              d: [
                "M0,100 C300,150 600,50 900,180 C1200,310 1300,100 1440,150 L1440,800 L0,800 Z",
                "M0,130 C400,80 700,200 1000,120 C1300,40 1350,180 1440,120 L1440,800 L0,800 Z",
                "M0,100 C300,150 600,50 900,180 C1200,310 1300,100 1440,150 L1440,800 L0,800 Z"
              ]
            }}
            transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Onda 2 */}
          <motion.path 
            d="M0,220 C400,180 800,320 1100,190 C1400,60 1420,250 1440,210 L1440,800 L0,800 Z" 
            fill="url(#blueGrad2)"
            animate={{
              d: [
                "M0,220 C400,180 800,320 1100,190 C1400,60 1420,250 1440,210 L1440,800 L0,800 Z",
                "M0,180 C350,270 750,190 1050,250 C1350,310 1400,170 1440,230 L1440,800 L0,800 Z",
                "M0,220 C400,180 800,320 1100,190 C1400,60 1420,250 1440,210 L1440,800 L0,800 Z"
              ]
            }}
            transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Onda 3 */}
          <motion.path 
            d="M0,350 C300,420 700,280 1000,380 C1300,480 1380,320 1440,360 L1440,800 L0,800 Z" 
            fill="url(#blueGrad3)"
            animate={{
              d: [
                "M0,350 C300,420 700,280 1000,380 C1300,480 1380,320 1440,360 L1440,800 L0,800 Z",
                "M0,390 C400,350 650,400 950,320 C1250,240 1390,440 1440,380 L1440,800 L0,800 Z",
                "M0,350 C300,420 700,280 1000,380 C1300,480 1380,320 1440,360 L1440,800 L0,800 Z"
              ]
            }}
            transition={{ duration: 32, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Onda 4 */}
          <motion.path 
            d="M0,480 C500,400 800,550 1200,450 C1350,400 1400,520 1440,490 L1440,800 L0,800 Z" 
            fill="url(#blueGrad4)"
            animate={{
              d: [
                "M0,480 C500,400 800,550 1200,450 C1350,400 1400,520 1440,490 L1440,800 L0,800 Z",
                "M0,520 C420,490 850,450 1150,520 C1380,580 1420,440 1440,460 L1440,800 L0,800 Z",
                "M0,480 C500,400 800,550 1200,450 C1350,400 1400,520 1440,490 L1440,800 L0,800 Z"
              ]
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Onda 5 */}
          <motion.path 
            d="M0,600 C300,550 600,680 900,580 C1200,480 1350,620 1440,570 L1440,800 L0,800 Z" 
            fill="url(#blueGrad5)"
            animate={{
              d: [
                "M0,600 C300,550 600,680 900,580 C1200,480 1350,620 1440,570 L1440,800 L0,800 Z",
                "M0,560 C380,630 650,580 950,640 C1250,700 1300,540 1440,610 L1440,800 L0,800 Z",
                "M0,600 C300,550 600,680 900,580 C1200,480 1350,620 1440,570 L1440,800 L0,800 Z"
              ]
            }}
            transition={{ duration: 38, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Onda 6 */}
          <motion.path 
            d="M0,700 C400,750 800,650 1100,720 C1300,780 1400,680 1440,710 L1440,800 L0,800 Z" 
            fill="url(#blueGrad6)"
            animate={{
              d: [
                "M0,700 C400,750 800,650 1100,720 C1300,780 1400,680 1440,710 L1440,800 L0,800 Z",
                "M0,730 C350,680 750,730 1050,670 C1350,620 1380,750 1440,680 L1440,800 L0,800 Z",
                "M0,700 C400,750 800,650 1100,720 C1300,780 1400,680 1440,710 L1440,800 L0,800 Z"
              ]
            }}
            transition={{ duration: 42, repeat: Infinity, ease: "easeInOut" }}
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
