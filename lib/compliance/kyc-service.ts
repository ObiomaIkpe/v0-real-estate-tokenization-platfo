import { hederaConsensusService } from "../hedera/hcs"

export interface KYCDocument {
  id: string
  type: "passport" | "national_id" | "drivers_license" | "utility_bill" | "bank_statement"
  fileName: string
  uploadDate: Date
  status: "pending" | "verified" | "rejected"
  expiryDate?: Date
  country: string
}

export interface InvestorProfile {
  id: string
  accountId: string
  personalInfo: {
    firstName: string
    lastName: string
    dateOfBirth: Date
    nationality: string
    residenceCountry: string
    address: {
      street: string
      city: string
      state: string
      postalCode: string
      country: string
    }
  }
  contactInfo: {
    email: string
    phone: string
  }
  documents: KYCDocument[]
  kycStatus: "not_started" | "in_progress" | "completed" | "rejected"
  amlStatus: "not_checked" | "clear" | "flagged" | "under_review"
  complianceLevel: "basic" | "enhanced" | "institutional"
  investmentLimits: {
    daily: number
    monthly: number
    annual: number
  }
  riskScore: number // 0-100
  lastUpdated: Date
  approvedBy?: string
}

export interface ComplianceRule {
  country: string
  maxInvestmentWithoutKYC: number
  requiredDocuments: string[]
  restrictedCountries: string[]
  minimumAge: number
  additionalRequirements?: string[]
}

export class KYCService {
  private complianceRules: ComplianceRule[] = [
    {
      country: "US",
      maxInvestmentWithoutKYC: 1000,
      requiredDocuments: ["passport", "utility_bill"],
      restrictedCountries: ["OFAC_SANCTIONED"],
      minimumAge: 18,
      additionalRequirements: ["SSN_verification", "accredited_investor_check"],
    },
    {
      country: "EU",
      maxInvestmentWithoutKYC: 1000,
      requiredDocuments: ["national_id", "utility_bill"],
      restrictedCountries: ["OFAC_SANCTIONED", "EU_SANCTIONED"],
      minimumAge: 18,
      additionalRequirements: ["GDPR_consent"],
    },
    {
      country: "UK",
      maxInvestmentWithoutKYC: 500,
      requiredDocuments: ["passport", "utility_bill"],
      restrictedCountries: ["OFAC_SANCTIONED", "UK_SANCTIONED"],
      minimumAge: 18,
      additionalRequirements: ["FCA_compliance"],
    },
    {
      country: "DEFAULT",
      maxInvestmentWithoutKYC: 500,
      requiredDocuments: ["passport", "utility_bill"],
      restrictedCountries: ["OFAC_SANCTIONED"],
      minimumAge: 18,
    },
  ]

  // Initialize investor profile
  async createInvestorProfile(
    accountId: string,
    personalInfo: InvestorProfile["personalInfo"],
    contactInfo: InvestorProfile["contactInfo"],
  ): Promise<InvestorProfile> {
    try {
      const complianceRule = this.getComplianceRule(personalInfo.residenceCountry)

      const profile: InvestorProfile = {
        id: `investor_${accountId}_${Date.now()}`,
        accountId,
        personalInfo,
        contactInfo,
        documents: [],
        kycStatus: "not_started",
        amlStatus: "not_checked",
        complianceLevel: "basic",
        investmentLimits: {
          daily: complianceRule.maxInvestmentWithoutKYC,
          monthly: complianceRule.maxInvestmentWithoutKYC * 5,
          annual: complianceRule.maxInvestmentWithoutKYC * 50,
        },
        riskScore: 0,
        lastUpdated: new Date(),
      }

      return profile
    } catch (error) {
      console.error("Error creating investor profile:", error)
      throw new Error("Failed to create investor profile")
    }
  }

  // Upload KYC document
  async uploadDocument(
    investorId: string,
    documentType: KYCDocument["type"],
    fileName: string,
    country: string,
    topicId: string,
  ): Promise<KYCDocument> {
    try {
      const document: KYCDocument = {
        id: `doc_${investorId}_${Date.now()}`,
        type: documentType,
        fileName,
        uploadDate: new Date(),
        status: "pending",
        country,
      }

      // Log document upload to HCS
      await hederaConsensusService.submitAuditLog(topicId, {
        propertyId: "compliance",
        action: "KYC_DOCUMENT_UPLOADED",
        details: {
          investorId,
          documentType,
          documentId: document.id,
          uploadDate: document.uploadDate.toISOString(),
        },
        timestamp: Date.now(),
      })

      return document
    } catch (error) {
      console.error("Error uploading document:", error)
      throw new Error("Failed to upload document")
    }
  }

  // Verify investor profile
  async verifyInvestor(profile: InvestorProfile, topicId: string, approvedBy: string): Promise<InvestorProfile> {
    try {
      const complianceRule = this.getComplianceRule(profile.personalInfo.residenceCountry)

      // Check if all required documents are provided
      const requiredDocs = complianceRule.requiredDocuments
      const providedDocs = profile.documents.map((doc) => doc.type)
      const missingDocs = requiredDocs.filter((doc) => !providedDocs.includes(doc as any))

      if (missingDocs.length > 0) {
        throw new Error(`Missing required documents: ${missingDocs.join(", ")}`)
      }

      // Check age requirement
      const age = this.calculateAge(profile.personalInfo.dateOfBirth)
      if (age < complianceRule.minimumAge) {
        throw new Error(`Investor must be at least ${complianceRule.minimumAge} years old`)
      }

      // Check sanctions list
      const isSanctioned = await this.checkSanctionsList(profile)
      if (isSanctioned) {
        profile.amlStatus = "flagged"
        profile.kycStatus = "rejected"
      } else {
        profile.kycStatus = "completed"
        profile.amlStatus = "clear"
        profile.complianceLevel = "enhanced"

        // Increase investment limits for verified investors
        profile.investmentLimits = {
          daily: complianceRule.maxInvestmentWithoutKYC * 10,
          monthly: complianceRule.maxInvestmentWithoutKYC * 50,
          annual: complianceRule.maxInvestmentWithoutKYC * 500,
        }
      }

      profile.approvedBy = approvedBy
      profile.lastUpdated = new Date()

      // Log verification to HCS
      await hederaConsensusService.submitAuditLog(topicId, {
        propertyId: "compliance",
        action: "INVESTOR_VERIFIED",
        details: {
          investorId: profile.id,
          kycStatus: profile.kycStatus,
          amlStatus: profile.amlStatus,
          complianceLevel: profile.complianceLevel,
          approvedBy,
          verificationDate: new Date().toISOString(),
        },
        timestamp: Date.now(),
      })

      return profile
    } catch (error) {
      console.error("Error verifying investor:", error)
      throw new Error("Failed to verify investor")
    }
  }

  // Check investment compliance
  async checkInvestmentCompliance(
    profile: InvestorProfile,
    investmentAmount: number,
    propertyCountry: string,
  ): Promise<{ allowed: boolean; reason?: string }> {
    try {
      // Check KYC status
      if (profile.kycStatus !== "completed" && investmentAmount > profile.investmentLimits.daily) {
        return {
          allowed: false,
          reason: "KYC verification required for investments above daily limit",
        }
      }

      // Check investment limits
      if (investmentAmount > profile.investmentLimits.daily) {
        return {
          allowed: false,
          reason: "Investment exceeds daily limit",
        }
      }

      // Check AML status
      if (profile.amlStatus === "flagged") {
        return {
          allowed: false,
          reason: "Account flagged for AML review",
        }
      }

      // Check country restrictions
      const complianceRule = this.getComplianceRule(profile.personalInfo.residenceCountry)
      if (complianceRule.restrictedCountries.includes(propertyCountry)) {
        return {
          allowed: false,
          reason: "Investment in this country is restricted for your jurisdiction",
        }
      }

      return { allowed: true }
    } catch (error) {
      console.error("Error checking investment compliance:", error)
      return {
        allowed: false,
        reason: "Compliance check failed",
      }
    }
  }

  // Get compliance rule for country
  private getComplianceRule(country: string): ComplianceRule {
    return (
      this.complianceRules.find((rule) => rule.country === country) ||
      this.complianceRules.find((rule) => rule.country === "DEFAULT")!
    )
  }

  // Calculate age from date of birth
  private calculateAge(dateOfBirth: Date): number {
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }

    return age
  }

  // Check sanctions list (mock implementation)
  private async checkSanctionsList(profile: InvestorProfile): Promise<boolean> {
    // In a real implementation, this would check against OFAC, EU, UN sanctions lists
    const sanctionedNames = ["John Doe", "Jane Smith"] // Mock sanctioned names
    const fullName = `${profile.personalInfo.firstName} ${profile.personalInfo.lastName}`

    return sanctionedNames.includes(fullName)
  }

  // Generate compliance report
  async generateComplianceReport(investorId: string): Promise<any> {
    return {
      investorId,
      reportDate: new Date(),
      kycStatus: "completed",
      amlStatus: "clear",
      documentsVerified: ["passport", "utility_bill"],
      riskAssessment: "low",
      complianceScore: 95,
      lastReview: new Date(),
      nextReview: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
    }
  }
}

export const kycService = new KYCService()
