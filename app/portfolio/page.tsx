"use client";

import { useState } from "react";
import { TrendingUp, DollarSign, Calendar, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";

// Mock portfolio data
const portfolioData = {
  totalValue: 15750,
  totalInvested: 12500,
  totalReturns: 3250,
  totalDividends: 1890,
  returnPercentage: 26.0,
  properties: [
    {
      id: 1,
      title: "Luxury Downtown Apartment Complex",
      location: "Manhattan, NY",
      image: "/luxury-apartment-building-downtown.jpg",
      invested: 5000,
      currentValue: 6250,
      tokens: 5,
      totalTokens: 2500,
      dividendsEarned: 875,
      lastDividend: 125,
      apy: 8.5,
      investmentDate: "2024-03-15",
      status: "active",
    },
    {
      id: 2,
      title: "Waterfront Office Building",
      location: "Miami, FL",
      image: "/modern-waterfront-office-building-miami.jpg",
      invested: 3500,
      currentValue: 4200,
      tokens: 7,
      totalTokens: 1800,
      dividendsEarned: 420,
      lastDividend: 85,
      apy: 7.2,
      investmentDate: "2024-05-22",
      status: "active",
    },
    {
      id: 3,
      title: "Historic Retail Plaza",
      location: "Boston, MA",
      image: "/historic-retail-plaza-boston-brick-building.jpg",
      invested: 2500,
      currentValue: 2800,
      tokens: 10,
      totalTokens: 950,
      dividendsEarned: 340,
      lastDividend: 68,
      apy: 6.8,
      investmentDate: "2024-07-10",
      status: "active",
    },
    {
      id: 4,
      title: "Tech Campus Development",
      location: "Austin, TX",
      image: "/modern-tech-campus-austin-texas.jpg",
      invested: 1500,
      currentValue: 1500,
      tokens: 2,
      totalTokens: 3200,
      dividendsEarned: 255,
      lastDividend: 45,
      apy: 9.1,
      investmentDate: "2024-09-05",
      status: "pending",
    },
  ],
  recentTransactions: [
    {
      id: 1,
      type: "dividend",
      property: "Luxury Downtown Apartment Complex",
      amount: 125,
      date: "2024-12-01",
      status: "completed",
    },
    {
      id: 2,
      type: "investment",
      property: "Tech Campus Development",
      amount: 1500,
      date: "2024-09-05",
      status: "completed",
    },
    {
      id: 3,
      type: "dividend",
      property: "Waterfront Office Building",
      amount: 85,
      date: "2024-11-28",
      status: "completed",
    },
  ],
};

export default function PortfolioPage() {
  const [selectedTab, setSelectedTab] = useState("overview");

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            My Portfolio
          </h1>
          <p className="text-muted-foreground">
            Track your real estate investments and returns
          </p>
        </div>

        {/* Portfolio Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Portfolio Value */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Portfolio Value
              </CardTitle>
              <DollarSign className="h-4 w-4 text-[#2d3748]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                ${portfolioData.totalValue.toLocaleString()}
              </div>
              <div className="flex items-center text-sm text-primary mt-1">
                <TrendingUp className="h-4 w-4 mr-1" />+
                {portfolioData.returnPercentage}% all time
              </div>
            </CardContent>
          </Card>

          {/* Total Invested */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Invested
              </CardTitle>
              <ArrowUpRight className="h-4 w-4 text-[#2d3748]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                ${portfolioData.totalInvested.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Across {portfolioData.properties.length} properties
              </p>
            </CardContent>
          </Card>

          {/* Total Returns */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Returns
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                +${portfolioData.totalReturns.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Unrealized gains
              </p>
            </CardContent>
          </Card>

          {/* Dividends Earned */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Dividends Earned
              </CardTitle>
              <Calendar className="h-4 w-4 text-[#2d3748]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                ${portfolioData.totalDividends.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Lifetime earnings
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs
          value={selectedTab}
          onValueChange={setSelectedTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-3 lg:w-96">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="properties">Properties</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Portfolio Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">
                    Portfolio performance chart would go here
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {portfolioData.recentTransactions
                    .slice(0, 3)
                    .map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              transaction.type === "dividend"
                                ? "bg-primary"
                                : "bg-[#2d3748]"
                            }`}
                          ></div>
                          <div>
                            <p className="font-medium text-foreground">
                              {transaction.type === "dividend"
                                ? "Dividend Received"
                                : "Investment Made"}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {transaction.property}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p
                            className={`font-medium ${
                              transaction.type === "dividend"
                                ? "text-primary"
                                : "text-foreground"
                            }`}
                          >
                            {transaction.type === "dividend" ? "+" : ""}$
                            {transaction.amount}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {transaction.date}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Properties Tab */}
          <TabsContent value="properties" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {portfolioData.properties.map((property) => (
                <Card key={property.id} className="overflow-hidden">
                  <div className="relative">
                    <img
                      src={property.image || "/placeholder.svg"}
                      alt={property.title}
                      className="w-full h-48 object-cover"
                    />
                    <Badge
                      className={`absolute top-3 right-3 ${
                        property.status === "active"
                          ? "bg-primary text-primary-foreground"
                          : "bg-[#2d3748] text-white"
                      }`}
                    >
                      {property.status}
                    </Badge>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg">{property.title}</CardTitle>
                    <p className="text-slate-600">{property.location}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Invested
                        </p>
                        <p className="font-semibold text-foreground">
                          ${property.invested.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Current Value
                        </p>
                        <p className="font-semibold text-foreground">
                          ${property.currentValue.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Tokens Owned
                        </p>
                        <p className="font-semibold text-foreground">
                          {property.tokens}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Total Dividends
                        </p>
                        <p className="font-semibold text-primary">
                          ${property.dividendsEarned}
                        </p>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Ownership</span>
                        <span className="font-medium">
                          {(
                            (property.tokens / property.totalTokens) *
                            100
                          ).toFixed(3)}
                          %
                        </span>
                      </div>
                      <Progress
                        value={(property.tokens / property.totalTokens) * 100}
                        className="h-2"
                      />
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <div>
                        <p className="text-sm text-muted-foreground">APY</p>
                        <p className="font-semibold text-foreground">
                          {property.apy}%
                        </p>
                      </div>
                      <Link href={`/property/${property.id}`}>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Transaction History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {portfolioData.recentTransactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            transaction.type === "dividend"
                              ? "bg-primary/10"
                              : "bg-[#2d3748]/10"
                          }`}
                        >
                          {transaction.type === "dividend" ? (
                            <TrendingUp className="h-5 w-5 text-primary" />
                          ) : (
                            <ArrowUpRight className="h-5 w-5 text-[#2d3748]" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">
                            {transaction.type === "dividend"
                              ? "Dividend Payment"
                              : "Token Purchase"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {transaction.property}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {transaction.date}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className={`text-lg font-semibold ${
                            transaction.type === "dividend"
                              ? "text-primary"
                              : "text-foreground"
                          }`}
                        >
                          {transaction.type === "dividend" ? "+" : ""}$
                          {transaction.amount}
                        </p>
                        <Badge variant="outline" className="text-xs">
                          {transaction.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
