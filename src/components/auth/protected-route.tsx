"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUserRole } from "@/src/hooks/use-user-role";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requireRole?: "buyer" | "seller";
}

export function ProtectedRoute({
  children,
  requireAuth = true,
  requireRole,
}: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { role } = useUserRole();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Check if wallet is connected
    const walletAddress = localStorage.getItem("walletAddress");
    const userRole = localStorage.getItem("userRole");

    // Public routes that don't require authentication
    const publicRoutes = ["/", "/select-role"];

    // If we're on a public route, allow access
    if (publicRoutes.includes(pathname)) {
      setIsAuthorized(true);
      setIsLoading(false);
      return;
    }

    // If authentication is required but wallet is not connected
    if (requireAuth && !walletAddress) {
      router.push("/");
      return;
    }

    // If a specific role is required but user doesn't have that role
    if (requireRole && userRole !== requireRole) {
      // If user has no role, send to role selection
      if (!userRole) {
        router.push("/select-role");
      } else {
        // If user has wrong role, send to home
        router.push("/");
      }
      return;
    }

    // If we get here, user is authorized
    setIsAuthorized(true);
    setIsLoading(false);
  }, [router, pathname, requireAuth, requireRole, role]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return isAuthorized ? <>{children}</> : null;
}
