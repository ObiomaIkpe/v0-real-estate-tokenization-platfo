"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { KYCForm } from "@/components/compliance/kyc-form"
import type { InvestorProfile } from "@/lib/compliance/kyc-service"
import { Shield, Globe, CheckCircle, AlertTriangle, Clock, FileText } from "lucide-react"

export default function CompliancePage() {
  const [kycStatus, setKycStatus] = useState<"not_started" | "in_progress" | "completed" | "rejected">("not_started")
  const [loading, setLoading] = useState(false)

  const handleKYCSubmit = async (profileData: Partial<InvestorProfile>) => {
    setLoading(true)
    try {
      // Simulate KYC submission
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setKycStatus("in_progress")

      // Simulate processing time
      setTimeout(() => {
        setKycStatus("completed")
      }, 5000)
    } catch (error) {
      console.error("KYC submission failed:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "in_progress":
        return <Clock className="h-5 w-5 text-yellow-600" />
      case "rejected":
        return <AlertTriangle className="h-5 w-5 text-red-600" />
      default:
        return <FileText className="h-5 w-5 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "in_progress":
        return "bg-yellow-100 text-yellow-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-[#2d3748] text-white p-6">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <Image src="/favicon.ico" alt="REALiFi Logo" width={32} height={32} className="rounded" />
          <div>
            <h1 className="text-2xl font-bold">Global Compliance Center</h1>
            <p className="text-gray-300">Secure, compliant cross-border real estate investment</p>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {/* Compliance Overview */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-[#2d3748]">
              <CardContent className="p-6 text-center">
                <Shield className="h-12 w-12 text-[#d69e2e] mx-auto mb-4" />
                <h3 className="font-bold text-[#2d3748] mb-2">Bank-Grade Security</h3>
                <p className="text-sm text-gray-600">
                  Advanced encryption and secure document storage with SOC 2 compliance
                </p>
              </CardContent>
            </Card>

            <Card className="border-[#2d3748]">
              <CardContent className="p-6 text-center">
                <Globe className="h-12 w-12 text-[#d69e2e] mx-auto mb-4" />
                <h3 className="font-bold text-[#2d3748] mb-2">Global Compliance</h3>
                <p className="text-sm text-gray-600">
                  Compliant with regulations in 34+ countries including GDPR, KYC, and AML
                </p>
              </CardContent>
            </Card>

            <Card className="border-[#2d3748]">
              <CardContent className="p-6 text-center">
                <CheckCircle className="h-12 w-12 text-[#d69e2e] mx-auto mb-4" />
                <h3 className="font-bold text-[#2d3748] mb-2">Automated Verification</h3>
                <p className="text-sm text-gray-600">
                  AI-powered document verification with human oversight for accuracy
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* KYC Status */}
        <Card className="border-[#2d3748] mb-8">
          <CardHeader>
            <CardTitle className="text-[#2d3748] flex items-center gap-2">
              {getStatusIcon(kycStatus)}
              KYC Verification Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <Badge className={getStatusColor(kycStatus)}>{kycStatus.replace("_", " ").toUpperCase()}</Badge>
                <p className="text-sm text-gray-600 mt-2">
                  {kycStatus === "not_started" && "Complete KYC verification to unlock full investment capabilities"}
                  {kycStatus === "in_progress" &&
                    "Your documents are being reviewed. This typically takes 24-48 hours."}
                  {kycStatus === "completed" &&
                    "Your account is fully verified. You can now invest up to your enhanced limits."}
                  {kycStatus === "rejected" && "Verification failed. Please contact support for assistance."}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Investment Limit</p>
                <p className="text-lg font-bold text-[#2d3748]">
                  ${kycStatus === "completed" ? "50,000" : "1,000"}/day
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* KYC Form or Status */}
        {kycStatus === "not_started" ? (
          <KYCForm onSubmit={handleKYCSubmit} loading={loading} />
        ) : kycStatus === "in_progress" ? (
          <Card className="border-[#2d3748]">
            <CardContent className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d69e2e] mx-auto mb-4"></div>
              <h3 className="text-lg font-bold text-[#2d3748] mb-2">Verification in Progress</h3>
              <p className="text-gray-600 mb-4">
                Our compliance team is reviewing your documents. You'll receive an email notification once the review is
                complete.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">
                  <strong>What happens next:</strong>
                  <br />
                  1. Document verification (24-48 hours)
                  <br />
                  2. Identity confirmation
                  <br />
                  3. AML screening
                  <br />
                  4. Account approval and limit increase
                </p>
              </div>
            </CardContent>
          </Card>
        ) : kycStatus === "completed" ? (
          <Card className="border-[#2d3748]">
            <CardContent className="p-8 text-center">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-[#2d3748] mb-2">Verification Complete!</h3>
              <p className="text-gray-600 mb-6">
                Your account has been successfully verified. You now have access to enhanced investment limits and all
                platform features.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Daily Limit</p>
                  <p className="text-xl font-bold text-green-600">$50,000</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Monthly Limit</p>
                  <p className="text-xl font-bold text-green-600">$250,000</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Annual Limit</p>
                  <p className="text-xl font-bold text-green-600">$2,500,000</p>
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                <button className="bg-[#d69e2e] hover:bg-[#b7791f] text-white px-6 py-2 rounded-lg">
                  Start Investing
                </button>
                <button className="border border-[#2d3748] text-[#2d3748] hover:bg-gray-50 px-6 py-2 rounded-lg">
                  View Portfolio
                </button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-red-500">
            <CardContent className="p-8 text-center">
              <AlertTriangle className="h-16 w-16 text-red-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-red-600 mb-2">Verification Failed</h3>
              <p className="text-gray-600 mb-6">
                We were unable to verify your documents. Please contact our support team for assistance.
              </p>
              <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg">Contact Support</button>
            </CardContent>
          </Card>
        )}

        {/* Regulatory Information */}
        <Card className="border-[#2d3748] mt-8">
          <CardHeader>
            <CardTitle className="text-[#2d3748]">Regulatory Compliance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-[#2d3748] mb-2">Supported Jurisdictions</h4>
                <div className="space-y-2">
                  {[
                    "United States (SEC compliant)",
                    "European Union (MiFID II)",
                    "United Kingdom (FCA regulated)",
                    "Canada (CSA compliant)",
                    "Australia (ASIC regulated)",
                    "Singapore (MAS compliant)",
                  ].map((jurisdiction) => (
                    <div key={jurisdiction} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-gray-700">{jurisdiction}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-[#2d3748] mb-2">Security Standards</h4>
                <div className="space-y-2">
                  {[
                    "SOC 2 Type II Certified",
                    "ISO 27001 Compliant",
                    "GDPR Compliant",
                    "AES-256 Encryption",
                    "Multi-factor Authentication",
                    "24/7 Security Monitoring",
                  ].map((standard) => (
                    <div key={standard} className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-[#d69e2e]" />
                      <span className="text-sm text-gray-700">{standard}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
