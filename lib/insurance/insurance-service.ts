import { hederaConsensusService } from "../hedera/hcs"

export interface InsurancePolicy {
  id: string
  propertyId: string
  policyNumber: string
  provider: string
  type: "property" | "liability" | "title" | "rental_income" | "cyber"
  coverage: {
    amount: number
    deductible: number
    currency: "USD" | "EUR" | "GBP"
  }
  premium: {
    annual: number
    monthly: number
    currency: "USD" | "EUR" | "GBP"
  }
  status: "active" | "pending" | "expired" | "cancelled"
  startDate: Date
  endDate: Date
  beneficiaries: string[] // Token holder account IDs
  claims: InsuranceClaim[]
  documents: string[]
}

export interface InsuranceClaim {
  id: string
  policyId: string
  claimNumber: string
  type: "property_damage" | "liability" | "title_dispute" | "rental_loss" | "cyber_incident"
  description: string
  amount: number
  status: "submitted" | "under_review" | "approved" | "denied" | "paid"
  submittedDate: Date
  resolvedDate?: Date
  documents: string[]
  adjusterNotes?: string
}

export interface RiskAssessment {
  propertyId: string
  overallRisk: "low" | "medium" | "high"
  factors: {
    location: {
      score: number
      risks: string[]
    }
    construction: {
      score: number
      risks: string[]
    }
    environmental: {
      score: number
      risks: string[]
    }
    financial: {
      score: number
      risks: string[]
    }
  }
  recommendations: string[]
  lastAssessment: Date
}

export class InsuranceService {
  // Create insurance policy for property
  async createInsurancePolicy(
    propertyId: string,
    policyType: InsurancePolicy["type"],
    coverageAmount: number,
    provider: string,
    beneficiaries: string[],
    topicId: string,
  ): Promise<InsurancePolicy> {
    try {
      const policy: InsurancePolicy = {
        id: `policy_${propertyId}_${Date.now()}`,
        propertyId,
        policyNumber: `POL-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        provider,
        type: policyType,
        coverage: {
          amount: coverageAmount,
          deductible: coverageAmount * 0.01, // 1% deductible
          currency: "USD",
        },
        premium: {
          annual: this.calculatePremium(policyType, coverageAmount),
          monthly: this.calculatePremium(policyType, coverageAmount) / 12,
          currency: "USD",
        },
        status: "pending",
        startDate: new Date(),
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
        beneficiaries,
        claims: [],
        documents: [],
      }

      // Log policy creation to HCS
      await hederaConsensusService.submitAuditLog(topicId, {
        propertyId,
        action: "INSURANCE_POLICY_CREATED",
        details: {
          policyId: policy.id,
          policyNumber: policy.policyNumber,
          type: policyType,
          coverageAmount,
          provider,
          beneficiaryCount: beneficiaries.length,
        },
        timestamp: Date.now(),
      })

      return policy
    } catch (error) {
      console.error("Error creating insurance policy:", error)
      throw new Error("Failed to create insurance policy")
    }
  }

  // Submit insurance claim
  async submitClaim(
    policyId: string,
    claimType: InsuranceClaim["type"],
    description: string,
    amount: number,
    documents: string[],
    topicId: string,
  ): Promise<InsuranceClaim> {
    try {
      const claim: InsuranceClaim = {
        id: `claim_${policyId}_${Date.now()}`,
        policyId,
        claimNumber: `CLM-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        type: claimType,
        description,
        amount,
        status: "submitted",
        submittedDate: new Date(),
        documents,
      }

      // Log claim submission to HCS
      await hederaConsensusService.submitAuditLog(topicId, {
        propertyId: "insurance",
        action: "INSURANCE_CLAIM_SUBMITTED",
        details: {
          claimId: claim.id,
          claimNumber: claim.claimNumber,
          policyId,
          type: claimType,
          amount,
          submittedDate: claim.submittedDate.toISOString(),
        },
        timestamp: Date.now(),
      })

      return claim
    } catch (error) {
      console.error("Error submitting claim:", error)
      throw new Error("Failed to submit insurance claim")
    }
  }

  // Assess property risk
  async assessPropertyRisk(propertyId: string, propertyData: any): Promise<RiskAssessment> {
    try {
      // Mock risk assessment logic
      const locationRisk = this.assessLocationRisk(propertyData.location)
      const constructionRisk = this.assessConstructionRisk(propertyData.construction)
      const environmentalRisk = this.assessEnvironmentalRisk(propertyData.location)
      const financialRisk = this.assessFinancialRisk(propertyData.financial)

      const overallScore =
        (locationRisk.score + constructionRisk.score + environmentalRisk.score + financialRisk.score) / 4

      const assessment: RiskAssessment = {
        propertyId,
        overallRisk: overallScore < 30 ? "low" : overallScore < 70 ? "medium" : "high",
        factors: {
          location: locationRisk,
          construction: constructionRisk,
          environmental: environmentalRisk,
          financial: financialRisk,
        },
        recommendations: this.generateRecommendations(overallScore, {
          location: locationRisk,
          construction: constructionRisk,
          environmental: environmentalRisk,
          financial: financialRisk,
        }),
        lastAssessment: new Date(),
      }

      return assessment
    } catch (error) {
      console.error("Error assessing property risk:", error)
      throw new Error("Failed to assess property risk")
    }
  }

  // Calculate insurance premium
  private calculatePremium(policyType: InsurancePolicy["type"], coverageAmount: number): number {
    const baseRates = {
      property: 0.005, // 0.5% of coverage
      liability: 0.002, // 0.2% of coverage
      title: 0.001, // 0.1% of coverage
      rental_income: 0.003, // 0.3% of coverage
      cyber: 0.004, // 0.4% of coverage
    }

    return coverageAmount * baseRates[policyType]
  }

  // Risk assessment helpers
  private assessLocationRisk(location: any) {
    // Mock location risk assessment
    const riskFactors = []
    let score = 20 // Base score

    if (location.floodZone) {
      score += 30
      riskFactors.push("Located in flood zone")
    }
    if (location.earthquakeZone) {
      score += 25
      riskFactors.push("Located in earthquake zone")
    }
    if (location.crimeRate > 5) {
      score += 20
      riskFactors.push("High crime rate area")
    }

    return { score: Math.min(score, 100), risks: riskFactors }
  }

  private assessConstructionRisk(construction: any) {
    const riskFactors = []
    let score = 15

    if (construction.age > 50) {
      score += 25
      riskFactors.push("Building over 50 years old")
    }
    if (construction.material === "wood") {
      score += 20
      riskFactors.push("Wood frame construction")
    }
    if (!construction.recentRenovation) {
      score += 15
      riskFactors.push("No recent renovations")
    }

    return { score: Math.min(score, 100), risks: riskFactors }
  }

  private assessEnvironmentalRisk(location: any) {
    const riskFactors = []
    let score = 10

    if (location.coastalArea) {
      score += 20
      riskFactors.push("Coastal property - hurricane risk")
    }
    if (location.wildFireZone) {
      score += 30
      riskFactors.push("Wildfire risk area")
    }

    return { score: Math.min(score, 100), risks: riskFactors }
  }

  private assessFinancialRisk(financial: any) {
    const riskFactors = []
    let score = 5

    if (financial.occupancyRate < 80) {
      score += 25
      riskFactors.push("Low occupancy rate")
    }
    if (financial.debtToValue > 0.8) {
      score += 20
      riskFactors.push("High debt-to-value ratio")
    }

    return { score: Math.min(score, 100), risks: riskFactors }
  }

  private generateRecommendations(overallScore: number, factors: any): string[] {
    const recommendations = []

    if (overallScore > 70) {
      recommendations.push("Consider comprehensive insurance coverage")
      recommendations.push("Implement additional security measures")
    }

    if (factors.location.score > 50) {
      recommendations.push("Install flood/earthquake monitoring systems")
    }

    if (factors.construction.score > 50) {
      recommendations.push("Schedule professional building inspection")
      recommendations.push("Consider structural improvements")
    }

    if (factors.environmental.score > 50) {
      recommendations.push("Install environmental monitoring systems")
    }

    if (factors.financial.score > 50) {
      recommendations.push("Improve property management to increase occupancy")
    }

    return recommendations
  }

  // Get insurance quotes from multiple providers
  async getInsuranceQuotes(
    propertyId: string,
    coverageAmount: number,
    policyType: InsurancePolicy["type"],
  ): Promise<any[]> {
    // Mock insurance quotes
    const providers = [
      { name: "Global Property Insurance", rating: "A+" },
      { name: "International Real Estate Cover", rating: "A" },
      { name: "Worldwide Property Protection", rating: "A-" },
    ]

    return providers.map((provider) => ({
      provider: provider.name,
      rating: provider.rating,
      premium: this.calculatePremium(policyType, coverageAmount) * (0.9 + Math.random() * 0.2),
      coverage: coverageAmount,
      deductible: coverageAmount * 0.01,
      features: ["24/7 Claims Support", "Global Coverage", "Digital Claims Processing", "Risk Management Services"],
    }))
  }
}

export const insuranceService = new InsuranceService()
