// hooks/use-user-role.tsx
"use client";

import type React from "react";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAccount } from "wagmi";
import { useUserProfile } from "./use-user-profile";

export type UserRole = "buyer" | "seller" | null;

interface UserRoleContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  isConnected: boolean;
  walletAddress: string | undefined;
  checkAndRedirect: () => void;
  isRedirecting: boolean; // Add this property
}

const UserRoleContext = createContext<UserRoleContextType | undefined>(
  undefined
);

export function UserRoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<UserRole>(null);
  const [isRedirecting, setIsRedirecting] = useState(false); // Add this state
  const router = useRouter();
  const pathname = usePathname();
  const { address, isConnected } = useAccount();
  const { profile, isLoading } = useUserProfile();

  // Update role based on user profile
  useEffect(() => {
    if (profile && !isLoading) {
      setRole(profile.isSeller ? "seller" : "buyer");
    } else if (!isConnected) {
      setRole(null);
    }
  }, [profile, isLoading, isConnected]);

  // Check if user should be redirected based on role and current path
  const checkAndRedirect = () => {
    // If user is not connected, redirect to home
    if (!isConnected) {
      if (
        pathname !== "/" &&
        !pathname.includes("/select-role") &&
        !pathname.includes("/profile-setup")
      ) {
        setIsRedirecting(true); // Set redirecting state
        router.push("/");
        setTimeout(() => setIsRedirecting(false), 500); // Reset after navigation
      }
      return;
    }

    // If user doesn't have a profile, redirect to profile setup
    if (isConnected && !isLoading && !profile?.name) {
      if (pathname !== "/profile-setup" && pathname !== "/select-role") {
        setIsRedirecting(true); // Set redirecting state
        router.push("/select-role");
        setTimeout(() => setIsRedirecting(false), 500); // Reset after navigation
      }
      return;
    }

    // If user has a profile but is on a page that requires a specific role
    if (profile?.name) {
      const isSeller = profile.isSeller;
      const currentRole = isSeller ? "seller" : "buyer";
      setRole(currentRole);

      // Redirect seller trying to access buyer-only pages
      if (
        isSeller &&
        (pathname.includes("/cart") || pathname.includes("/checkout"))
      ) {
        setIsRedirecting(true); // Set redirecting state
        router.push("/marketplace");
        setTimeout(() => setIsRedirecting(false), 500); // Reset after navigation
        return;
      }

      // Redirect buyer to appropriate home page
      if (!isSeller && pathname === "/") {
        setIsRedirecting(true); // Set redirecting state
        router.push("/buyer-home");
        setTimeout(() => setIsRedirecting(false), 500); // Reset after navigation
        return;
      }

      // Redirect seller to appropriate home page
      if (isSeller && pathname === "/") {
        setIsRedirecting(true); // Set redirecting state
        router.push("/seller-home");
        setTimeout(() => setIsRedirecting(false), 500); // Reset after navigation
        return;
      }
    }
  };

  // Check for redirects on initial load and when connection status changes
  useEffect(() => {
    if (!isLoading) {
      checkAndRedirect();
    }
  }, [isConnected, profile, isLoading, pathname]);

  return (
    <UserRoleContext.Provider
      value={{
        role,
        setRole,
        isConnected,
        walletAddress: address,
        checkAndRedirect,
        isRedirecting, // Include in context value
      }}
    >
      {children}
    </UserRoleContext.Provider>
  );
}

export function useUserRole() {
  const context = useContext(UserRoleContext);
  if (context === undefined) {
    throw new Error("useUserRole must be used within a UserRoleProvider");
  }
  return context;
}
