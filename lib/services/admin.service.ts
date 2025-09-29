const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

/**
 * Defines the structure for full property details, ensuring financial fields
 * like requestedValue are treated as numbers for accurate calculations (best practice).
 * This type is used when fetching a single property for review.
 */
export interface AdminPropertyDetails {
  id: string;
  propertyTitle: string;
  description: string;
  location: string;
  address: string;
  propertyType: string;
  propertySize: number;
  yearBuilt: number;
  units: number;
  purchasePrice: number;
  requestedValue: string; // Changed to number
  minInvestment: number;
  expectedYield: number;
  monthlyRevenue: number;
  operatingExpenses: number;
  ownerName: string;
  companyName: string;
  yearsExperience: number;
  email: string;
  phone: string;
  status: "pending" | "approved" | "tokenized" | "rejected";
  features?: string[];
  totalImages: number;
  totalDocuments: number;
  pinataUrls: {
    images?: string[];
    documents?: string[];
    metadata?: string;
  };
  ipfsMetadataHash?: string;
  createdAt: string;
  updatedAt: string;
  // Blockchain fields
  tokenId?: string;
  contractAddress?: string;
  transactionHash?: string;
}

/**
 * Defines the simplified structure required for the dashboard list view (AdminHomePage).
 * This matches the shape needed by the component's state.
 */
export interface AdminPropertySummary {
  id: string;
  propertyTitle: string;
  location: string;
  requestedValue: number;
  status: "pending" | "approved" | "rejected" | "tokenized";
  thumbnailUrl?: string;
  createdAt: string;
  ownerName: string;
}

/**
 * Data structure sent to the backend after a successful tokenization transaction
 * to update the server's record. This is a critical security step.
 */
export interface TokenizePropertyData {
  tokenId: string;
  transactionHash: string; // Ensure this is recorded
  contractAddress: string;
}

class AdminService {
  /** Retrieves the authentication token from client-side storage. */
  private getAuthToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("authToken");
  }

  /** Constructs headers for authenticated API calls. */
  private getHeaders(): HeadersInit {
    const token = this.getAuthToken();
    return {
      "Content-Type": "application/json",
      // Important for security: Ensure token handling is robust
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  /**
   * Fetches the list of all properties, optionally filtered by status.
   * Returns a list of summaries for efficient dashboard display.
   */
  async getAllProperties(
    status?: "pending" | "approved" | "tokenized" | "rejected"
  ): Promise<AdminPropertySummary[]> {
    // FIX: Removed '/api' from the path (as corrected previously)
    const url = new URL(`${API_BASE_URL}/admin/properties`);
    if (status) {
      url.searchParams.append("status", status);
    }

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      // Throw an error if the status code is not 2xx
      throw new Error("Failed to fetch properties");
    }

    // --- FIX FOR TypeError: e.filter IS NOT A FUNCTION ---
    const result = await response.json();

    // Your NestJS controller wraps the data in a 'data' property.
    // The frontend component expects the raw array. We must unwrap it here.
    if (result && Array.isArray(result.data)) {
      return result.data;
    }

    // Defensive check: If the API returns a success status but the data property
    // is missing or not an array, return an empty array to prevent component crash.
    console.error(
      "API response structure unexpected, returning empty array:",
      result
    );
    return [];
  }

  /** Fetches full details for a single property. */
  async getPropertyDetails(propertyId: string): Promise<AdminPropertyDetails> {
    // FIX: Removed '/api' from the path
    const response = await fetch(
      `${API_BASE_URL}/admin/properties/${propertyId}`,
      {
        method: "GET",
        headers: this.getHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch property details");
    }

    // Assuming the NestJS detail endpoint returns the raw property object or
    // an object with a 'data' key containing the property details.
    const result = await response.json();
    return result.data || result;
  }

  /** Approves a property submission. */
  async approveProperty(propertyId: string): Promise<void> {
    // FIX: Removed '/api' from the path
    const response = await fetch(
      `${API_BASE_URL}/admin/properties/${propertyId}/approve`,
      {
        // Using PATCH for state change action
        method: "PATCH",
        headers: this.getHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to approve property");
    }
  }

  /** Rejects a property submission. */
  async rejectProperty(propertyId: string): Promise<void> {
    // FIX: Removed '/api' from the path
    const response = await fetch(
      `${API_BASE_URL}/admin/properties/${propertyId}/reject`,
      {
        method: "PATCH", // Changed to PATCH
        headers: this.getHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to reject property");
    }
  }

  /**
   * Updates the property status to 'tokenized' and records the final
   * blockchain data (Token ID, Contract Address, Transaction Hash).
   */
  async tokenizeProperty(
    propertyId: string,
    blockchainData: TokenizePropertyData
  ): Promise<{ success: boolean; data: any }> {
    // FIX: Removed '/api' from the path
    const response = await fetch(
      `${API_BASE_URL}/admin/properties/${propertyId}/tokenize`,
      {
        method: "PATCH", // Changed to PATCH as it's an update
        headers: this.getHeaders(),
        body: JSON.stringify(blockchainData),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      // Throw error message from the backend if available
      throw new Error(error.message || "Failed to tokenize property");
    }

    return response.json();
  }
}

export const adminService = new AdminService();
