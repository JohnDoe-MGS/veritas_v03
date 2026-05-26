"use client";

import React, { useState } from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { LogOut, BookOpen, Menu, X, ShieldCheck, LayoutDashboard, AlertTriangle, ListTodo, BookText, Trash2 } from "lucide-react";
import Link from 'next/link';
import { NotificationBell } from './NotificationBell';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/matriz-riscos', label: 'Matriz de Riscos', icon: AlertTriangle },
    { href: '/planos-acao', label: 'Planos de Ação', icon: ListTodo },
    { href: '/frameworks', label: 'Frameworks', icon: BookText },
];

export function Header() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const userInitials = user?.name.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';

  return (
    <header className="flex h-16 items-center justify-between px-4 sm:px-6 bg-white border-b relative z-30">
      <div className="flex items-center gap-2">
        {/* Menu Hambúrguer Móvel */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden text-gray-700 focus:ring-0 focus:ring-offset-0" 
          onClick={() => setMobileMenuOpen(true)}
          aria-label="Abrir Menu"
        >
          <Menu className="h-6 w-6" />
        </Button>
        <div className="md:hidden flex items-center">
          <ShieldCheck className="h-6 w-6 mr-1.5 text-blue-600" />
          <span className="font-bold text-lg text-slate-800 tracking-wider">VERITAS</span>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
          <Link href="/bluebook">
              <Button variant="ghost" size="icon" aria-label="Hub Bluebook" className="text-gray-700 hover:bg-gray-100 hover:text-slate-900 transition-colors">
                  <BookOpen className="h-5 w-5" />
              </Button>
          </Link>
          <NotificationBell />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full focus-visible:ring-0">
                <Avatar className="h-10 w-10 border border-gray-200">
                  <AvatarImage src={`https://avatar.vercel.sh/${user?.email}.png`} alt={user?.name} />
                  <AvatarFallback>{userInitials}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="cursor-pointer text-red-600 focus:bg-red-50">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sair</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
      </div>

      {/* Drawer Móvel de Navegação (Sheet com framer-motion) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop / Máscara Escura */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black z-40 md:hidden"
            />
            {/* Corpo do Drawer Lateral */}
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 bottom-0 left-0 w-72 bg-slate-900 text-white z-50 p-6 flex flex-col shadow-2xl md:hidden"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center">
                  <ShieldCheck className="h-8 w-8 mr-2 text-blue-400" />
                  <span className="text-2xl font-bold tracking-wider text-white">VERITAS</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-400 hover:text-white hover:bg-slate-800"
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>

              <nav className="flex-1">
                <ul className="space-y-3">
                  {navItems.map(item => (
                    <li key={item.href}>
                      <Link href={item.href} onClick={() => setMobileMenuOpen(false)}>
                        <div className={cn(
                          "flex items-center p-3 rounded-xl cursor-pointer hover:bg-slate-800 transition-all font-medium",
                          pathname.startsWith(item.href) ? "bg-blue-600 text-white shadow-lg shadow-blue-600/10" : "text-slate-300 hover:text-white"
                        )}>
                          <item.icon className="h-5 w-5 mr-3" />
                          <span>{item.label}</span>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              <div className="w-full pt-4 border-t border-slate-800">
                <Link href="/lixeira" onClick={() => setMobileMenuOpen(false)}>
                  <div className="p-3 text-slate-400 hover:bg-slate-800 hover:text-white rounded-xl cursor-pointer flex items-center transition-colors">
                    <Trash2 className="mr-3 h-5 w-5"/> 
                    <span>Lixeira</span>
                  </div>
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}