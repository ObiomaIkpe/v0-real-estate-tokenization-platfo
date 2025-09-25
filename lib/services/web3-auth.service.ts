import { ethers, BrowserProvider } from "ethers";

const AUTH_API_BASE_URL = "http://localhost:3000/auth";

/**
 * Service for handling Web3-based authentication with a backend.
 * This class orchestrates the entire login process.
 */
class Web3AuthService {
  /**
   * Performs the full Web3 login process.
   * @param provider The ethers.js provider (e.g., window.ethereum).
   * @param walletAddress The user's wallet address.
   * @returns The JWT token issued by the backend.
   */
  async login(provider: any, walletAddress: string): Promise<string> {
    try {
      // Step 1: Request a unique message to sign from the backend
      const messageResponse = await fetch(
        `${AUTH_API_BASE_URL}/message/${walletAddress}`
      );
      if (!messageResponse.ok) {
        throw new Error("Failed to get message from server.");
      }
      const { message } = await messageResponse.json();

      // Step 2: The user signs the message with their wallet
      // Using the new ethers.js v6 syntax
      const browserProvider = new BrowserProvider(provider);
      const signer = await browserProvider.getSigner();
      const signature = await signer.signMessage(message);

      // Step 3: Send the signed message and wallet address to the backend for verification
      const loginResponse = await fetch(`${AUTH_API_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ walletAddress, signature }),
      });

      if (!loginResponse.ok) {
        const errorData = await loginResponse.json();
        throw new Error(errorData.message || "Login failed.");
      }
      const { token } = await loginResponse.json();

      // Step 4: Store the JWT token and the user's wallet address in localStorage
      // NOTE: For a production application, it is more secure to use an HttpOnly cookie
      // to prevent cross-site scripting (XSS) attacks. However, as requested,
      // we are using localStorage here.
      localStorage.setItem("authToken", token);
      localStorage.setItem("walletAddress", walletAddress);

      console.log("Login successful. Token stored.");

      return token;
    } catch (error) {
      console.error("Web3 authentication error:", error);
      throw error;
    }
  }

  /**
   * Retrieves the stored JWT token from localStorage.
   * @returns The JWT token string or null if not found.
   */
  getToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("authToken");
    }
    return null;
  }

  /**
   * Retrieves the user's wallet address from localStorage.
   * @returns The wallet address string or null if not found.
   */
  getWalletAddress(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("walletAddress");
    }
    return null;
  }
}

export const web3AuthService = new Web3AuthService();
