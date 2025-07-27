"use client";

import { useAuth } from "@/contexts/AuthContext";
import { ReactNode } from "react";

interface CanProps {
    children: ReactNode;
    role: 'admin';
}

export function Can({ children, role }: CanProps) {
    const { isAdmin } = useAuth();

    const canAccess = role === 'admin' ? isAdmin : false;

    if (!canAccess) {
        return null;
    }

    return <>{children}</>;
}