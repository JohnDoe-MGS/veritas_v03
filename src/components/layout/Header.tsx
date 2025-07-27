"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { LogOut } from "lucide-react";
import Link from 'next/link';
import { BookOpen } from 'lucide-react';
import { NotificationBell } from './NotificationBell';

export function Header() {
  const { user, logout } = useAuth();
  const userInitials = user?.name.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';

  return (
    <header className="flex h-16 items-center justify-between px-6 bg-white border-b">
      <div>{/* Espaço reservado para alinhar o resto à direita */}</div>
      <div className="flex items-center gap-4">
          <Link href="/bluebook">
              <Button variant="ghost" size="icon" aria-label="Hub Bluebook">
                  <BookOpen className="h-5 w-5" />
              </Button>
          </Link>
          <NotificationBell />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10">
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
              <DropdownMenuItem onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sair</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
      </div>
    </header>
  );
}