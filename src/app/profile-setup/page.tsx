"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import { Switch } from "@/src/components/ui/switch";
import { Avatar, AvatarFallback } from "@/src/components/ui/avatar";
import { Camera, Leaf, Store, MapPin, User, ArrowLeft } from "lucide-react";
import { useUserRole } from "@/src/hooks/use-user-role";
import { useAccount } from "wagmi";
import {
  saveWalletProfile,
  getWalletRole,
  hasProfile,
} from "@/src/lib/wallet-storage";
import { toast } from "@/src/components/ui/use-toast";

export default function ProfileSetupPage() {
  const router = useRouter();
  const { role, setRole } = useUserRole();
  const { address, isConnected } = useAccount();
  const redirectAttempted = useRef(false);

  // Common form fields
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    location: "",
    bio: "",
    // Seller-specific fields
    farmName: "",
    farmDescription: "",
    farmSize: "",
    organicCertified: false,
    // Buyer-specific fields
    preferredCategories: [] as string[],
    notificationPreferences: {
      orderUpdates: true,
      paymentNotifications: true,
      newListings: false,
    },
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Debug function to log state
  const logState = (message: string, data?: any) => {
    if (process.env.NODE_ENV === "development") {
      console.log(`[ProfileSetup] ${message}`, {
        address,
        isConnected,
        role,
        redirectAttempted: redirectAttempted.current,
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

    // Check if user already has a profile
    if (!redirectAttempted.current) {
      redirectAttempted.current = true;

      const savedRole = getWalletRole(address);
      const userHasProfile = hasProfile(address);

      logState(`Checking existing role and profile`, {
        savedRole,
        userHasProfile,
      });

      // If user already has a profile, redirect to appropriate dashboard
      if (savedRole && userHasProfile) {
        logState(`User already has profile, redirecting to dashboard`);

        // Update context if needed
        if (!role && savedRole) {
          setRole(savedRole);
        }

        // Redirect based on role
        if (savedRole === "buyer") {
          router.push("/buyer-home");
        } else if (savedRole === "seller") {
          router.push("/seller-home");
        }
        return;
      }

      // Check if role is selected
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
    }

    setIsLoading(false);
  }, [router, isConnected, address, role, setRole]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSwitchChange = (name: string) => {
    if (name === "organicCertified") {
      setFormData({
        ...formData,
        organicCertified: !formData.organicCertified,
      });
    } else {
      // Handle other switches if needed
    }
  };

  const handleCategoryToggle = (category: string) => {
    const updatedCategories = [...formData.preferredCategories];
    if (updatedCategories.includes(category)) {
      const index = updatedCategories.indexOf(category);
      updatedCategories.splice(index, 1);
    } else {
      updatedCategories.push(category);
    }
    setFormData({ ...formData, preferredCategories: updatedCategories });
  };

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

    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Please enter your name.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    logState(`Submitting profile`, { formData });

    try {
      // Filter out empty values
      const filteredData = Object.fromEntries(
        Object.entries(formData).filter(([_, value]) => {
          if (value === null || value === undefined) return false;
          if (typeof value === "string" && value.trim() === "") return false;
          if (Array.isArray(value) && value.length === 0) return false;
          return true;
        })
      );

      // Save profile to wallet-specific storage
      saveWalletProfile(address, {
        name: formData.name.trim(),
        bio: formData.bio.trim(),
        location: formData.location.trim(),
        ...filteredData,
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
        router.push("/seller-home");
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
      setIsSaving(false);
    }
  };

  const goBack = () => {
    router.push("/select-role");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  // If no role is set, show an error
  if (!role) {
    return (
      <div className="container max-w-2xl mx-auto py-12">
        <Card className="border-red-200 dark:border-red-900/50">
          <CardHeader>
            <CardTitle className="text-2xl text-red-600">Setup Error</CardTitle>
            <CardDescription>
              No role has been selected. Please go back and select a role.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => router.push("/select-role")}>
              Select Role
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl mx-auto py-12">
      <Button variant="ghost" onClick={goBack} className="mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Role Selection
      </Button>

      <Card className="border-amber-100 dark:border-amber-900/50">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2 text-amber-800 dark:text-amber-300">
            {role === "seller" ? (
              <Store className="h-6 w-6 text-amber-600" />
            ) : (
              <User className="h-6 w-6 text-amber-600" />
            )}
            {role === "seller" ? "Seller Profile Setup" : "Buyer Profile Setup"}
          </CardTitle>
          <CardDescription>
            {role === "seller"
              ? "Complete your seller profile to start listing your farm products"
              : "Complete your buyer profile to start shopping for fresh produce"}
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {/* Profile Picture */}
            <div className="flex flex-col items-center">
              <div className="relative mb-4">
                <Avatar className="w-24 h-24">
                  <AvatarFallback className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                    {formData.name
                      ? formData.name.charAt(0).toUpperCase()
                      : "U"}
                  </AvatarFallback>
                </Avatar>
                <Button
                  type="button"
                  variant="secondary"
                  size="icon"
                  className="absolute bottom-0 right-0 rounded-full h-8 w-8 bg-amber-100 hover:bg-amber-200 text-amber-700 dark:bg-amber-800 dark:hover:bg-amber-700 dark:text-amber-200"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              {address && (
                <p className="text-xs text-muted-foreground font-mono">
                  Connected: {address.substring(0, 8)}...
                  {address.substring(address.length - 8)}
                </p>
              )}
            </div>

            {/* Common Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Full Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  className="border-amber-200 dark:border-amber-800"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">
                  Email Address <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email address"
                  className="border-amber-200 dark:border-amber-800"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="flex items-center gap-1">
                <MapPin className="h-4 w-4 text-amber-600" />
                Location <span className="text-red-500">*</span>
              </Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="City, State"
                className="border-amber-200 dark:border-amber-800"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                placeholder="Tell us a bit about yourself"
                className="border-amber-200 dark:border-amber-800"
                rows={3}
              />
            </div>

            {/* Seller-specific Fields */}
            {role === "seller" && (
              <div className="space-y-4 pt-2 border-t border-amber-100 dark:border-amber-900/50">
                <h3 className="font-medium flex items-center gap-2 text-amber-800 dark:text-amber-300">
                  <Leaf className="h-5 w-5 text-amber-600" />
                  Farm Details
                </h3>

                <div className="space-y-2">
                  <Label htmlFor="farmName">
                    Farm Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="farmName"
                    name="farmName"
                    value={formData.farmName}
                    onChange={handleInputChange}
                    placeholder="Enter your farm name"
                    className="border-amber-200 dark:border-amber-800"
                    required={role === "seller"}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="farmDescription">Farm Description</Label>
                  <Textarea
                    id="farmDescription"
                    name="farmDescription"
                    value={formData.farmDescription}
                    onChange={handleInputChange}
                    placeholder="Describe your farm and what you produce"
                    className="border-amber-200 dark:border-amber-800"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="farmSize">Farm Size</Label>
                    <Input
                      id="farmSize"
                      name="farmSize"
                      value={formData.farmSize}
                      onChange={handleInputChange}
                      placeholder="e.g., 5 acres"
                      className="border-amber-200 dark:border-amber-800"
                    />
                  </div>
                  <div className="flex items-center space-x-2 pt-8">
                    <Switch
                      id="organicCertified"
                      checked={formData.organicCertified}
                      onCheckedChange={() =>
                        handleSwitchChange("organicCertified")
                      }
                    />
                    <Label
                      htmlFor="organicCertified"
                      className="flex items-center gap-1"
                    >
                      <Leaf className="h-4 w-4 text-green-600" />
                      Certified Organic
                    </Label>
                  </div>
                </div>
              </div>
            )}

            {/* Buyer-specific Fields */}
            {role === "buyer" && (
              <div className="space-y-4 pt-2 border-t border-amber-100 dark:border-amber-900/50">
                <h3 className="font-medium flex items-center gap-2 text-amber-800 dark:text-amber-300">
                  <Leaf className="h-5 w-5 text-amber-600" />
                  Shopping Preferences
                </h3>

                <div className="space-y-2">
                  <Label>Preferred Categories</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 pt-2">
                    {[
                      "Vegetables",
                      "Fruits",
                      "Dairy",
                      "Meat",
                      "Poultry",
                      "Grains",
                      "Organic",
                    ].map((category) => (
                      <div
                        key={category}
                        className="flex items-center space-x-2"
                      >
                        <Switch
                          id={`category-${category}`}
                          checked={formData.preferredCategories.includes(
                            category
                          )}
                          onCheckedChange={() => handleCategoryToggle(category)}
                        />
                        <Label htmlFor={`category-${category}`}>
                          {category}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Notification Preferences</Label>
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="orderUpdates"
                        checked={formData.notificationPreferences.orderUpdates}
                        onCheckedChange={() => {
                          setFormData({
                            ...formData,
                            notificationPreferences: {
                              ...formData.notificationPreferences,
                              orderUpdates:
                                !formData.notificationPreferences.orderUpdates,
                            },
                          });
                        }}
                      />
                      <Label htmlFor="orderUpdates">Order Updates</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="paymentNotifications"
                        checked={
                          formData.notificationPreferences.paymentNotifications
                        }
                        onCheckedChange={() => {
                          setFormData({
                            ...formData,
                            notificationPreferences: {
                              ...formData.notificationPreferences,
                              paymentNotifications:
                                !formData.notificationPreferences
                                  .paymentNotifications,
                            },
                          });
                        }}
                      />
                      <Label htmlFor="paymentNotifications">
                        Payment Notifications
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="newListings"
                        checked={formData.notificationPreferences.newListings}
                        onCheckedChange={() => {
                          setFormData({
                            ...formData,
                            notificationPreferences: {
                              ...formData.notificationPreferences,
                              newListings:
                                !formData.notificationPreferences.newListings,
                            },
                          });
                        }}
                      />
                      <Label htmlFor="newListings">New Product Listings</Label>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex justify-between border-t border-amber-100 dark:border-amber-900/50 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={goBack}
              className="border-amber-200 text-amber-700 hover:bg-amber-50 dark:border-amber-800 dark:text-amber-400 dark:hover:bg-amber-950/30"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSaving}
              className="bg-amber-600 hover:bg-amber-700 text-white"
            >
              {isSaving ? (
                <>
                  <span className="mr-2">Saving...</span>
                  <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                </>
              ) : (
                "Complete Profile"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
