interface PropertySubmissionData {
  // Basic Information
  propertyTitle: string;
  propertyType: string;
  location: string;
  address: string;
  description: string;

  // Financial Information
  purchasePrice: string;
  requestedValue: string;
  minInvestment: string;
  expectedYield: string;
  monthlyRevenue: string;
  operatingExpenses: string;

  // Property Details
  propertySize: string;
  yearBuilt: string;
  units: string;
  features: string[];

  // Owner Information
  ownerName: string;
  companyName: string;
  email: string;
  phone: string;
  yearsExperience: string;

  // Legal & Compliance
  hasCleanTitle: boolean;
  hasInsurance: boolean;
  hasPermits: boolean;
  agreeToTerms: boolean;
}

interface PropertyImage {
  id: string;
  file: File;
  preview: string;
}

interface PropertyDocument {
  id: string;
  file: File;
  name: string;
  type: string;
}

class PropertyService {
  private baseUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

  // Upload files first and get their URLs/IDs
  async uploadFiles(files: File[]): Promise<string[]> {
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`files`, file);
    });

    const response = await fetch(`${this.baseUrl}/upload`, {
      method: "POST",
      headers: {
        // Don't set Content-Type, let browser set it for FormData
        Authorization: `Bearer ${this.getToken()}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    const result = await response.json();
    return result.fileUrls || result.fileIds; // Adjust based on your backend response
  }

  // Submit property data
  async submitProperty(
    propertyData: PropertySubmissionData,
    images: PropertyImage[],
    documents: PropertyDocument[]
  ) {
    try {
      // First upload images
      const imageUrls =
        images.length > 0
          ? await this.uploadFiles(images.map((img) => img.file))
          : [];

      // Then upload documents
      const documentUrls =
        documents.length > 0
          ? await this.uploadFiles(documents.map((doc) => doc.file))
          : [];

      // Prepare the final payload
      const payload = {
        ...propertyData,
        images: imageUrls,
        documents: documentUrls,
        // Convert string numbers to actual numbers where needed
        purchasePrice: Number(propertyData.purchasePrice),
        requestedValue: Number(propertyData.requestedValue),
        minInvestment: Number(propertyData.minInvestment),
        expectedYield: Number(propertyData.expectedYield),
        monthlyRevenue: propertyData.monthlyRevenue
          ? Number(propertyData.monthlyRevenue)
          : undefined,
        operatingExpenses: propertyData.operatingExpenses
          ? Number(propertyData.operatingExpenses)
          : undefined,
        propertySize: propertyData.propertySize
          ? Number(propertyData.propertySize)
          : undefined,
        yearBuilt: propertyData.yearBuilt
          ? Number(propertyData.yearBuilt)
          : undefined,
        units: propertyData.units ? Number(propertyData.units) : undefined,
        yearsExperience: propertyData.yearsExperience
          ? Number(propertyData.yearsExperience)
          : undefined,
      };

      // Submit the property
      const response = await fetch(`${this.baseUrl}/properties`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.getToken()}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Submission failed: ${response.statusText}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Property submission error:", error);
      throw error;
    }
  }

  // Get auth token (FIXED: Added proper browser checks)
  private getToken(): string | null {
    // Only access localStorage in the browser environment
    if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
      try {
        return localStorage.getItem("authToken");
      } catch (error) {
        console.warn("Failed to access localStorage:", error);
        return null;
      }
    }

    // For server-side rendering or when localStorage is not available
    return null;
  }
}

// Only instantiate the service if we're in a browser environment or it's safe to do so
let propertyServiceInstance: PropertyService | null = null;

export const propertyService = (() => {
  if (!propertyServiceInstance) {
    propertyServiceInstance = new PropertyService();
  }
  return propertyServiceInstance;
})();
