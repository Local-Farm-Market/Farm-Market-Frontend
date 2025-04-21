"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUserRole } from "@/src/hooks/use-user-role";

interface ProtectedRouteProps {
  children: ReactNode;
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
  const { role, isConnected } = useUserRole();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Public routes that don't require authentication
    const publicRoutes = ["/", "/select-role"];

    // Skip protection for profile setup page
    if (pathname === "/profile-setup") {
      setIsAuthorized(true);
      setIsLoading(false);
      return;
    }

    // If we're on a public route, allow access
    if (publicRoutes.includes(pathname)) {
      setIsAuthorized(true);
      setIsLoading(false);
      return;
    }

    // Check if wallet is connected
    const walletAddress = localStorage.getItem("walletAddress");
    const userRole = localStorage.getItem("userRole");
    const hasProfile = localStorage.getItem("userProfile");

    // If authentication is required but wallet is not connected
    if (requireAuth && !walletAddress) {
      router.push("/");
      return;
    }

    // If user has a role but no profile, redirect to profile setup
    // (except when already on profile-setup page)
    if (
      requireAuth &&
      walletAddress &&
      userRole &&
      !hasProfile &&
      pathname !== "/profile-setup"
    ) {
      router.push("/profile-setup");
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
  }, [router, pathname, requireAuth, requireRole, role, isConnected]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return isAuthorized ? <>{children}</> : null;
}
