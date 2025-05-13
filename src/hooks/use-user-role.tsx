"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import type { UserRole } from "@/src/components/auth/wallet-connect";
import { useAccount, useDisconnect } from "wagmi";
import { useRouter, usePathname } from "next/navigation";
import {
  getWalletRole,
  saveWalletRole,
  hasProfile,
  debugDumpWalletData,
} from "@/src/lib/wallet-storage";
import { toast } from "@/src/components/ui/use-toast";

interface UserRoleContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  isConnected: boolean;
  walletAddress: string | null;
  hasProfile: boolean;
  checkAndRedirect: () => Promise<void>;
  isRedirecting: boolean;
}

const UserRoleContext = createContext<UserRoleContextType>({
  role: null,
  setRole: () => {},
  isConnected: false,
  walletAddress: null,
  hasProfile: false,
  checkAndRedirect: async () => {},
  isRedirecting: false,
});

export function UserRoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole>(null);
  const [userHasProfile, setUserHasProfile] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Track last redirection to prevent loops
  const lastRedirectPath = useRef<string | null>(null);
  const lastRedirectTime = useRef<number>(0);
  const initializationCount = useRef(0);
  const previousAddress = useRef<string | null>(null);

  // Get wallet state from wagmi
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  // Debug function to log state
  const logState = (message: string, data?: any) => {
    if (process.env.NODE_ENV === "development") {
      console.log(`[UserRoleProvider] ${message}`, {
        address,
        isConnected,
        role,
        userHasProfile,
        pathname,
        previousAddress: previousAddress.current,
        ...data,
      });
    }
  };

  // Initialize state when wallet changes
  useEffect(() => {
    const initCount = ++initializationCount.current;

    const initializeState = async () => {
      logState(`Initializing state (${initCount})`);

      // Check if address changed
      const addressChanged = address !== previousAddress.current;
      logState(`Address change check`, {
        addressChanged,
        current: address,
        previous: previousAddress.current,
      });

      // Update previous address reference
      previousAddress.current = address || null;

      if (address) {
        // Get role from wallet-specific storage
        const savedRole = getWalletRole(address);
        logState(`Retrieved role from storage`, { savedRole });

        // Check if user has a profile
        const profileExists = hasProfile(address);
        logState(`Checked profile existence`, { profileExists });

        // Update state
        setRole(savedRole);
        setUserHasProfile(profileExists);

        // If address changed and we have complete user data, redirect to appropriate dashboard
        if (addressChanged && savedRole && profileExists) {
          logState(
            `Address changed with complete user data, will redirect to dashboard`
          );
          // We'll handle the actual redirect in the connection effect in WalletConnect
        }
      } else {
        // Reset state when wallet disconnects
        logState(`No wallet address, resetting state`);
        setRole(null);
        setUserHasProfile(false);
      }

      setIsInitialized(true);
    };

    initializeState();

    // Debug: dump all wallet data
    if (process.env.NODE_ENV === "development") {
      const allData = debugDumpWalletData();
      console.log("[UserRoleProvider] All wallet data:", allData);
    }
  }, [address]);

  // Handle role changes
  const handleSetRole = (newRole: UserRole) => {
    logState(`Setting role`, { newRole });

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
    // Don't redirect if not initialized, not connected, or already redirecting
    if (!isInitialized || !isConnected || !address || isRedirecting) {
      logState(`Skipping redirect check`, {
        reason: !isInitialized
          ? "not initialized"
          : !isConnected
          ? "not connected"
          : !address
          ? "no address"
          : "already redirecting",
      });
      return;
    }

    // Get current path
    const currentPath = pathname || window.location.pathname;
    logState(`Checking redirect`, { currentPath });

    // Prevent redirection loops by checking if we've recently redirected to this path
    const now = Date.now();
    if (
      lastRedirectPath.current === currentPath &&
      now - lastRedirectTime.current < 2000 // 2 second cooldown
    ) {
      logState(`Preventing redirect loop`, {
        lastRedirectPath: lastRedirectPath.current,
        timeSinceLastRedirect: now - lastRedirectTime.current,
      });
      return;
    }

    // Skip redirection for these paths
    const excludedPaths = ["/select-role", "/profile-setup"];
    if (excludedPaths.includes(currentPath)) {
      logState(`Path excluded from redirect`, { currentPath });
      return;
    }

    // Check wallet state
    const savedRole = getWalletRole(address);
    const profileExists = hasProfile(address);

    logState(`Checking wallet state for redirect`, {
      savedRole,
      profileExists,
    });

    // Determine target path
    let targetPath: string | null = null;

    if (!savedRole) {
      // No role selected, redirect to role selection
      targetPath = "/select-role";
      logState(`No role, redirecting to role selection`);
    } else if (!profileExists) {
      // Role selected but no profile, redirect to profile setup
      targetPath = "/profile-setup";
      logState(`No profile, redirecting to profile setup`);
    } else if (currentPath === "/") {
      // On home page with role and profile, redirect to appropriate dashboard
      if (savedRole === "buyer") {
        targetPath = "/buyer-home";
        logState(`Buyer with profile, redirecting to buyer home`);
      } else if (savedRole === "seller") {
        targetPath = "/seller-home";
        logState(`Seller with profile, redirecting to marketplace`);
      }
    }

    // Only redirect if we have a target and it's different from current path
    if (targetPath && targetPath !== currentPath) {
      try {
        setIsRedirecting(true);
        logState(`Redirecting`, { from: currentPath, to: targetPath });

        // Update last redirect info
        lastRedirectPath.current = targetPath;
        lastRedirectTime.current = now;

        // Perform the redirect
        router.push(targetPath);

        // Add a small delay to prevent immediate re-renders
        await new Promise((resolve) => setTimeout(resolve, 100));
      } finally {
        // Reset redirecting state after a delay
        setTimeout(() => {
          setIsRedirecting(false);
          logState(`Reset redirecting state`);
        }, 500);
      }
    } else {
      logState(`No redirect needed`, { targetPath, currentPath });
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
        isRedirecting,
      }}
    >
      {children}
    </UserRoleContext.Provider>
  );
}

export function useUserRole() {
  return useContext(UserRoleContext);
}
