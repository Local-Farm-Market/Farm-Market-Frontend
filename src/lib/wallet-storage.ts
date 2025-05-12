/**
 * Utility functions for wallet-specific storage
 * This allows us to store data specific to each wallet address
 */

// Type for user profile data
export interface UserProfile {
  name: string;
  bio?: string;
  location?: string;
  avatar?: string;
  createdAt: number;
}

// Type for wallet data
export interface WalletData {
  role: "buyer" | "seller" | null;
  profile: UserProfile | null;
  lastConnected: number;
}

// Storage key
const WALLET_DATA_KEY = "farm_marketplace_wallet_data";

// Debug function to log wallet data operations
const debugLog = (operation: string, data?: any) => {
  if (process.env.NODE_ENV === "development") {
    console.log(`[WalletStorage] ${operation}`, data);
  }
};

// Get wallet data from localStorage
export function getWalletData(address: string): WalletData | null {
  if (!address) return null;

  try {
    const storedData = localStorage.getItem(WALLET_DATA_KEY);
    if (!storedData) return null;

    const parsedData = JSON.parse(storedData) as Record<string, WalletData>;
    const normalizedAddress = address.toLowerCase();
    const result = parsedData[normalizedAddress] || null;

    debugLog(`Retrieved data for ${normalizedAddress}`, result);
    return result;
  } catch (error) {
    console.error("Failed to get wallet data:", error);
    return null;
  }
}

// Save wallet data to localStorage
export function saveWalletData(
  address: string,
  data: Partial<WalletData>
): void {
  if (!address) return;

  try {
    const normalizedAddress = address.toLowerCase();

    // Get existing data
    const storedData = localStorage.getItem(WALLET_DATA_KEY);
    const parsedData = storedData ? JSON.parse(storedData) : {};

    // Get existing wallet data or create new
    const existingData = parsedData[normalizedAddress] || {
      role: null,
      profile: null,
      lastConnected: Date.now(),
    };

    // Update with new data
    const updatedData = {
      ...existingData,
      ...data,
      lastConnected: Date.now(), // Always update last connected time
    };

    // Save back to storage
    parsedData[normalizedAddress] = updatedData;
    localStorage.setItem(WALLET_DATA_KEY, JSON.stringify(parsedData));

    debugLog(`Saved data for ${normalizedAddress}`, updatedData);
  } catch (error) {
    console.error("Failed to save wallet data:", error);
  }
}

// Clear wallet data
export function clearWalletData(address: string): void {
  if (!address) return;

  try {
    const normalizedAddress = address.toLowerCase();
    const storedData = localStorage.getItem(WALLET_DATA_KEY);
    if (!storedData) return;

    const parsedData = JSON.parse(storedData);
    delete parsedData[normalizedAddress];
    localStorage.setItem(WALLET_DATA_KEY, JSON.stringify(parsedData));

    debugLog(`Cleared data for ${normalizedAddress}`);
  } catch (error) {
    console.error("Failed to clear wallet data:", error);
  }
}

// Helper to check if a wallet has a profile
export function hasProfile(address: string): boolean {
  if (!address) return false;

  const data = getWalletData(address);
  const result = !!data?.profile;

  debugLog(`Checked profile for ${address.toLowerCase()}`, {
    hasProfile: result,
  });
  return result;
}

// Helper to get a wallet's role
export function getWalletRole(address: string): "buyer" | "seller" | null {
  if (!address) return null;

  const data = getWalletData(address);
  const result = data?.role || null;

  debugLog(`Retrieved role for ${address.toLowerCase()}`, { role: result });
  return result;
}

// Helper to save a wallet's role
export function saveWalletRole(
  address: string,
  role: "buyer" | "seller" | null
): void {
  if (!address) return;

  debugLog(`Saving role for ${address.toLowerCase()}`, { role });
  saveWalletData(address, { role });
}

// Helper to save a wallet's profile
export function saveWalletProfile(address: string, profile: UserProfile): void {
  if (!address) return;

  debugLog(`Saving profile for ${address.toLowerCase()}`, { profile });
  saveWalletData(address, { profile });
}

// Debug function to dump all wallet data
export function debugDumpWalletData(): Record<string, WalletData> | null {
  try {
    const storedData = localStorage.getItem(WALLET_DATA_KEY);
    if (!storedData) return null;

    return JSON.parse(storedData);
  } catch (error) {
    console.error("Failed to dump wallet data:", error);
    return null;
  }
}
