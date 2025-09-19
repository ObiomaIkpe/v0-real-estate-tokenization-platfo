"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import type { InsurancePolicy, InsuranceClaim, RiskAssessment } from "@/lib/insurance/insurance-service"
import { Shield, AlertTriangle, CheckCircle, Clock, DollarSign, FileText, TrendingUp } from "lucide-react"

interface InsuranceDashboardProps {
  policies: InsurancePolicy[]
  claims: InsuranceClaim[]
  riskAssessment: RiskAssessment
  onCreatePolicy: () => void
  onSubmitClaim: () => void
}

export function InsuranceDashboard({
  policies,
  claims,
  riskAssessment,
  onCreatePolicy,
  onSubmitClaim,
}: InsuranceDashboardProps) {
  const activePolicies = policies.filter((p) => p.status === "active")
  const totalCoverage = activePolicies.reduce((sum, policy) => sum + policy.coverage.amount, 0)
  const totalPremiums = activePolicies.reduce((sum, policy) => sum + policy.premium.annual, 0)
  const pendingClaims = claims.filter((c) => c.status === "submitted" || c.status === "under_review")

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low":
        return "text-green-600 bg-green-100"
      case "medium":
        return "text-yellow-600 bg-yellow-100"
      case "high":
        return "text-red-600 bg-red-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "expired":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      default:
        return <Shield className="h-4 w-4 text-gray-600" />
    }
  }

  const getClaimStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800"
      case "denied":
        return "bg-red-100 text-red-800"
      case "paid":
        return "bg-blue-100 text-blue-800"
      case "under_review":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-[#2d3748]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Coverage</p>
                <p className="text-2xl font-bold text-[#2d3748]">${totalCoverage.toLocaleString()}</p>
              </div>
              <Shield className="h-8 w-8 text-[#d69e2e]" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#2d3748]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Policies</p>
                <p className="text-2xl font-bold text-[#2d3748]">{activePolicies.length}</p>
              </div>
              <FileText className="h-8 w-8 text-[#d69e2e]" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#2d3748]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Annual Premiums</p>
                <p className="text-2xl font-bold text-[#2d3748]">${totalPremiums.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-[#d69e2e]" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#2d3748]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Risk Level</p>
                <Badge className={getRiskColor(riskAssessment.overallRisk)}>
                  {riskAssessment.overallRisk.toUpperCase()}
                </Badge>
              </div>
              <TrendingUp className="h-8 w-8 text-[#d69e2e]" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button onClick={onCreatePolicy} className="bg-[#d69e2e] hover:bg-[#b7791f] text-white">
          <Shield className="h-4 w-4 mr-2" />
          Add Insurance Policy
        </Button>
        <Button
          onClick={onSubmitClaim}
          variant="outline"
          className="border-[#2d3748] text-[#2d3748] hover:bg-gray-50 bg-transparent"
        >
          <FileText className="h-4 w-4 mr-2" />
          Submit Claim
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Assessment */}
        <Card className="border-[#2d3748]">
          <CardHeader>
            <CardTitle className="text-[#2d3748] flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-[#d69e2e]" />
              Risk Assessment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Overall Risk</span>
              <Badge className={getRiskColor(riskAssessment.overallRisk)}>
                {riskAssessment.overallRisk.toUpperCase()}
              </Badge>
            </div>

            <div className="space-y-3">
              {Object.entries(riskAssessment.factors).map(([factor, data]) => (
                <div key={factor}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="capitalize">{factor.replace("_", " ")}</span>
                    <span>{data.score}/100</span>
                  </div>
                  <Progress value={data.score} className="h-2" />
                  {data.risks.length > 0 && (
                    <div className="mt-1">
                      {data.risks.map((risk, index) => (
                        <p key={index} className="text-xs text-red-600">
                          • {risk}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium text-[#2d3748] mb-2">Recommendations</h4>
              <ul className="space-y-1">
                {riskAssessment.recommendations.map((rec, index) => (
                  <li key={index} className="text-xs text-gray-600">
                    • {rec}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Recent Claims */}
        <Card className="border-[#2d3748]">
          <CardHeader>
            <CardTitle className="text-[#2d3748] flex items-center gap-2">
              <FileText className="h-5 w-5 text-[#d69e2e]" />
              Recent Claims
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {claims.length > 0 ? (
                claims.slice(0, 5).map((claim) => (
                  <div
                    key={claim.id}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-[#2d3748] text-sm">{claim.claimNumber}</span>
                        <Badge className={`text-xs ${getClaimStatusColor(claim.status)}`}>
                          {claim.status.replace("_", " ")}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600 mb-1">{claim.type.replace("_", " ").toUpperCase()}</p>
                      <p className="text-xs text-gray-500 truncate">{claim.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-[#2d3748] text-sm">${claim.amount.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">{claim.submittedDate.toLocaleDateString()}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-600">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p>No claims submitted yet</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Policies */}
      <Card className="border-[#2d3748]">
        <CardHeader>
          <CardTitle className="text-[#2d3748] flex items-center gap-2">
            <Shield className="h-5 w-5 text-[#d69e2e]" />
            Active Insurance Policies
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activePolicies.length > 0 ? (
              activePolicies.map((policy) => (
                <div key={policy.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(policy.status)}
                      <div>
                        <h4 className="font-medium text-[#2d3748]">
                          {policy.type.replace("_", " ").toUpperCase()} Insurance
                        </h4>
                        <p className="text-sm text-gray-600">
                          Policy #{policy.policyNumber} • {policy.provider}
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">{policy.status.toUpperCase()}</Badge>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Coverage</p>
                      <p className="font-medium text-[#2d3748]">${policy.coverage.amount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Deductible</p>
                      <p className="font-medium text-[#2d3748]">${policy.coverage.deductible.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Annual Premium</p>
                      <p className="font-medium text-[#2d3748]">${policy.premium.annual.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Expires</p>
                      <p className="font-medium text-[#2d3748]">{policy.endDate.toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-xs text-gray-600">Beneficiaries: {policy.beneficiaries.length} token holders</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-600">
                <Shield className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p>No active insurance policies</p>
                <Button onClick={onCreatePolicy} className="mt-4 bg-[#d69e2e] hover:bg-[#b7791f] text-white">
                  Create First Policy
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
