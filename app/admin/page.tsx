"use client";

import { useState } from "react";
import {
  Users,
  DollarSign,
  TrendingUp,
  Eye,
  X,
  Check,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import Image from "next/image";

// Mock admin data
const adminData = {
  stats: {
    totalProperties: 47,
    pendingReviews: 8,
    totalInvestors: 2847,
    totalValue: 12500000,
    monthlyRevenue: 89750,
  },
  pendingAssets: [
    {
      id: 5,
      title: "Luxury Beachfront Resort",
      location: "Malibu, CA",
      owner: "Coastal Properties LLC",
      submittedDate: "2024-12-10",
      requestedValue: 8500000,
      minInvestment: 2000,
      expectedYield: 7.8,
      status: "pending_review",
      documents: 12,
      image: "/luxury-beachfront-resort-malibu.jpg",
    },
    {
      id: 6,
      title: "Downtown Mixed-Use Development",
      location: "Seattle, WA",
      owner: "Urban Development Corp",
      submittedDate: "2024-12-08",
      requestedValue: 4200000,
      minInvestment: 500,
      expectedYield: 8.9,
      status: "pending_review",
      documents: 8,
      image: "/downtown-mixed-use-development-seattle.jpg",
    },
    {
      id: 7,
      title: "Historic Warehouse Conversion",
      location: "Portland, OR",
      owner: "Heritage Properties",
      submittedDate: "2024-12-05",
      requestedValue: 2800000,
      minInvestment: 750,
      expectedYield: 6.5,
      status: "under_review",
      documents: 15,
      image: "/historic-warehouse-conversion-portland.jpg",
    },
    {
      id: 8,
      title: "Suburban Shopping Center",
      location: "Phoenix, AZ",
      owner: "Retail Ventures Inc",
      submittedDate: "2024-12-03",
      requestedValue: 3600000,
      minInvestment: 400,
      expectedYield: 7.2,
      status: "pending_review",
      documents: 10,
      image: "/suburban-shopping-center-phoenix.jpg",
    },
  ],
  activeProperties: [
    {
      id: 1,
      title: "Luxury Downtown Apartment Complex",
      location: "Manhattan, NY",
      totalValue: 2500000,
      tokensSold: 1875,
      totalTokens: 2500,
      investors: 234,
      monthlyRevenue: 18750,
      status: "active",
    },
    {
      id: 2,
      title: "Waterfront Office Building",
      location: "Miami, FL",
      totalValue: 1800000,
      tokensSold: 810,
      totalTokens: 1800,
      investors: 156,
      monthlyRevenue: 12600,
      status: "active",
    },
  ],
};

export default function AdminDashboard() {
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectDialog, setShowRejectDialog] = useState(false);

  const handleApprove = (assetId: number) => {
    console.log(`Approving asset ${assetId}`);
    // Handle approval logic
  };

  const handleReject = (assetId: number) => {
    console.log(`Rejecting asset ${assetId} with reason: ${rejectionReason}`);
    setShowRejectDialog(false);
    setRejectionReason("");
    // Handle rejection logic
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending_review":
        return "bg-yellow-100 text-yellow-800";
      case "under_review":
        return "bg-blue-100 text-blue-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending_review":
        return <Clock className="h-4 w-4" />;
      case "under_review":
        return <Eye className="h-4 w-4" />;
      case "approved":
        return <Check className="h-4 w-4" />;
      case "rejected":
        return <X className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link href="/" className="flex items-center space-x-2">
                <Image
                  src="/favicon.ico"
                  alt="REALiFi Logo"
                  width={32}
                  height={32}
                  className="h-8 w-8"
                />
                <span className="text-xl font-bold text-foreground">
                  REALiFi Admin
                </span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-primary border-primary">
                Admin Access
              </Badge>
              <Button variant="outline" size="sm">
                Settings
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">
            Manage property submissions and platform operations
          </p>
        </div>

        {/* Admin Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Properties
              </CardTitle>
              <Image
                src="/favicon.ico"
                alt="REALiFi Logo"
                width={16}
                height={16}
                className="h-4 w-4"
              />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {adminData.stats.totalProperties}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending Reviews
              </CardTitle>
              <Clock className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {adminData.stats.pendingReviews}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Investors
              </CardTitle>
              <Users className="h-4 w-4 text-[#2d3748]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {adminData.stats.totalInvestors.toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Value
              </CardTitle>
              <DollarSign className="h-4 w-4 text-[#2d3748]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                ${(adminData.stats.totalValue / 1000000).toFixed(1)}M
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Monthly Revenue
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                ${adminData.stats.monthlyRevenue.toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-96">
            <TabsTrigger value="pending">Pending Assets</TabsTrigger>
            <TabsTrigger value="active">Active Properties</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Assets Pending Review</CardTitle>
                <p className="text-slate-600">
                  Review and approve new property submissions
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {adminData.pendingAssets.map((asset) => (
                    <div key={asset.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex space-x-4">
                          <img
                            src={asset.image || "/placeholder.svg"}
                            alt={asset.title}
                            className="w-24 h-24 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-slate-900 mb-1">
                              {asset.title}
                            </h3>
                            <p className="text-slate-600 mb-2">
                              {asset.location}
                            </p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <p className="text-slate-600">Owner</p>
                                <p className="font-medium">{asset.owner}</p>
                              </div>
                              <div>
                                <p className="text-slate-600">
                                  Requested Value
                                </p>
                                <p className="font-medium">
                                  ${(asset.requestedValue / 1000000).toFixed(1)}
                                  M
                                </p>
                              </div>
                              <div>
                                <p className="text-slate-600">Min Investment</p>
                                <p className="font-medium">
                                  ${asset.minInvestment}
                                </p>
                              </div>
                              <div>
                                <p className="text-slate-600">Expected Yield</p>
                                <p className="font-medium">
                                  {asset.expectedYield}%
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          <Badge className={getStatusColor(asset.status)}>
                            <div className="flex items-center space-x-1">
                              {getStatusIcon(asset.status)}
                              <span className="capitalize">
                                {asset.status.replace("_", " ")}
                              </span>
                            </div>
                          </Badge>
                          <p className="text-xs text-muted-foreground">
                            Submitted {asset.submittedDate}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {asset.documents} documents
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-end space-x-2 mt-4 pt-4 border-t">
                        <Link href={`/admin/review/${asset.id}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            Review
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          className="bg-primary hover:bg-primary/90"
                          onClick={() => handleApprove(asset.id)}
                        >
                          <Check className="h-4 w-4 mr-2" />
                          Approve
                        </Button>
                        <Dialog
                          open={showRejectDialog}
                          onOpenChange={setShowRejectDialog}
                        >
                          <DialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                              <X className="h-4 w-4 mr-2" />
                              Reject
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>
                                Reject Property Submission
                              </DialogTitle>
                              <DialogDescription>
                                Please provide a reason for rejecting this
                                property submission.
                              </DialogDescription>
                            </DialogHeader>
                            <Textarea
                              placeholder="Enter rejection reason..."
                              value={rejectionReason}
                              onChange={(e) =>
                                setRejectionReason(e.target.value)
                              }
                            />
                            <DialogFooter>
                              <Button
                                variant="outline"
                                onClick={() => setShowRejectDialog(false)}
                              >
                                Cancel
                              </Button>
                              <Button
                                variant="destructive"
                                onClick={() => handleReject(asset.id)}
                                disabled={!rejectionReason.trim()}
                              >
                                Reject Property
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="active" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Active Properties</CardTitle>
                <p className="text-slate-600">
                  Monitor live property performance
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {adminData.activeProperties.map((property) => (
                    <div key={property.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold text-slate-900 mb-1">
                            {property.title}
                          </h3>
                          <p className="text-slate-600 mb-3">
                            {property.location}
                          </p>
                          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                            <div>
                              <p className="text-slate-600">Total Value</p>
                              <p className="font-medium">
                                ${(property.totalValue / 1000000).toFixed(1)}M
                              </p>
                            </div>
                            <div>
                              <p className="text-slate-600">Tokens Sold</p>
                              <p className="font-medium">
                                {property.tokensSold}/{property.totalTokens}
                              </p>
                            </div>
                            <div>
                              <p className="text-slate-600">Investors</p>
                              <p className="font-medium">
                                {property.investors}
                              </p>
                            </div>
                            <div>
                              <p className="text-slate-600">Monthly Revenue</p>
                              <p className="font-medium">
                                ${property.monthlyRevenue.toLocaleString()}
                              </p>
                            </div>
                            <div>
                              <p className="text-slate-600">Funding</p>
                              <p className="font-medium">
                                {Math.round(
                                  (property.tokensSold / property.totalTokens) *
                                    100
                                )}
                                %
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          <Badge className="bg-primary text-primary-foreground">
                            Active
                          </Badge>
                          <Link href={`/property/${property.id}`}>
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Platform Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                    <p className="text-muted-foreground">
                      Analytics charts would go here
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Revenue Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                    <p className="text-muted-foreground">
                      Revenue charts would go here
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
