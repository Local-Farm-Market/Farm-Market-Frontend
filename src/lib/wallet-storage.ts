/**
 * Utility functions for wallet-specific storage
 * This allows us to store data specific to each wallet address
 */

// Type for user profile data
export interface UserProfile {
  name: string
  bio?: string
  location?: string
  avatar?: string
  createdAt: number
}

// Type for wallet data
export interface WalletData {
  role: "buyer" | "seller" | null
  profile: UserProfile | null
  lastConnected: number
}

// Storage key
const WALLET_DATA_KEY = "farm_marketplace_wallet_data"

// Get wallet data from localStorage
export function getWalletData(address: string): WalletData | null {
  if (!address) return null

  try {
    const storedData = localStorage.getItem(WALLET_DATA_KEY)
    if (!storedData) return null

    const parsedData = JSON.parse(storedData) as Record<string, WalletData>
    return parsedData[address.toLowerCase()] || null
  } catch (error) {
    console.error("Failed to get wallet data:", error)
    return null
  }
}

// Save wallet data to localStorage
export function saveWalletData(address: string, data: Partial<WalletData>): void {
  if (!address) return

  try {
    // Get existing data
    const storedData = localStorage.getItem(WALLET_DATA_KEY)
    const parsedData = storedData ? JSON.parse(storedData) : {}

    // Get existing wallet data or create new
    const existingData = parsedData[address.toLowerCase()] || {
      role: null,
      profile: null,
      lastConnected: Date.now(),
    }

    // Update with new data
    const updatedData = {
      ...existingData,
      ...data,
      lastConnected: Date.now(), // Always update last connected time
    }

    // Save back to storage
    parsedData[address.toLowerCase()] = updatedData
    localStorage.setItem(WALLET_DATA_KEY, JSON.stringify(parsedData))
  } catch (error) {
    console.error("Failed to save wallet data:", error)
  }
}

// Clear wallet data
export function clearWalletData(address: string): void {
  if (!address) return

  try {
    const storedData = localStorage.getItem(WALLET_DATA_KEY)
    if (!storedData) return

    const parsedData = JSON.parse(storedData)
    delete parsedData[address.toLowerCase()]
    localStorage.setItem(WALLET_DATA_KEY, JSON.stringify(parsedData))
  } catch (error) {
    console.error("Failed to clear wallet data:", error)
  }
}

// Helper to check if a wallet has a profile
export function hasProfile(address: string): boolean {
  const data = getWalletData(address)
  return !!data?.profile
}

// Helper to get a wallet's role
export function getWalletRole(address: string): "buyer" | "seller" | null {
  const data = getWalletData(address)
  return data?.role || null
}

// Helper to save a wallet's role
export function saveWalletRole(address: string, role: "buyer" | "seller" | null): void {
  saveWalletData(address, { role })
}

// Helper to save a wallet's profile
export function saveWalletProfile(address: string, profile: UserProfile): void {
  saveWalletData(address, { profile })
}
