"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { InsuranceDashboard } from "@/components/insurance/insurance-dashboard";
import type {
  InsurancePolicy,
  InsuranceClaim,
  RiskAssessment,
} from "@/lib/insurance/insurance-service";

export default function InsurancePage() {
  const [policies, setPolicies] = useState<InsurancePolicy[]>([]);
  const [claims, setClaims] = useState<InsuranceClaim[]>([]);
  const [riskAssessment, setRiskAssessment] = useState<RiskAssessment | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock insurance data
    const mockPolicies: InsurancePolicy[] = [
      {
        id: "policy_1",
        propertyId: "prop_miami_001",
        policyNumber: "POL-MIA001-2024",
        provider: "Global Property Insurance",
        type: "property",
        coverage: {
          amount: 2500000,
          deductible: 25000,
          currency: "USD",
        },
        premium: {
          annual: 12500,
          monthly: 1042,
          currency: "USD",
        },
        status: "active",
        startDate: new Date(2024, 0, 1),
        endDate: new Date(2024, 11, 31),
        beneficiaries: ["0.0.investor1", "0.0.investor2", "0.0.investor3"],
        claims: [],
        documents: ["policy_document.pdf", "coverage_details.pdf"],
      },
      {
        id: "policy_2",
        propertyId: "prop_miami_001",
        policyNumber: "POL-MIA002-2024",
        provider: "International Liability Cover",
        type: "liability",
        coverage: {
          amount: 1000000,
          deductible: 10000,
          currency: "USD",
        },
        premium: {
          annual: 2000,
          monthly: 167,
          currency: "USD",
        },
        status: "active",
        startDate: new Date(2024, 0, 1),
        endDate: new Date(2024, 11, 31),
        beneficiaries: ["0.0.investor1", "0.0.investor2", "0.0.investor3"],
        claims: [],
        documents: ["liability_policy.pdf"],
      },
    ];

    const mockClaims: InsuranceClaim[] = [
      {
        id: "claim_1",
        policyId: "policy_1",
        claimNumber: "CLM-2024-001",
        type: "property_damage",
        description: "Water damage from burst pipe in unit 3B",
        amount: 15000,
        status: "approved",
        submittedDate: new Date(2024, 2, 15),
        resolvedDate: new Date(2024, 3, 1),
        documents: ["damage_photos.pdf", "repair_estimate.pdf"],
        adjusterNotes:
          "Claim approved. Damage confirmed by adjuster inspection.",
      },
      {
        id: "claim_2",
        policyId: "policy_1",
        claimNumber: "CLM-2024-002",
        type: "property_damage",
        description: "Hurricane damage to roof and windows",
        amount: 45000,
        status: "under_review",
        submittedDate: new Date(2024, 8, 20),
        documents: ["hurricane_damage_report.pdf", "contractor_estimate.pdf"],
      },
    ];

    const mockRiskAssessment: RiskAssessment = {
      propertyId: "prop_miami_001",
      overallRisk: "medium",
      factors: {
        location: {
          score: 45,
          risks: ["Located in hurricane zone", "Coastal property"],
        },
        construction: {
          score: 25,
          risks: ["Building age: 15 years"],
        },
        environmental: {
          score: 60,
          risks: ["Hurricane risk", "Flood zone proximity"],
        },
        financial: {
          score: 20,
          risks: [],
        },
      },
      recommendations: [
        "Install hurricane shutters",
        "Upgrade roof to hurricane-resistant materials",
        "Consider flood insurance",
        "Regular maintenance inspections",
      ],
      lastAssessment: new Date(2024, 0, 1),
    };

    setPolicies(mockPolicies);
    setClaims(mockClaims);
    setRiskAssessment(mockRiskAssessment);
    setLoading(false);
  }, []);

  const handleCreatePolicy = () => {
    // In a real implementation, this would open a policy creation form
    console.log("Create new insurance policy");
  };

  const handleSubmitClaim = () => {
    // In a real implementation, this would open a claim submission form
    console.log("Submit insurance claim");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d69e2e] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading insurance dashboard...</p>
        </div>
      </div>
    );
  }

  if (!riskAssessment) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No risk assessment data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto p-6">
        <InsuranceDashboard
          policies={policies}
          claims={claims}
          riskAssessment={riskAssessment}
          onCreatePolicy={handleCreatePolicy}
          onSubmitClaim={handleSubmitClaim}
        />
      </div>
    </div>
  );
}
