"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Button } from "@/src/components/ui/button"
import { Store, User, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { useUserRole } from "@/src/hooks/use-user-role"
import { useAccount, useDisconnect } from "wagmi"
import { toast } from "@/src/components/ui/use-toast"
import { getWalletRole, hasProfile } from "@/src/lib/wallet-storage"

export default function SelectRolePage() {
  const router = useRouter()
  const { role, setRole } = useUserRole()
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const [isSelecting, setIsSelecting] = useState(false)
  const redirectAttempted = useRef(false)

  // Debug function to log state
  const logState = (message: string, data?: any) => {
    if (process.env.NODE_ENV === "development") {
      console.log(`[SelectRole] ${message}`, {
        address,
        isConnected,
        role,
        isSelecting,
        redirectAttempted: redirectAttempted.current,
        ...data,
      })
    }
  }

  // Check if wallet is connected and if user already has a role
  useEffect(() => {
    if (!isConnected || !address) {
      logState(`No wallet connected, redirecting to home`)
      router.push("/")
      return
    }

    // Check if user already has a role and profile
    if (!redirectAttempted.current) {
      redirectAttempted.current = true

      const savedRole = getWalletRole(address)
      const userHasProfile = hasProfile(address)

      logState(`Checking existing role and profile`, { savedRole, userHasProfile })

      // If user already has a role and profile, redirect to appropriate dashboard
      if (savedRole && userHasProfile) {
        logState(`User already has role and profile, redirecting to dashboard`)

        // Update context
        setRole(savedRole)

        // Redirect based on role
        if (savedRole === "buyer") {
          router.push("/buyer-home")
        } else if (savedRole === "seller") {
          router.push("/seller-home")
        }
        return
      }

      // If user has a role but no profile, redirect to profile setup
      if (savedRole && !userHasProfile) {
        logState(`User has role but no profile, redirecting to profile setup`)

        // Update context
        setRole(savedRole)

        router.push("/profile-setup")
        return
      }
    }
  }, [router, isConnected, address, setRole])

  const handleRoleSelect = async (selectedRole: "buyer" | "seller") => {
    if (!address || isSelecting) return

    setIsSelecting(true)
    logState(`Selecting role`, { selectedRole })

    try {
      // Update context
      setRole(selectedRole)

      // Show success toast
      toast({
        title: "Role Selected",
        description: `You've selected the ${selectedRole} role.`,
        duration: 3000,
      })

      // Add a small delay before redirecting
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Redirect to profile setup
      router.push("/profile-setup")
    } catch (error) {
      console.error("Error selecting role:", error)
      toast({
        title: "Error",
        description: "There was an error selecting your role. Please try again.",
        variant: "destructive",
      })
      setIsSelecting(false)
    }
  }

  const handleDisconnect = () => {
    disconnect()
    router.push("/")
  }

  return (
    <div className="container max-w-4xl mx-auto py-12">
      <Button variant="ghost" onClick={handleDisconnect} className="mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Disconnect Wallet
      </Button>

      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Select Your Role</CardTitle>
          <CardDescription>Choose how you want to use the Farm Marketplace</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card
              className={`border-2 hover:border-amber-500 cursor-pointer transition-all ${
                isSelecting ? "opacity-50 pointer-events-none" : ""
              }`}
              onClick={() => handleRoleSelect("buyer")}
            >
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="h-16 w-16 bg-amber-100 dark:bg-amber-900/50 rounded-full flex items-center justify-center mb-4">
                  <User className="h-8 w-8 text-amber-600 dark:text-amber-400" />
                </div>
                <CardTitle className="mb-2">Buyer</CardTitle>
                <CardDescription>
                  Browse and purchase fresh produce directly from local farmers. Support sustainable agriculture and
                  enjoy farm-to-table goodness.
                </CardDescription>
              </CardContent>
            </Card>

            <Card
              className={`border-2 hover:border-green-500 cursor-pointer transition-all ${
                isSelecting ? "opacity-50 pointer-events-none" : ""
              }`}
              onClick={() => handleRoleSelect("seller")}
            >
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="h-16 w-16 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center mb-4">
                  <Store className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle className="mb-2">Seller</CardTitle>
                <CardDescription>
                  List your farm products and reach customers directly without middlemen. Set your own prices and build
                  your brand.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center text-sm text-muted-foreground">
          You can change your role later from your profile settings
        </CardFooter>
      </Card>
    </div>
  )
}
