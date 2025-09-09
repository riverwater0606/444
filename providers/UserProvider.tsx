import React, { useState, useEffect } from "react";
import createContextHook from "@nkzw/create-context-hook";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface UserProfile {
  name: string;
  email: string;
  avatarUrl?: string;
}

export const [UserProvider, useUser] = createContextHook(() => {
  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    email: "",
  });
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const savedProfile = await AsyncStorage.getItem("userProfile");
      const savedWallet = await AsyncStorage.getItem("walletAddress");
      
      if (savedProfile) {
        setProfile(JSON.parse(savedProfile));
      }
      
      if (savedWallet) {
        setWalletAddress(savedWallet);
      }
    } catch (error) {
      console.error("Error loading profile:", error);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    const newProfile = { ...profile, ...updates };
    setProfile(newProfile);
    await AsyncStorage.setItem("userProfile", JSON.stringify(newProfile));
  };

  const connectWallet = async () => {
    // Simulate wallet connection
    // In production, this would integrate with Web3 providers
    const mockAddress = "0x" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    setWalletAddress(mockAddress);
    await AsyncStorage.setItem("walletAddress", mockAddress);
    return mockAddress;
  };

  const disconnectWallet = async () => {
    setWalletAddress(null);
    await AsyncStorage.removeItem("walletAddress");
  };

  return {
    profile,
    walletAddress,
    updateProfile,
    connectWallet,
    disconnectWallet,
  };
});