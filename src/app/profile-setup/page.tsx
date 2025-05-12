"use client";

import type React from "react";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import { useRouter } from "next/navigation";
import { useUserRole } from "@/src/hooks/use-user-role";
import { useAccount } from "wagmi";
import { saveWalletProfile, getWalletRole } from "@/src/lib/wallet-storage";
import { toast } from "@/src/components/ui/use-toast";

export default function ProfileSetupPage() {
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { role, setRole } = useUserRole();
  const { address, isConnected } = useAccount();

  // Debug function to log state
  const logState = (message: string, data?: any) => {
    if (process.env.NODE_ENV === "development") {
      console.log(`[ProfileSetup] ${message}`, {
        address,
        isConnected,
        role,
        ...data,
      });
    }
  };

  useEffect(() => {
    // Check if wallet is connected
    if (!isConnected || !address) {
      logState(`No wallet connected, redirecting to home`);
      router.push("/");
      return;
    }

    // Check if role is selected
    const savedRole = getWalletRole(address);
    if (!savedRole) {
      logState(`No role selected, redirecting to role selection`);
      router.push("/select-role");
      return;
    }

    // If role is not in context, set it
    if (!role && savedRole) {
      logState(`Setting role from storage`, { savedRole });
      setRole(savedRole);
    }
  }, [router, isConnected, address, role, setRole]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!address) {
      toast({
        title: "Error",
        description: "Wallet not connected. Please connect your wallet.",
        variant: "destructive",
      });
      return;
    }

    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Please enter your name.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    logState(`Submitting profile`, { name, bio, location });

    try {
      // Save profile to wallet-specific storage
      saveWalletProfile(address, {
        name: name.trim(),
        bio: bio.trim(),
        location: location.trim(),
        createdAt: Date.now(),
      });

      toast({
        title: "Profile Created",
        description: "Your profile has been set up successfully.",
      });

      // Add a small delay before redirecting
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Redirect based on role
      const userRole = getWalletRole(address);
      logState(`Profile saved, redirecting based on role`, { userRole });

      if (userRole === "buyer") {
        router.push("/buyer-home");
      } else if (userRole === "seller") {
        router.push("/marketplace");
      } else {
        // Fallback to home if role is somehow not set
        router.push("/");
      }
    } catch (error) {
      console.error("Error setting up profile:", error);
      toast({
        title: "Error",
        description:
          "There was an error setting up your profile. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container max-w-md mx-auto py-12">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Complete Your Profile</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                placeholder="Tell us about yourself"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="Your location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <span className="mr-2">Setting up...</span>
                  <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                </>
              ) : (
                "Complete Setup"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
