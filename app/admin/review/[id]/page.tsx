"use client"

import { useState } from "react"
import { ArrowLeft, MapPin, DollarSign, TrendingUp, FileText, Shield, Check, X, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import { useParams } from "next/navigation"

// Mock detailed asset data for review
const assetReviewData = {
  5: {
    id: 5,
    title: "Luxury Beachfront Resort",
    location: "Malibu, CA",
    owner: "Coastal Properties LLC",
    submittedDate: "2024-12-10",
    requestedValue: 8500000,
    minInvestment: 2000,
    expectedYield: 7.8,
    status: "pending_review",
    images: [
      "/luxury-beachfront-resort-malibu-exterior.jpg",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
    ],
    description:
      "A premium 150-room beachfront resort featuring luxury amenities, private beach access, and multiple dining venues. Located in prime Malibu location with consistent high occupancy rates.",
    features: [
      "150 luxury rooms and suites",
      "Private beach access",
      "3 restaurants and 2 bars",
      "Full-service spa",
      "Conference facilities",
      "Valet parking",
      "Concierge services",
      "Fitness center and pool",
    ],
    financials: {
      purchasePrice: 8500000,
      renovationCost: 500000,
      monthlyRevenue: 750000,
      annualRevenue: 9000000,
      operatingExpenses: 5400000,
      netOperatingIncome: 3600000,
      capRate: 4.2,
      projectedAppreciation: 4.5,
      occupancyRate: 85,
    },
    documents: [
      { name: "Property Deed", type: "PDF", size: "2.4 MB", verified: true, uploaded: "2024-12-10" },
      { name: "Financial Statements (3 years)", type: "PDF", size: "5.1 MB", verified: true, uploaded: "2024-12-10" },
      { name: "Property Inspection Report", type: "PDF", size: "8.7 MB", verified: true, uploaded: "2024-12-10" },
      { name: "Insurance Policy", type: "PDF", size: "1.2 MB", verified: true, uploaded: "2024-12-10" },
      { name: "Environmental Assessment", type: "PDF", size: "3.8 MB", verified: false, uploaded: "2024-12-10" },
      { name: "Zoning Documentation", type: "PDF", size: "0.9 MB", verified: true, uploaded: "2024-12-10" },
      { name: "Property Management Agreement", type: "PDF", size: "1.5 MB", verified: true, uploaded: "2024-12-10" },
      { name: "Market Analysis Report", type: "PDF", size: "4.2 MB", verified: false, uploaded: "2024-12-10" },
    ],
    ownerInfo: {
      companyName: "Coastal Properties LLC",
      contactPerson: "Michael Rodriguez",
      email: "m.rodriguez@coastalprops.com",
      phone: "+1 (555) 123-4567",
      yearsInBusiness: 12,
      previousProperties: 8,
      creditRating: "A+",
      kycStatus: "verified",
    },
    riskAssessment: {
      marketRisk: "Medium",
      liquidityRisk: "Low",
      operationalRisk: "Low",
      regulatoryRisk: "Low",
      overallRisk: "Medium-Low",
    },
  },
}

export default function AssetReviewPage() {
  const params = useParams()
  const assetId = params.id as string
  const asset = assetReviewData[assetId as keyof typeof assetReviewData]

  const [selectedImage, setSelectedImage] = useState(0)
  const [showApproveDialog, setShowApproveDialog] = useState(false)
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [rejectionReason, setRejectionReason] = useState("")
  const [approvalNotes, setApprovalNotes] = useState("")

  if (!asset) {
    return <div>Asset not found</div>
  }

  const handleApprove = () => {
    console.log(`Approving asset ${asset.id} with notes: ${approvalNotes}`)
    setShowApproveDialog(false)
    // Handle approval logic and redirect
  }

  const handleReject = () => {
    console.log(`Rejecting asset ${asset.id} with reason: ${rejectionReason}`)
    setShowRejectDialog(false)
    // Handle rejection logic and redirect
  }

  const handleFractionalize = () => {
    console.log(`Starting fractionalization process for asset ${asset.id}`)
    // Handle fractionalization logic
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/admin" className="flex items-center text-slate-600 hover:text-blue-900">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Admin Dashboard
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Badge className="bg-yellow-100 text-yellow-800">Pending Review</Badge>
              <Button variant="outline" size="sm">
                Export Report
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Asset Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="relative">
                <img
                  src={asset.images[selectedImage] || "/placeholder.svg"}
                  alt={asset.title}
                  className="w-full h-96 object-cover rounded-lg"
                />
                <Badge className="absolute top-4 right-4 bg-blue-600">{asset.expectedYield}% Expected APY</Badge>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {asset.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative rounded-lg overflow-hidden ${
                      selectedImage === index ? "ring-2 ring-blue-900" : ""
                    }`}
                  >
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`${asset.title} ${index + 1}`}
                      className="w-full h-20 object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Asset Information */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-slate-900 mb-2">{asset.title}</h1>
                  <div className="flex items-center text-slate-600 mb-2">
                    <MapPin className="h-5 w-5 mr-2" />
                    {asset.location}
                  </div>
                  <p className="text-slate-600">
                    Submitted by {asset.owner} on {asset.submittedDate}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-slate-900">${(asset.requestedValue / 1000000).toFixed(1)}M</p>
                  <p className="text-slate-600">Requested Value</p>
                </div>
              </div>

              <p className="text-slate-700 text-lg leading-relaxed mb-6">{asset.description}</p>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="text-center p-4 bg-white rounded-lg border">
                  <TrendingUp className="h-6 w-6 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-slate-900">{asset.expectedYield}%</p>
                  <p className="text-sm text-slate-600">Expected APY</p>
                </div>
                <div className="text-center p-4 bg-white rounded-lg border">
                  <DollarSign className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-slate-900">${asset.minInvestment}</p>
                  <p className="text-sm text-slate-600">Min Investment</p>
                </div>
                <div className="text-center p-4 bg-white rounded-lg border">
                  <Shield className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-slate-900">{asset.riskAssessment.overallRisk}</p>
                  <p className="text-sm text-slate-600">Risk Level</p>
                </div>
                <div className="text-center p-4 bg-white rounded-lg border">
                  <FileText className="h-6 w-6 text-amber-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-slate-900">{asset.documents.length}</p>
                  <p className="text-sm text-slate-600">Documents</p>
                </div>
              </div>
            </div>

            {/* Detailed Review Tabs */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="financials">Financials</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
                <TabsTrigger value="owner">Owner Info</TabsTrigger>
                <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Property Features</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      {asset.features.map((feature, index) => (
                        <div key={index} className="flex items-center">
                          <div className="w-2 h-2 bg-blue-900 rounded-full mr-3"></div>
                          <span className="text-slate-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="financials" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Financial Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-slate-900 mb-3">Revenue Metrics</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-slate-600">Annual Revenue</span>
                            <span className="font-medium">${asset.financials.annualRevenue.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Monthly Revenue</span>
                            <span className="font-medium">${asset.financials.monthlyRevenue.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Occupancy Rate</span>
                            <span className="font-medium">{asset.financials.occupancyRate}%</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 mb-3">Investment Metrics</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-slate-600">Cap Rate</span>
                            <span className="font-medium">{asset.financials.capRate}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">NOI</span>
                            <span className="font-medium text-green-600">
                              ${asset.financials.netOperatingIncome.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Projected Appreciation</span>
                            <span className="font-medium">{asset.financials.projectedAppreciation}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="documents" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Document Review</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {asset.documents.map((doc, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center">
                            <div
                              className={`w-3 h-3 rounded-full mr-3 ${doc.verified ? "bg-green-500" : "bg-yellow-500"}`}
                            ></div>
                            <div>
                              <span className="font-medium">{doc.name}</span>
                              <div className="flex items-center space-x-2 text-sm text-slate-600">
                                <Badge variant="outline">{doc.type}</Badge>
                                <span>{doc.size}</span>
                                <span>•</span>
                                <span>{doc.uploaded}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </Button>
                            {!doc.verified && (
                              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                <Check className="h-4 w-4 mr-2" />
                                Verify
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="owner" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Owner Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-slate-900 mb-3">Company Details</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-slate-600">Company Name</span>
                            <span className="font-medium">{asset.ownerInfo.companyName}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Contact Person</span>
                            <span className="font-medium">{asset.ownerInfo.contactPerson}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Years in Business</span>
                            <span className="font-medium">{asset.ownerInfo.yearsInBusiness}</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 mb-3">Track Record</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-slate-600">Previous Properties</span>
                            <span className="font-medium">{asset.ownerInfo.previousProperties}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Credit Rating</span>
                            <span className="font-medium text-green-600">{asset.ownerInfo.creditRating}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">KYC Status</span>
                            <Badge className="bg-green-100 text-green-800">{asset.ownerInfo.kycStatus}</Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="risk" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Risk Assessment</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(asset.riskAssessment).map(([key, value]) => (
                        <div key={key} className="flex justify-between items-center">
                          <span className="text-slate-700 capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</span>
                          <Badge
                            className={`${
                              value === "Low"
                                ? "bg-green-100 text-green-800"
                                : value === "Medium" || value === "Medium-Low"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                            }`}
                          >
                            {value}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Action Panel */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Review Actions */}
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl">Review Actions</CardTitle>
                  <p className="text-slate-600">Make a decision on this property submission</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
                    <DialogTrigger asChild>
                      <Button className="w-full bg-green-600 hover:bg-green-700 text-lg py-6">
                        <Check className="h-5 w-5 mr-2" />
                        Approve Property
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Approve Property Submission</DialogTitle>
                        <DialogDescription>
                          This property will be approved and made available for investment.
                        </DialogDescription>
                      </DialogHeader>
                      <Textarea
                        placeholder="Add approval notes (optional)..."
                        value={approvalNotes}
                        onChange={(e) => setApprovalNotes(e.target.value)}
                      />
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setShowApproveDialog(false)}>
                          Cancel
                        </Button>
                        <Button className="bg-green-600 hover:bg-green-700" onClick={handleApprove}>
                          Approve Property
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
                    <DialogTrigger asChild>
                      <Button variant="destructive" className="w-full text-lg py-6">
                        <X className="h-5 w-5 mr-2" />
                        Reject Property
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Reject Property Submission</DialogTitle>
                        <DialogDescription>
                          Please provide a detailed reason for rejecting this property submission.
                        </DialogDescription>
                      </DialogHeader>
                      <Textarea
                        placeholder="Enter detailed rejection reason..."
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        required
                      />
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
                          Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleReject} disabled={!rejectionReason.trim()}>
                          Reject Property
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  <div className="pt-4 border-t">
                    <Button variant="outline" className="w-full bg-transparent" onClick={handleFractionalize}>
                      Start Fractionalization
                    </Button>
                    <p className="text-xs text-slate-500 mt-2 text-center">Only available after approval</p>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Review</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Documents Verified</span>
                    <span className="font-medium">
                      {asset.documents.filter((d) => d.verified).length}/{asset.documents.length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Risk Level</span>
                    <Badge className="bg-yellow-100 text-yellow-800">{asset.riskAssessment.overallRisk}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Owner KYC</span>
                    <Badge className="bg-green-100 text-green-800">Verified</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Expected ROI</span>
                    <span className="font-medium text-green-600">{asset.expectedYield}%</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
