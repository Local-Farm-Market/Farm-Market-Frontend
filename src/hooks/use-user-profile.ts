"use client";

import { useState, useEffect } from "react";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { getFarmEscrowContract } from "@/src/lib/contract-config";
import type { UserProfile } from "@/src/lib/types";
import { toast } from "@/src/components/ui/use-toast";

export function useUserProfile() {
  const { address } = useAccount();
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const contract = getFarmEscrowContract();

  // Read user profile
  const {
    data: profileData,
    isError,
    isLoading: isLoadingProfile,
  } = useReadContract({
    ...contract,
    functionName: "userProfiles",
    args: [address!],
    query: {
      enabled: !!address,
    },
  });

  // Write functions
  const { writeContractAsync, isPending } = useWriteContract();

  // Create user profile
  const createProfile = async (
    name: string,
    contactInfo: string,
    location: string,
    bio: string,
    isSeller: boolean,
    farmName: string,
    farmDescription: string
  ) => {
    try {
      setIsLoading(true);
      await writeContractAsync({
        ...contract,
        functionName: "createUserProfile",
        args: [
          name,
          contactInfo,
          location,
          bio,
          isSeller,
          farmName,
          farmDescription,
        ],
      });
      toast({
        title: "Profile created",
        description: "Your profile has been created successfully.",
      });
    } catch (error) {
      console.error("Error creating profile:", error);
      toast({
        title: "Error",
        description: "Failed to create profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Update user profile
  const updateProfile = async (
    name: string,
    contactInfo: string,
    location: string,
    bio: string,
    farmName: string,
    farmDescription: string
  ) => {
    try {
      setIsLoading(true);
      await writeContractAsync({
        ...contract,
        functionName: "updateUserProfile",
        args: [name, contactInfo, location, bio, farmName, farmDescription],
      });
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Process profile data
  useEffect(() => {
    if (profileData && !isError) {
      const formattedProfile: UserProfile = {
        name: profileData[0],
        contactInfo: profileData[1],
        location: profileData[2],
        bio: profileData[3],
        isVerified: profileData[4],
        rating: profileData[5],
        reviewCount: profileData[6],
        isSeller: profileData[7],
        farmName: profileData[8],
        farmDescription: profileData[9],
      };
      setProfile(formattedProfile);
    }
    setIsLoading(isLoadingProfile);
  }, [profileData, isError, isLoadingProfile]);

  return {
    profile,
    isLoading: isLoading || isPending,
    createProfile,
    updateProfile,
    hasProfile: !!profile && profile.name !== "",
  };
}
