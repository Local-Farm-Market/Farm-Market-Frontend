"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type { UserRole } from "@/src/components/auth/wallet-connect";

interface UserRoleContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  isConnected: boolean;
  walletAddress: string | null;
}

const UserRoleContext = createContext<UserRoleContextType>({
  role: null,
  setRole: () => {},
  isConnected: false,
  walletAddress: null,
});

export function UserRoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  useEffect(() => {
    // Check localStorage for saved role and wallet on mount
    const savedRole = localStorage.getItem("userRole") as UserRole;
    const savedWallet = localStorage.getItem("walletAddress");

    if (savedRole) {
      setRole(savedRole);
    }

    if (savedWallet) {
      setWalletAddress(savedWallet);
      setIsConnected(true);
    }
  }, []);

  const handleSetRole = (newRole: UserRole) => {
    setRole(newRole);

    if (newRole) {
      localStorage.setItem("userRole", newRole);
    } else {
      localStorage.removeItem("userRole");
      setWalletAddress(null);
      setIsConnected(false);
    }
  };

  return (
    <UserRoleContext.Provider
      value={{
        role,
        setRole: handleSetRole,
        isConnected,
        walletAddress,
      }}
    >
      {children}
    </UserRoleContext.Provider>
  );
}

export function useUserRole() {
  return useContext(UserRoleContext);
}
