// services/propertyService.ts

// Updated interface to match backend expectations
interface PropertyFormData {
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

  // Legal & Compliance - Changed to single boolean
  legalCompliance: boolean; // Remove the 4 individual checkboxes
}

// Create a separate interface for your frontend form state
interface FrontendFormData {
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

  // Legal & Compliance - Keep individual checkboxes for frontend
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

interface PropertySubmissionResponse {
  status: string;
  data: {
    success: boolean;
    propertyId: string;
    ipfsMetadataHash: string;
    ipfsImageHashes: string[];
    ipfsDocumentHashes: string[];
    message: string;
  };
  timestamp: string;
}

export class PropertyService {
  private readonly baseURL: string;

  constructor() {
    // Configure your backend URL
    this.baseURL =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/properties";
  }

  /**
   * Submit property data with images and documents to the backend
   */
  async submitProperty(
    propertyData: PropertyFormData, // Accepts already-transformed data
    images: PropertyImage[],
    documents: PropertyDocument[]
  ): Promise<PropertySubmissionResponse> {
    try {
      // Create FormData for multipart/form-data submission
      const submitData = new FormData();

      // Add all form fields to FormData (no transformation needed)
      Object.entries(propertyData).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          // Handle arrays (features)
          value.forEach((item, index) => {
            submitData.append(`${key}[${index}]`, item.toString());
          });
        } else {
          submitData.append(key, value.toString());
        }
      });

      // Add image files
      images.forEach((image) => {
        submitData.append("images", image.file);
      });

      // Add document files
      documents.forEach((document) => {
        submitData.append("documents", document.file);
      });

      // Make the API request
      const response = await fetch(`http://localhost:3000/properties`, {
        method: "POST",
        body: submitData,
        // Don't set Content-Type header - let browser set it with boundary for multipart
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.message || `HTTP error! status: ${response.status}`
        );
      }

      const result: PropertySubmissionResponse = await response.json();
      return result;
    } catch (error) {
      console.error("Property submission error:", error);
      throw error;
    }
  }

  /**
   * Transform frontend form data to match backend expectations
   */

  /**
   * Validate form data before submission
   */
  // validateFormData(
  //   formData: PropertyFormData,
  //   images: PropertyImage[],
  //   documents: PropertyDocument[]
  // ): { isValid: boolean; errors: string[] } {
  //   const errors: string[] = [];

  //   // Basic Information validation
  //   if (!formData.propertyTitle?.trim())
  //     errors.push("Property title is required");
  //   if (!formData.propertyType?.trim())
  //     errors.push("Property type is required");
  //   if (!formData.location?.trim()) errors.push("Location is required");
  //   if (!formData.address?.trim()) errors.push("Address is required");
  //   if (!formData.description?.trim()) errors.push("Description is required");

  //   // Financial validation
  //   if (!formData.purchasePrice || parseFloat(formData.purchasePrice) <= 0) {
  //     errors.push("Valid purchase price is required");
  //   }
  //   if (!formData.requestedValue || parseFloat(formData.requestedValue) <= 0) {
  //     errors.push("Valid requested value is required");
  //   }
  //   if (!formData.minInvestment || parseFloat(formData.minInvestment) <= 0) {
  //     errors.push("Valid minimum investment is required");
  //   }
  //   if (!formData.expectedYield || parseFloat(formData.expectedYield) <= 0) {
  //     errors.push("Valid expected yield is required");
  //   }

  //   // Property details validation
  //   if (!formData.propertySize || parseFloat(formData.propertySize) <= 0) {
  //     errors.push("Valid property size is required");
  //   }
  //   if (!formData.yearBuilt || parseInt(formData.yearBuilt) < 1800) {
  //     errors.push("Valid year built is required");
  //   }
  //   if (!formData.units || parseInt(formData.units) <= 0) {
  //     errors.push("Valid number of units is required");
  //   }

  //   // Owner information validation
  //   if (!formData.ownerName?.trim()) errors.push("Owner name is required");
  //   if (!formData.companyName?.trim()) errors.push("Company name is required");
  //   if (!formData.email?.trim() || !this.isValidEmail(formData.email)) {
  //     errors.push("Valid email is required");
  //   }
  //   if (!formData.phone?.trim()) errors.push("Phone number is required");
  //   if (!formData.yearsExperience || parseInt(formData.yearsExperience) < 0) {
  //     errors.push("Valid years of experience is required");
  //   }

  //   // Legal compliance validation
  //   if (
  //     !formData.hasCleanTitle ||
  //     !formData.hasInsurance ||
  //     !formData.hasPermits ||
  //     !formData.agreeToTerms
  //   ) {
  //     errors.push("All legal compliance requirements must be met");
  //   }

  //   // File validation
  //   if (images.length === 0) {
  //     errors.push("At least one property image is required");
  //   }
  //   if (documents.length < 3) {
  //     errors.push("At least 3 documents are required");
  //   }

  //   return {
  //     isValid: errors.length === 0,
  //     errors,
  //   };
  // }

  validateFormData(
    formData: PropertyFormData, // Updated to use PropertyFormData interface
    images: PropertyImage[],
    documents: PropertyDocument[]
  ): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Basic Information validation
    if (!formData.propertyTitle?.trim())
      errors.push("Property title is required");
    if (!formData.propertyType?.trim())
      errors.push("Property type is required");
    if (!formData.location?.trim()) errors.push("Location is required");
    if (!formData.address?.trim()) errors.push("Address is required");
    if (!formData.description?.trim()) errors.push("Description is required");

    // Financial validation
    if (!formData.purchasePrice || parseFloat(formData.purchasePrice) <= 0) {
      errors.push("Valid purchase price is required");
    }
    if (!formData.requestedValue || parseFloat(formData.requestedValue) <= 0) {
      errors.push("Valid requested value is required");
    }
    if (!formData.minInvestment || parseFloat(formData.minInvestment) <= 0) {
      errors.push("Valid minimum investment is required");
    }
    if (!formData.expectedYield || parseFloat(formData.expectedYield) <= 0) {
      errors.push("Valid expected yield is required");
    }

    // Property details validation
    if (!formData.propertySize || parseFloat(formData.propertySize) <= 0) {
      errors.push("Valid property size is required");
    }
    if (!formData.yearBuilt || parseInt(formData.yearBuilt) < 1800) {
      errors.push("Valid year built is required");
    }
    if (!formData.units || parseInt(formData.units) <= 0) {
      errors.push("Valid number of units is required");
    }

    // Owner information validation
    if (!formData.ownerName?.trim()) errors.push("Owner name is required");
    if (!formData.companyName?.trim()) errors.push("Company name is required");
    if (!formData.email?.trim() || !this.isValidEmail(formData.email)) {
      errors.push("Valid email is required");
    }
    if (!formData.phone?.trim()) errors.push("Phone number is required");
    if (!formData.yearsExperience || parseInt(formData.yearsExperience) < 0) {
      errors.push("Valid years of experience is required");
    }

    // Legal compliance validation - Updated to use single boolean
    if (!formData.legalCompliance) {
      errors.push("All legal compliance requirements must be met");
    }

    // File validation
    if (images.length === 0) {
      errors.push("At least one property image is required");
    }
    if (documents.length < 3) {
      errors.push("At least 3 documents are required");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

// Create and export a singleton instance
export const propertyService = new PropertyService();

// Updated handleSubmit function for your component
export const createHandleSubmit = (
  formData: PropertyFormData,
  images: PropertyImage[],
  documents: PropertyDocument[],
  setIsSubmitting: (loading: boolean) => void,
  setSubmitError: (error: string | null) => void,
  setSubmitSuccess: (success: boolean) => void,
  router: any
) => {
  return async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // 1. Validate data before submission
      const validation = propertyService.validateFormData(
        formData,
        images,
        documents
      );

      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.join(", ")}`);
      }

      // 2. Submit to backend
      const result = await propertyService.submitProperty(
        formData,
        images,
        documents
      );

      console.log("Property submitted successfully:", result);

      // 3. Handle success
      setSubmitSuccess(true);

      // 4. Redirect after delay
      setTimeout(() => {
        router.push("/properties/success");
      }, 2000);
    } catch (error) {
      console.error("Submission error:", error);
      setSubmitError(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
    } finally {
      setIsSubmitting(false);
    }
  };
};

// Usage in your component:
/*
import { propertyService, createHandleSubmit } from '../services/propertyService';

// In your component:
const handleSubmit = createHandleSubmit(
  formData, 
  images, 
  documents,
  setIsSubmitting,
  setSubmitError,
  setSubmitSuccess,
  router
);
*/
