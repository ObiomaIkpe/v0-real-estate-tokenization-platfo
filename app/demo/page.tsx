"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { InvestorStory } from "@/components/demo/investor-story"
import { LiveTransactionFeed } from "@/components/demo/live-transaction-feed"
import { Globe, Users, DollarSign, TrendingUp, MapPin, Clock } from "lucide-react"

export default function DemoPage() {
  const [selectedStory, setSelectedStory] = useState(0)

  const investorStories = [
    {
      id: "1",
      name: "Sarah Okafor",
      location: "Lagos, Nigeria",
      avatar: "/african-woman-professional.jpg",
      investment: 500,
      tokens: 25,
      monthlyReturn: 42,
      joinDate: "Jan 2024",
      story:
        "As a software engineer in Lagos, I always dreamed of investing in international real estate but never had the capital. REALiFi changed everything. With just $500, I own a piece of a luxury Miami condo alongside investors from 15 countries. The monthly dividends help supplement my income, and I love participating in governance decisions about our shared property.",
    },
    {
      id: "2",
      name: "Chen Wei Ming",
      location: "Singapore",
      avatar: "/asian-man-business.jpg",
      investment: 2500,
      tokens: 125,
      monthlyReturn: 187,
      joinDate: "Mar 2024",
      story:
        "Working in fintech, I understood the potential of tokenized real estate immediately. I started with a small investment to test the platform and was impressed by the transparency and automated dividend distributions. Now I have investments across three properties in different continents, truly diversifying my portfolio globally.",
    },
    {
      id: "3",
      name: "Maria Santos",
      location: "São Paulo, Brazil",
      avatar: "/latina-professional-woman.png",
      investment: 800,
      tokens: 40,
      monthlyReturn: 67,
      joinDate: "Feb 2024",
      story:
        "As a teacher, traditional real estate investment was out of reach. REALiFi democratized access for people like me. I love that I can vote on property improvements and see exactly how my investment is performing. The platform's transparency and the community of global investors make me feel part of something bigger.",
    },
  ]

  const globalStats = {
    totalInvestors: 1247,
    countriesRepresented: 34,
    totalInvested: 2850000,
    propertiesTokenized: 12,
    averageReturn: 8.4,
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-[#2d3748] text-white p-6">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <Image src="/favicon.ico" alt="REALiFi Logo" width={32} height={32} className="rounded" />
          <div>
            <h1 className="text-2xl font-bold">REALiFi Demo: Global Real Estate Democratization</h1>
            <p className="text-gray-300">Powered by Hedera DLT - Connecting investors worldwide</p>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#2d3748] mb-4">
            Breaking Down Barriers to Global Real Estate Investment
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Meet real investors from around the world who are building wealth through fractional real estate ownership,
            starting with as little as $10 and earning passive income from premium properties globally.
          </p>
        </div>

        {/* Global Impact Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-12">
          <Card className="border-[#2d3748] text-center">
            <CardContent className="p-6">
              <Users className="h-8 w-8 text-[#d69e2e] mx-auto mb-2" />
              <p className="text-2xl font-bold text-[#2d3748]">{globalStats.totalInvestors.toLocaleString()}</p>
              <p className="text-sm text-gray-600">Global Investors</p>
            </CardContent>
          </Card>

          <Card className="border-[#2d3748] text-center">
            <CardContent className="p-6">
              <Globe className="h-8 w-8 text-[#d69e2e] mx-auto mb-2" />
              <p className="text-2xl font-bold text-[#2d3748]">{globalStats.countriesRepresented}</p>
              <p className="text-sm text-gray-600">Countries</p>
            </CardContent>
          </Card>

          <Card className="border-[#2d3748] text-center">
            <CardContent className="p-6">
              <DollarSign className="h-8 w-8 text-[#d69e2e] mx-auto mb-2" />
              <p className="text-2xl font-bold text-[#2d3748]">${(globalStats.totalInvested / 1000000).toFixed(1)}M</p>
              <p className="text-sm text-gray-600">Total Invested</p>
            </CardContent>
          </Card>

          <Card className="border-[#2d3748] text-center">
            <CardContent className="p-6">
              <MapPin className="h-8 w-8 text-[#d69e2e] mx-auto mb-2" />
              <p className="text-2xl font-bold text-[#2d3748]">{globalStats.propertiesTokenized}</p>
              <p className="text-sm text-gray-600">Properties</p>
            </CardContent>
          </Card>

          <Card className="border-[#2d3748] text-center">
            <CardContent className="p-6">
              <TrendingUp className="h-8 w-8 text-[#d69e2e] mx-auto mb-2" />
              <p className="text-2xl font-bold text-[#2d3748]">{globalStats.averageReturn}%</p>
              <p className="text-sm text-gray-600">Avg. Return</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Investor Stories */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-[#2d3748] mb-4">Real Investor Stories</h3>
              <div className="flex gap-2 mb-4">
                {investorStories.map((story, index) => (
                  <Button
                    key={story.id}
                    onClick={() => setSelectedStory(index)}
                    variant={selectedStory === index ? "default" : "outline"}
                    className={
                      selectedStory === index
                        ? "bg-[#d69e2e] hover:bg-[#b7791f] text-white"
                        : "border-[#2d3748] text-[#2d3748] hover:bg-gray-50"
                    }
                    size="sm"
                  >
                    {story.name.split(" ")[0]}
                  </Button>
                ))}
              </div>
            </div>

            <InvestorStory
              investor={investorStories[selectedStory]}
              propertyName="Miami Luxury Condo"
              propertyLocation="Miami, FL, USA"
            />

            {/* Hedera Benefits */}
            <Card className="border-[#2d3748] mt-6">
              <CardHeader>
                <CardTitle className="text-[#2d3748] flex items-center gap-2">
                  <Clock className="h-5 w-5 text-[#d69e2e]" />
                  Powered by Hedera DLT
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="font-bold text-[#2d3748]">Sub-Second</p>
                    <p className="text-sm text-gray-600">Transaction Finality</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="font-bold text-[#2d3748]">$0.0001</p>
                    <p className="text-sm text-gray-600">Transaction Fees</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="font-bold text-[#2d3748]">Carbon Negative</p>
                    <p className="text-sm text-gray-600">Sustainable Network</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Live Activity Feed */}
          <div>
            <LiveTransactionFeed />
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center bg-gradient-to-r from-[#2d3748] to-[#4a5568] text-white p-8 rounded-lg">
          <h3 className="text-2xl font-bold mb-4">Join the Global Real Estate Revolution</h3>
          <p className="text-gray-200 mb-6 max-w-2xl mx-auto">
            Start your real estate investment journey with as little as $100. Join thousands of investors from around
            the world building wealth through fractional property ownership.
          </p>
          <div className="flex gap-4 justify-center">
            <Button className="bg-[#d69e2e] hover:bg-[#b7791f] text-white px-8 py-3">Start Investing Today</Button>
            <Button
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-[#2d3748] px-8 py-3 bg-transparent"
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
