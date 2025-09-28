"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  adminService,
  AdminPropertyDetails,
} from "@/lib/services/admin.service";
import {
  ArrowLeft,
  ExternalLink,
  Download,
  CheckCircle,
  XCircle,
  Coins,
  Eye,
  MapPin,
  Calendar,
  DollarSign,
  Building,
  User,
  Mail,
  Phone,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function PropertyReviewPage() {
  const params = useParams();
  const router = useRouter();
  const [property, setProperty] = useState<AdminPropertyDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const propertyId = params.id as string;

  // Fetch property details
  useEffect(() => {
    async function fetchProperty() {
      try {
        setLoading(true);
        setError(null);
        const data = await adminService.getPropertyDetails(propertyId);
        setProperty(data);
      } catch (err) {
        console.error("Error fetching property:", err);
        setError("Failed to load property details. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    if (propertyId) {
      fetchProperty();
    }
  }, [propertyId]);

  // Handle admin actions
  const handleApprove = async () => {
    try {
      setActionLoading("approve");
      await adminService.approveProperty(propertyId);

      // Refresh property data
      const updatedData = await adminService.getPropertyDetails(propertyId);
      setProperty(updatedData);

      alert("Property approved successfully!");
    } catch (error) {
      console.error("Error approving property:", error);
      alert("Failed to approve property. Please try again.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleTokenize = async () => {
    try {
      setActionLoading("tokenize");
      const result = await adminService.tokenizeProperty(propertyId);

      // Refresh property data
      const updatedData = await adminService.getPropertyDetails(propertyId);
      setProperty(updatedData);

      alert(
        `Property tokenized successfully! NFT Metadata: ${result.data.metadataUrl}`
      );
    } catch (error) {
      console.error("Error tokenizing property:", error);
      alert("Failed to tokenize property. Please try again.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async () => {
    if (confirm("Are you sure you want to reject this property?")) {
      try {
        setActionLoading("reject");
        await adminService.rejectProperty(propertyId);

        // Refresh property data
        const updatedData = await adminService.getPropertyDetails(propertyId);
        setProperty(updatedData);

        alert("Property rejected.");
      } catch (error) {
        console.error("Error rejecting property:", error);
        alert("Failed to reject property. Please try again.");
      } finally {
        setActionLoading(null);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">Error</div>
          <p className="text-gray-600 mb-4">{error || "Property not found"}</p>
          <Button onClick={() => router.push("/admin")}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "tokenized":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push("/admin")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {property.propertyTitle}
              </h1>
              <div className="flex items-center gap-4 text-gray-600">
                <span className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {property.location}
                </span>
                <span className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Submitted: {new Date(property.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
            <Badge
              className={`${getStatusColor(property.status)} border text-sm px-3 py-1`}
            >
              {property.status.charAt(0).toUpperCase() +
                property.status.slice(1)}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel - Property Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Property Images */}
            <Card>
              <CardHeader>
                <CardTitle>Property Images ({property.totalImages})</CardTitle>
              </CardHeader>
              <CardContent>
                {property.pinataUrls.images &&
                property.pinataUrls.images.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {property.pinataUrls.images.map((imageUrl, index) => (
                      <div
                        key={index}
                        className="relative h-64 rounded-lg overflow-hidden"
                      >
                        <Image
                          src={imageUrl}
                          alt={`Property image ${index + 1}`}
                          fill
                          className="object-cover"
                          onError={(e) => {
                            e.currentTarget.src = "/placeholder-property.jpg";
                          }}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No images uploaded</p>
                )}
              </CardContent>
            </Card>

            {/* Property Information */}
            <Card>
              <CardHeader>
                <CardTitle>Property Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Property Type</p>
                    <p className="font-medium">{property.propertyType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Size</p>
                    <p className="font-medium">{property.propertySize} sq ft</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Year Built</p>
                    <p className="font-medium">{property.yearBuilt}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Units</p>
                    <p className="font-medium">{property.units}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-2">Full Address</p>
                  <p className="font-medium">{property.address}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-2">Description</p>
                  <p className="text-gray-800">{property.description}</p>
                </div>

                {property.features && property.features.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Features</p>
                    <div className="flex flex-wrap gap-2">
                      {property.features.map((feature, index) => (
                        <Badge key={index} variant="outline">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Financial Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="h-5 w-5 mr-2" />
                  Financial Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600">Purchase Price</p>
                      <p className="text-xl font-bold">
                        ${Number(property.purchasePrice).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">
                        Requested Tokenization Value
                      </p>
                      <p className="text-xl font-bold text-blue-600">
                        ${Number(property.requestedValue).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">
                        Minimum Investment
                      </p>
                      <p className="font-medium">
                        ${Number(property.minInvestment).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600">
                        Expected Annual Yield
                      </p>
                      <p className="text-xl font-bold text-green-600">
                        {property.expectedYield}%
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Monthly Revenue</p>
                      <p className="font-medium">
                        ${Number(property.monthlyRevenue).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">
                        Monthly Operating Expenses
                      </p>
                      <p className="font-medium">
                        ${Number(property.operatingExpenses).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Owner Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Owner Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Full Name</p>
                      <p className="font-medium">{property.ownerName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Company</p>
                      <p className="font-medium">{property.companyName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">
                        Years of Experience
                      </p>
                      <p className="font-medium">
                        {property.yearsExperience} years
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-gray-400" />
                      <a
                        href={`mailto:${property.email}`}
                        className="text-blue-600 hover:underline"
                      >
                        {property.email}
                      </a>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-gray-400" />
                      <a
                        href={`tel:${property.phone}`}
                        className="text-blue-600 hover:underline"
                      >
                        {property.phone}
                      </a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Actions & IPFS Links */}
          <div className="space-y-6">
            {/* Current Status */}
            <Card>
              <CardHeader>
                <CardTitle>Current Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <Badge
                    className={`${getStatusColor(property.status)} border text-lg px-4 py-2`}
                  >
                    {property.status.charAt(0).toUpperCase() +
                      property.status.slice(1)}
                  </Badge>
                  <p className="text-sm text-gray-600 mt-2">
                    Last updated:{" "}
                    {new Date(property.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* IPFS Verification Links */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ExternalLink className="h-5 w-5 mr-2" />
                  IPFS Verification
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {property.pinataUrls.metadata && (
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    asChild
                  >
                    <a
                      href={property.pinataUrls.metadata}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Metadata on IPFS
                    </a>
                  </Button>
                )}

                {property.ipfsMetadataHash && (
                  <div className="text-sm">
                    <p className="text-gray-600 mb-1">Metadata Hash:</p>
                    <p className="font-mono text-xs bg-gray-100 p-2 rounded break-all">
                      {property.ipfsMetadataHash}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    disabled={!property.pinataUrls.images?.length}
                  >
                    <a
                      href={property.pinataUrls.images?.[0]}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Images
                    </a>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    disabled={!property.pinataUrls.documents?.length}
                  >
                    <a
                      href={property.pinataUrls.documents?.[0]}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Documents
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Documents */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Download className="h-5 w-5 mr-2" />
                  Documents ({property.totalDocuments})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {property.pinataUrls.documents &&
                property.pinataUrls.documents.length > 0 ? (
                  <div className="space-y-2">
                    {property.pinataUrls.documents.map((docUrl, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="w-full justify-start"
                        asChild
                      >
                        <a
                          href={docUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Document {index + 1}
                        </a>
                      </Button>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No documents uploaded</p>
                )}
              </CardContent>
            </Card>

            {/* Admin Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Admin Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {property.status === "pending" && (
                  <>
                    <Button
                      onClick={handleApprove}
                      disabled={actionLoading === "approve"}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      {actionLoading === "approve" ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      ) : (
                        <CheckCircle className="h-4 w-4 mr-2" />
                      )}
                      Approve Property
                    </Button>

                    <Button
                      onClick={handleReject}
                      disabled={actionLoading === "reject"}
                      variant="destructive"
                      className="w-full"
                    >
                      {actionLoading === "reject" ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      ) : (
                        <XCircle className="h-4 w-4 mr-2" />
                      )}
                      Reject Property
                    </Button>
                  </>
                )}

                {property.status === "approved" && (
                  <Button
                    onClick={handleTokenize}
                    disabled={actionLoading === "tokenize"}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    {actionLoading === "tokenize" ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    ) : (
                      <Coins className="h-4 w-4 mr-2" />
                    )}
                    Tokenize Property
                  </Button>
                )}

                {property.status === "tokenized" && (
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Coins className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-sm font-medium text-blue-900">
                      Property Tokenized
                    </p>
                    <p className="text-xs text-blue-600">
                      Ready for NFT minting
                    </p>
                  </div>
                )}

                {property.status === "rejected" && (
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <XCircle className="h-8 w-8 text-red-600 mx-auto mb-2" />
                    <p className="text-sm font-medium text-red-900">
                      Property Rejected
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
