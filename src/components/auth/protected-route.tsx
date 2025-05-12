"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUserRole } from "@/src/hooks/use-user-role";
import { useAccount } from "wagmi";
import { getWalletRole, hasProfile } from "@/src/lib/wallet-storage";

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
  const { role, isConnected, isRedirecting } = useUserRole();
  const { address } = useAccount();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);

  // Debug function to log state
  const logState = (message: string, data?: any) => {
    if (process.env.NODE_ENV === "development") {
      console.log(`[ProtectedRoute] ${message}`, {
        pathname,
        address,
        isConnected,
        role,
        requireAuth,
        requireRole,
        isRedirecting,
        ...data,
      });
    }
  };

  useEffect(() => {
    // Skip if we've already checked auth or if we're redirecting
    if (hasCheckedAuth || isRedirecting) return;

    // Public routes that don't require authentication
    const publicRoutes = ["/", "/select-role"];

    // Skip protection for profile setup page
    if (pathname === "/profile-setup") {
      logState(`Profile setup page, allowing access`);
      setIsAuthorized(true);
      setIsLoading(false);
      setHasCheckedAuth(true);
      return;
    }

    // If we're on a public route, allow access
    if (publicRoutes.includes(pathname || "")) {
      logState(`Public route, allowing access`);
      setIsAuthorized(true);
      setIsLoading(false);
      setHasCheckedAuth(true);
      return;
    }

    // Check if wallet is connected
    if (requireAuth && !isConnected) {
      logState(`Auth required but not connected, redirecting to home`);
      router.push("/");
      return;
    }

    // If user has a role but no profile, redirect to profile setup
    // (except when already on profile-setup page)
    if (requireAuth && address) {
      const userRole = getWalletRole(address);
      const userHasProfile = hasProfile(address);

      logState(`Checking auth requirements`, { userRole, userHasProfile });

      if (userRole && !userHasProfile && pathname !== "/profile-setup") {
        logState(`Has role but no profile, redirecting to profile setup`);
        router.push("/profile-setup");
        return;
      }

      // If a specific role is required but user doesn't have that role
      if (requireRole && userRole !== requireRole) {
        // If user has no role, send to role selection
        if (!userRole) {
          logState(
            `Specific role required but no role set, redirecting to role selection`
          );
          router.push("/select-role");
        } else {
          // If user has wrong role, send to home
          logState(`Wrong role, redirecting to home`);
          router.push("/");
        }
        return;
      }
    }

    // If we get here, user is authorized
    logState(`User is authorized`);
    setIsAuthorized(true);
    setIsLoading(false);
    setHasCheckedAuth(true);
  }, [
    router,
    pathname,
    requireAuth,
    requireRole,
    role,
    isConnected,
    address,
    isRedirecting,
    hasCheckedAuth,
  ]);

  // Reset auth check when path or address changes
  useEffect(() => {
    setHasCheckedAuth(false);
  }, [pathname, address]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return isAuthorized ? <>{children}</> : null;
}
