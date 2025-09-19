"use client"

import { useState } from "react"
import { ArrowLeft, MapPin, TrendingUp, Users, Calendar, Shield, ExternalLink, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { useParams } from "next/navigation"

// Mock property data
const propertyData = {
  1: {
    id: 1,
    title: "Luxury Downtown Apartment Complex",
    location: "Manhattan, NY",
    images: [
      "/luxury-apartment-building-exterior-manhattan.jpg",
      "/luxury-apartment-lobby-interior.jpg",
      "/luxury-apartment-unit-interior.jpg",
      "/luxury-apartment-amenities-pool.jpg",
    ],
    progress: 75,
    minInvestment: 1000,
    totalValue: 2500000,
    expectedYield: 8.5,
    tokensSold: 1875,
    totalTokens: 2500,
    tokenPrice: 1000,
    description:
      "A premium 24-unit luxury apartment complex in the heart of Manhattan. This property features modern amenities, prime location access, and strong rental demand from young professionals.",
    features: [
      "24 luxury units",
      "Rooftop terrace",
      "Fitness center",
      "Concierge service",
      "Underground parking",
      "Pet-friendly",
    ],
    financials: {
      purchasePrice: 2500000,
      renovationCost: 150000,
      monthlyRent: 18750,
      annualRent: 225000,
      operatingExpenses: 67500,
      netOperatingIncome: 157500,
      capRate: 6.3,
      projectedAppreciation: 3.2,
    },
    documents: [
      { name: "Property Deed", type: "PDF", verified: true },
      { name: "Financial Statements", type: "PDF", verified: true },
      { name: "Inspection Report", type: "PDF", verified: true },
      { name: "Insurance Policy", type: "PDF", verified: false },
    ],
  },
}

export default function PropertyDetailsPage() {
  const params = useParams()
  const propertyId = params.id as string
  const property = propertyData[propertyId as keyof typeof propertyData]

  const [selectedImage, setSelectedImage] = useState(0)
  const [investmentAmount, setInvestmentAmount] = useState("")
  const [isWishlisted, setIsWishlisted] = useState(false)

  if (!property) {
    return <div>Property not found</div>
  }

  const tokensFromInvestment = investmentAmount ? Math.floor(Number(investmentAmount) / property.tokenPrice) : 0
  const ownershipPercentage = tokensFromInvestment
    ? ((tokensFromInvestment / property.totalTokens) * 100).toFixed(3)
    : "0"

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center text-muted-foreground hover:text-primary">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Properties
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={isWishlisted ? "text-red-600 border-red-600" : ""}
              >
                <Heart className={`h-4 w-4 mr-2 ${isWishlisted ? "fill-current" : ""}`} />
                {isWishlisted ? "Wishlisted" : "Add to Wishlist"}
              </Button>
              <Button variant="outline" size="sm">
                <ExternalLink className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images and Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="relative">
                <img
                  src={property.images[selectedImage] || "/placeholder.svg"}
                  alt={property.title}
                  className="w-full h-96 object-cover rounded-lg"
                />
                <Badge className="absolute top-4 right-4 bg-primary text-primary-foreground">
                  {property.expectedYield}% APY
                </Badge>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {property.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative rounded-lg overflow-hidden ${
                      selectedImage === index ? "ring-2 ring-primary" : ""
                    }`}
                  >
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`${property.title} ${index + 1}`}
                      className="w-full h-20 object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Property Info */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-foreground mb-2">{property.title}</h1>
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="h-5 w-5 mr-2" />
                    {property.location}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-foreground">${(property.totalValue / 1000000).toFixed(1)}M</p>
                  <p className="text-muted-foreground">Total Value</p>
                </div>
              </div>

              <p className="text-foreground text-lg leading-relaxed mb-6">{property.description}</p>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Funding Progress</span>
                  <span className="font-medium">{property.progress}%</span>
                </div>
                <Progress value={property.progress} className="h-3" />
                <div className="flex justify-between text-sm mt-2 text-muted-foreground">
                  <span>{property.tokensSold.toLocaleString()} tokens sold</span>
                  <span>{(property.totalTokens - property.tokensSold).toLocaleString()} remaining</span>
                </div>
              </div>

              {/* Key Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="text-center p-4 bg-card rounded-lg border">
                  <TrendingUp className="h-6 w-6 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold text-foreground">{property.expectedYield}%</p>
                  <p className="text-sm text-muted-foreground">Expected APY</p>
                </div>
                <div className="text-center p-4 bg-card rounded-lg border">
                  <Users className="h-6 w-6 text-[#2d3748] mx-auto mb-2" />
                  <p className="text-2xl font-bold text-foreground">{property.tokensSold}</p>
                  <p className="text-sm text-muted-foreground">Investors</p>
                </div>
                <div className="text-center p-4 bg-card rounded-lg border">
                  <Calendar className="h-6 w-6 text-[#2d3748] mx-auto mb-2" />
                  <p className="text-2xl font-bold text-foreground">5 years</p>
                  <p className="text-sm text-muted-foreground">Hold Period</p>
                </div>
                <div className="text-center p-4 bg-card rounded-lg border">
                  <Shield className="h-6 w-6 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold text-foreground">A+</p>
                  <p className="text-sm text-muted-foreground">Credit Rating</p>
                </div>
              </div>
            </div>

            {/* Detailed Information Tabs */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="financials">Financials</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
                <TabsTrigger value="updates">Updates</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Property Features</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      {property.features.map((feature, index) => (
                        <div key={index} className="flex items-center">
                          <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                          <span className="text-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="financials" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Financial Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-foreground mb-3">Revenue</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Annual Rent</span>
                            <span className="font-medium">${property.financials.annualRent.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Monthly Rent</span>
                            <span className="font-medium">${property.financials.monthlyRent.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-3">Expenses</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Operating Expenses</span>
                            <span className="font-medium">
                              ${property.financials.operatingExpenses.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Net Operating Income</span>
                            <span className="font-medium text-primary">
                              ${property.financials.netOperatingIncome.toLocaleString()}
                            </span>
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
                    <CardTitle>Legal Documents</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {property.documents.map((doc, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center">
                            <div
                              className={`w-3 h-3 rounded-full mr-3 ${doc.verified ? "bg-primary" : "bg-yellow-500"}`}
                            ></div>
                            <span className="font-medium">{doc.name}</span>
                            <Badge variant="outline" className="ml-2">
                              {doc.type}
                            </Badge>
                          </div>
                          <Button variant="outline" size="sm">
                            <ExternalLink className="h-4 w-4 mr-2" />
                            View
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="updates" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Updates</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="border-l-4 border-primary pl-4">
                        <p className="font-medium text-foreground">Property Inspection Completed</p>
                        <p className="text-sm text-muted-foreground">December 15, 2024</p>
                        <p className="text-foreground mt-2">
                          Professional inspection completed with excellent results. All systems operational.
                        </p>
                      </div>
                      <div className="border-l-4 border-primary pl-4">
                        <p className="font-medium text-foreground">75% Funding Milestone Reached</p>
                        <p className="text-sm text-muted-foreground">December 10, 2024</p>
                        <p className="text-foreground mt-2">
                          We've successfully reached 75% of our funding goal. Thank you to all investors!
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Investment Panel */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl">Invest in This Property</CardTitle>
                  <p className="text-muted-foreground">Minimum investment: ${property.minInvestment}</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Investment Amount ($)</label>
                    <Input
                      type="number"
                      placeholder="1000"
                      value={investmentAmount}
                      onChange={(e) => setInvestmentAmount(e.target.value)}
                      className="text-lg"
                    />
                  </div>

                  {investmentAmount && (
                    <div className="bg-muted p-4 rounded-lg space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tokens to receive:</span>
                        <span className="font-medium">{tokensFromInvestment}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Ownership percentage:</span>
                        <span className="font-medium">{ownershipPercentage}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Est. annual return:</span>
                        <span className="font-medium text-primary">
                          ${Math.round((Number(investmentAmount) * property.expectedYield) / 100)}
                        </span>
                      </div>
                    </div>
                  )}

                  <Button
                    className="w-full bg-primary hover:bg-primary/90 text-lg py-6"
                    disabled={!investmentAmount || Number(investmentAmount) < property.minInvestment}
                  >
                    Buy Tokens
                  </Button>

                  <div className="text-center">
                    <Button variant="outline" className="w-full bg-transparent">
                      Connect Wallet First
                    </Button>
                  </div>

                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>• Investments are subject to market risks</p>
                    <p>• Minimum holding period: 12 months</p>
                    <p>• Returns are not guaranteed</p>
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
