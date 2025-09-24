"use client";

import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { web3AuthService } from "@/lib/services/web3-auth.service";

// A placeholder for the backend URL.
// In a real application, this would be an environment variable.
const PROTECTED_API_BASE_URL = "http://localhost:3000/app";

/**
 * This page demonstrates how to access a protected backend route
 * using the JWT token obtained during Web3 authentication.
 */
export default function ProfilePage() {
  const { isConnected, address } = useAccount();
  const [profileData, setProfileData] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Check for the authentication token in localStorage
        const token = web3AuthService.getToken();

        // If the user is connected and has a token, make a request
        if (isConnected && address && token) {
          console.log("Fetching protected data...");
          const response = await fetch(`${PROTECTED_API_BASE_URL}/profile`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              // Attach the JWT as a Bearer token in the Authorization header
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            // Handle unauthorized access or other API errors
            const errorData = await response.json();
            throw new Error(
              errorData.message || "Failed to fetch profile data."
            );
          }

          const data = await response.json();
          setProfileData(data.message);
        } else {
          setProfileData(null);
          setError("Please connect your wallet and authenticate.");
        }
      } catch (err: any) {
        console.error("Error fetching profile data:", err);
        setError(err.message || "An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [isConnected, address]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-gray-600 text-lg">Loading profile data...</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">User Profile</h1>
        {profileData ? (
          <div>
            <p className="text-gray-600 mb-2">
              <span className="font-medium">Wallet Address:</span> {address}
            </p>
            <p className="text-green-600 font-semibold text-lg">
              {profileData}
            </p>
            <p className="text-sm text-gray-400 mt-4">
              This data was securely fetched from a protected backend route.
            </p>
          </div>
        ) : (
          <p className="text-red-500">{error}</p>
        )}
      </div>
    </div>
  );
}
