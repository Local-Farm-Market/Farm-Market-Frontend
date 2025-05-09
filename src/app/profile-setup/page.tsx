"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import { useUserRole } from "@/src/hooks/use-user-role";
import { useAccount } from "wagmi";
import { toast } from "@/src/components/ui/use-toast";
import { saveWalletProfile, getWalletRole } from "@/src/lib/wallet-storage";

export default function ProfileSetupPage() {
  const router = useRouter();
  const { role } = useUserRole();
  const { address, isConnected } = useAccount();

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Check if wallet is connected
    if (!isConnected || !address) {
      router.push("/");
      return;
    }

    // Check if role is selected
    const savedRole = getWalletRole(address);
    if (!savedRole) {
      router.push("/select-role");
      return;
    }

    setIsLoading(false);
  }, [router, isConnected, address]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!address) return;

    setIsSaving(true);

    try {
      // Create profile object
      const profile = {
        name,
        bio,
        location,
        createdAt: Date.now(),
      };

      // Save profile to wallet-specific storage
      saveWalletProfile(address, profile);

      // Show success message
      toast({
        title: "Profile Created",
        description: "Your profile has been set up successfully!",
        duration: 3000,
      });

      // Redirect based on role
      const savedRole = getWalletRole(address);
      if (savedRole === "buyer") {
        router.push("/buyer-home");
      } else {
        router.push("/seller-home");
      }
    } catch (error) {
      console.error("Failed to save profile:", error);
      toast({
        title: "Profile Setup Failed",
        description:
          "There was an error setting up your profile. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="container max-w-md mx-auto py-12">
      <Card>
        <CardHeader>
          <CardTitle>Complete Your Profile</CardTitle>
          <CardDescription>
            {role === "buyer"
              ? "Tell us a bit about yourself as a buyer"
              : "Set up your farm profile to start selling"}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                {role === "buyer" ? "Your Name" : "Farm/Business Name"}*
              </Label>
              <Input
                id="name"
                placeholder={role === "buyer" ? "John Doe" : "Green Acres Farm"}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">
                {role === "buyer" ? "About You" : "Farm Description"}
              </Label>
              <Textarea
                id="bio"
                placeholder={
                  role === "buyer"
                    ? "Tell us about your interests in farm products..."
                    : "Describe your farm, growing practices, specialties..."
                }
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="City, State"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isSaving}>
              {isSaving ? "Saving..." : "Complete Setup"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
