export interface AdminPropertySummary {
  id: string;
  propertyTitle: string;
  location: string;
  requestedValue: string;
  status: "pending" | "approved" | "rejected" | "tokenized";
  thumbnailUrl?: string;
  createdAt: string;
  ownerName: string;
}

export interface AdminPropertyDetails {
  id: string;
  propertyTitle: string;
  propertyType: string;
  location: string;
  address: string;
  description: string;
  propertySize: string;
  yearBuilt: number;
  units: number;
  features: string[];
  purchasePrice: string;
  requestedValue: string;
  minInvestment: string;
  expectedYield: string;
  monthlyRevenue: string;
  operatingExpenses: string;
  ownerName: string;
  companyName: string;
  email: string;
  phone: string;
  yearsExperience: number;
  legalCompliance: boolean;
  ipfsMetadataHash: string;
  ipfsImageHashes: string[];
  ipfsDocumentHashes: string[];
  pinataUrls: {
    metadata?: string;
    images?: string[];
    documents?: string[];
  };
  status: "pending" | "approved" | "rejected" | "tokenized";
  createdAt: string;
  updatedAt: string;
  totalDocuments: number;
  totalImages: number;
}

class AdminService {
  private readonly baseURL: string;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  }

  async getAllProperties(): Promise<AdminPropertySummary[]> {
    try {
      const response = await fetch(`${this.baseURL}/admin/properties`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error("Error fetching properties:", error);
      throw error;
    }
  }

  async getPropertyDetails(id: string): Promise<AdminPropertyDetails> {
    try {
      const response = await fetch(`${this.baseURL}/admin/properties/${id}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error("Error fetching property details:", error);
      throw error;
    }
  }

  async approveProperty(id: string) {
    try {
      const response = await fetch(
        `${this.baseURL}/admin/properties/${id}/approve`,
        {
          method: "PATCH",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error approving property:", error);
      throw error;
    }
  }

  async tokenizeProperty(id: string) {
    try {
      const response = await fetch(
        `${this.baseURL}/admin/properties/${id}/tokenize`,
        {
          method: "PATCH",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error tokenizing property:", error);
      throw error;
    }
  }

  async rejectProperty(id: string) {
    try {
      const response = await fetch(
        `${this.baseURL}/admin/properties/${id}/reject`,
        {
          method: "PATCH",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error rejecting property:", error);
      throw error;
    }
  }
}

export const adminService = new AdminService();
