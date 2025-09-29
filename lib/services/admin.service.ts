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
  requestedValue: string; // Important: Use number for monetary value
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
  // NOTE: Changed to 'number' from 'string' to maintain data integrity
  // consistent with AdminPropertyDetails (for accurate display/sorting).
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
    const url = new URL(`${API_BASE_URL}/admin/properties`);
    if (status) {
      url.searchParams.append("status", status);
    }

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch properties");
    }

    // Assuming the API returns a list of objects that conform to AdminPropertySummary
    // (A subset of AdminPropertyDetails)
    return response.json();
  }

  /** Fetches full details for a single property. */
  async getPropertyDetails(propertyId: string): Promise<AdminPropertyDetails> {
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

    return response.json();
  }

  /** Approves a property submission. */
  async approveProperty(propertyId: string): Promise<void> {
    const response = await fetch(
      `${API_BASE_URL}/admin/properties/${propertyId}/approve`,
      {
        method: "POST", // Using POST for state change action
        headers: this.getHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to approve property");
    }
  }

  /** Rejects a property submission. */
  async rejectProperty(propertyId: string): Promise<void> {
    const response = await fetch(
      `${API_BASE_URL}/admin/properties/${propertyId}/reject`,
      {
        method: "POST", // Using POST for state change action
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
   * This is crucial for verifying the on-chain status on your backend.
   */
  async tokenizeProperty(
    propertyId: string,
    blockchainData: TokenizePropertyData
  ): Promise<{ success: boolean; data: any }> {
    const response = await fetch(
      `${API_BASE_URL}/admin/properties/${propertyId}/tokenize`,
      {
        method: "POST", // Using POST for state change action
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
