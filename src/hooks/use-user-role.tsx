"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type { UserRole } from "@/src/components/auth/wallet-connect";
import { useAccount, useDisconnect } from "wagmi";
import { useRouter } from "next/navigation";
import {
  getWalletRole,
  saveWalletRole,
  hasProfile,
} from "@/src/lib/wallet-storage";
import { toast } from "@/src/components/ui/use-toast";

interface UserRoleContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  isConnected: boolean;
  walletAddress: string | null;
  hasProfile: boolean;
  checkAndRedirect: () => Promise<void>;
}

const UserRoleContext = createContext<UserRoleContextType>({
  role: null,
  setRole: () => {},
  isConnected: false,
  walletAddress: null,
  hasProfile: false,
  checkAndRedirect: async () => {},
});

export function UserRoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole>(null);
  const [userHasProfile, setUserHasProfile] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const router = useRouter();

  // Get wallet state from wagmi
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  // Initialize state when wallet changes
  useEffect(() => {
    if (address) {
      // Get role from wallet-specific storage
      const savedRole = getWalletRole(address);
      setRole(savedRole);

      // Check if user has a profile
      const profileExists = hasProfile(address);
      setUserHasProfile(profileExists);
    } else {
      // Reset state when wallet disconnects
      setRole(null);
      setUserHasProfile(false);
    }

    setIsInitialized(true);
  }, [address]);

  // Handle role changes
  const handleSetRole = (newRole: UserRole) => {
    setRole(newRole);

    if (address && newRole) {
      // Save role to wallet-specific storage
      saveWalletRole(address, newRole);

      // Show success toast
      toast({
        title: "Role Selected",
        description: `You've selected the ${newRole} role.`,
        duration: 3000,
      });
    } else if (address) {
      // Clear role
      saveWalletRole(address, null);
    }
  };

  // Check user state and redirect accordingly
  const checkAndRedirect = async () => {
    // Don't redirect if not initialized or not connected
    if (!isInitialized || !isConnected || !address) {
      return;
    }

    // Get current path
    const path = window.location.pathname;

    // Skip redirection for these paths
    if (["/select-role", "/profile-setup"].includes(path)) {
      return;
    }

    // Check wallet state and redirect accordingly
    const savedRole = getWalletRole(address);
    const profileExists = hasProfile(address);

    if (!savedRole) {
      // No role selected, redirect to role selection
      router.push("/select-role");
    } else if (!profileExists) {
      // Role selected but no profile, redirect to profile setup
      router.push("/profile-setup");
    } else if (path === "/") {
      // On home page with role and profile, redirect to appropriate dashboard
      if (savedRole === "buyer") {
        router.push("/buyer-home");
      } else if (savedRole === "seller") {
        router.push("/marketplace");
      }
    }
  };

  // Don't render children until we've initialized
  if (!isInitialized) {
    return null;
  }

  return (
    <UserRoleContext.Provider
      value={{
        role,
        setRole: handleSetRole,
        isConnected,
        walletAddress: address || null,
        hasProfile: userHasProfile,
        checkAndRedirect,
      }}
    >
      {children}
    </UserRoleContext.Provider>
  );
}

export function useUserRole() {
  return useContext(UserRoleContext);
}
