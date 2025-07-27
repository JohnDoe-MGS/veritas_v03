"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldCheck, LayoutDashboard, AlertTriangle, ListTodo, FileText, Trash2, BookText } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/matriz-riscos', label: 'Matriz de Riscos', icon: AlertTriangle },
    { href: '/planos-acao', label: 'Planos de Ação', icon: ListTodo },
    { href: '/frameworks', label: 'Frameworks', icon: BookText },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="hidden md:flex w-64 flex-shrink-0 flex-col bg-gray-800 text-white p-4">
            <div className="flex items-center mb-8">
              <ShieldCheck className="h-8 w-8 mr-2 text-compliance-accent" />
              <h1 className="text-2xl font-bold tracking-wider">VERITAS</h1>
            </div>
            <nav className="flex-1">
              <ul className="space-y-2">
                {navItems.map(item => (
                    <li key={item.href}>
                        <Link href={item.href}>
                            <div className={cn(
                                "flex items-center p-2 rounded-md cursor-pointer hover:bg-gray-700 transition-colors",
                                pathname.startsWith(item.href) && "bg-compliance-accent text-white"
                            )}>
                                <item.icon className="h-5 w-5 mr-3" />
                                <span>{item.label}</span>
                            </div>
                        </Link>
                    </li>
                ))}
              </ul>
            </nav>
            <div className="w-full">
                <Link href="/lixeira">
                    <div className="p-2 text-muted-foreground hover:bg-gray-700 hover:text-white rounded-md cursor-pointer flex items-center">
                        <Trash2 className="mr-2 h-4 w-4"/> Lixeira
                    </div>
                </Link>
            </div>
        </aside>
    );
}