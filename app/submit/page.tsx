"use client"

import type React from "react"

import { useState } from "react"
import { ArrowLeft, Upload, X, Plus, DollarSign, FileText, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"

interface PropertyImage {
  id: string
  file: File
  preview: string
}

interface PropertyDocument {
  id: string
  file: File
  name: string
  type: string
}

export default function SubmitAssetPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [images, setImages] = useState<PropertyImage[]>([])
  const [documents, setDocuments] = useState<PropertyDocument[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form data
  const [formData, setFormData] = useState({
    // Basic Information
    propertyTitle: "",
    propertyType: "",
    location: "",
    address: "",
    description: "",

    // Financial Information
    purchasePrice: "",
    requestedValue: "",
    minInvestment: "",
    expectedYield: "",
    monthlyRevenue: "",
    operatingExpenses: "",

    // Property Details
    propertySize: "",
    yearBuilt: "",
    units: "",
    features: [] as string[],

    // Owner Information
    ownerName: "",
    companyName: "",
    email: "",
    phone: "",
    yearsExperience: "",

    // Legal & Compliance
    hasCleanTitle: false,
    hasInsurance: false,
    hasPermits: false,
    agreeToTerms: false,
  })

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/svg+xml",
      "image/x-icon",
      "image/vnd.microsoft.icon",
    ]

    Array.from(files).forEach((file) => {
      if (allowedTypes.includes(file.type)) {
        const id = Math.random().toString(36).substr(2, 9)
        const preview = URL.createObjectURL(file)
        setImages((prev) => [...prev, { id, file, preview }])
      } else {
        // Show error for invalid file types
        alert(`File "${file.name}" is not supported. Please upload only JPEG, PNG, WebP, SVG, or ICO files.`)
      }
    })

    event.target.value = ""
  }

  const handleDocumentUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    Array.from(files).forEach((file) => {
      const id = Math.random().toString(36).substr(2, 9)
      setDocuments((prev) => [
        ...prev,
        {
          id,
          file,
          name: file.name,
          type: file.type.includes("pdf") ? "PDF" : "Document",
        },
      ])
    })
  }

  const removeImage = (id: string) => {
    setImages((prev) => {
      const image = prev.find((img) => img.id === id)
      if (image) URL.revokeObjectURL(image.preview)
      return prev.filter((img) => img.id !== id)
    })
  }

  const removeDocument = (id: string) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== id))
  }

  const addFeature = (feature: string) => {
    if (feature && !formData.features.includes(feature)) {
      setFormData((prev) => ({
        ...prev,
        features: [...prev.features, feature],
      }))
    }
  }

  const removeFeature = (feature: string) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((f) => f !== feature),
    }))
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    // Simulate submission
    await new Promise((resolve) => setTimeout(resolve, 2000))
    console.log("Submitting property:", { formData, images, documents })
    setIsSubmitting(false)
    // Redirect to success page or admin dashboard
  }

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return formData.propertyTitle && formData.propertyType && formData.location && formData.description
      case 2:
        return formData.purchasePrice && formData.requestedValue && formData.minInvestment && formData.expectedYield
      case 3:
        return images.length > 0
      case 4:
        return documents.length >= 3 // Minimum required documents
      case 5:
        return formData.ownerName && formData.email && formData.phone
      case 6:
        return formData.hasCleanTitle && formData.hasInsurance && formData.hasPermits && formData.agreeToTerms
      default:
        return false
    }
  }

  const steps = [
    { number: 1, title: "Basic Information", description: "Property details and description" },
    { number: 2, title: "Financial Information", description: "Pricing and revenue details" },
    { number: 3, title: "Property Images", description: "Upload property photos" },
    { number: 4, title: "Documents", description: "Legal and financial documents" },
    { number: 5, title: "Owner Information", description: "Contact and experience details" },
    { number: 6, title: "Review & Submit", description: "Final review and submission" },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center text-gray-600 hover:text-[#2d3748]">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Home
              </Link>
            </div>
            <div className="flex items-center space-x-2">
              <img src="/favicon.ico" alt="REALiFi" className="h-6 w-6" />
              <span className="text-lg font-bold text-[#2d3748]">Submit Property</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep === step.number
                      ? "bg-[#2d3748] text-white"
                      : currentStep > step.number
                        ? "bg-[#d69e2e] text-white"
                        : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {step.number}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-1 mx-2 ${currentStep > step.number ? "bg-[#d69e2e]" : "bg-gray-200"}`} />
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-[#2d3748]">{steps[currentStep - 1].title}</h2>
            <p className="text-gray-600">{steps[currentStep - 1].description}</p>
          </div>
        </div>

        {/* Form Content */}
        <Card className="shadow-lg">
          <CardContent className="p-8">
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="propertyTitle">Property Title *</Label>
                    <Input
                      id="propertyTitle"
                      placeholder="e.g., Luxury Downtown Apartment Complex"
                      value={formData.propertyTitle}
                      onChange={(e) => handleInputChange("propertyTitle", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="propertyType">Property Type *</Label>
                    <Select
                      value={formData.propertyType}
                      onValueChange={(value) => handleInputChange("propertyType", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select property type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="residential">Residential</SelectItem>
                        <SelectItem value="commercial">Commercial</SelectItem>
                        <SelectItem value="industrial">Industrial</SelectItem>
                        <SelectItem value="mixed-use">Mixed Use</SelectItem>
                        <SelectItem value="retail">Retail</SelectItem>
                        <SelectItem value="hospitality">Hospitality</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="location">City, State *</Label>
                    <Input
                      id="location"
                      placeholder="e.g., Manhattan, NY"
                      value={formData.location}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="address">Full Address</Label>
                    <Input
                      id="address"
                      placeholder="Street address"
                      value={formData.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Property Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Provide a detailed description of the property, its features, location benefits, and investment potential..."
                    rows={4}
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Label htmlFor="propertySize">Property Size (sq ft)</Label>
                    <Input
                      id="propertySize"
                      placeholder="e.g., 50000"
                      value={formData.propertySize}
                      onChange={(e) => handleInputChange("propertySize", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="yearBuilt">Year Built</Label>
                    <Input
                      id="yearBuilt"
                      placeholder="e.g., 2020"
                      value={formData.yearBuilt}
                      onChange={(e) => handleInputChange("yearBuilt", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="units">Number of Units</Label>
                    <Input
                      id="units"
                      placeholder="e.g., 24"
                      value={formData.units}
                      onChange={(e) => handleInputChange("units", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Financial Information */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="purchasePrice">Purchase Price *</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                      <Input
                        id="purchasePrice"
                        placeholder="2500000"
                        className="pl-10"
                        value={formData.purchasePrice}
                        onChange={(e) => handleInputChange("purchasePrice", e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="requestedValue">Requested Tokenization Value *</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                      <Input
                        id="requestedValue"
                        placeholder="2500000"
                        className="pl-10"
                        value={formData.requestedValue}
                        onChange={(e) => handleInputChange("requestedValue", e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="minInvestment">Minimum Investment Amount *</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                      <Input
                        id="minInvestment"
                        placeholder="1000"
                        className="pl-10"
                        value={formData.minInvestment}
                        onChange={(e) => handleInputChange("minInvestment", e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="expectedYield">Expected Annual Yield (%) *</Label>
                    <Input
                      id="expectedYield"
                      placeholder="8.5"
                      value={formData.expectedYield}
                      onChange={(e) => handleInputChange("expectedYield", e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="monthlyRevenue">Monthly Revenue</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                      <Input
                        id="monthlyRevenue"
                        placeholder="18750"
                        className="pl-10"
                        value={formData.monthlyRevenue}
                        onChange={(e) => handleInputChange("monthlyRevenue", e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="operatingExpenses">Monthly Operating Expenses</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                      <Input
                        id="operatingExpenses"
                        placeholder="5625"
                        className="pl-10"
                        value={formData.operatingExpenses}
                        onChange={(e) => handleInputChange("operatingExpenses", e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-[#2d3748] mb-2">Calculated Metrics</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Annual Revenue</p>
                      <p className="font-medium">
                        ${formData.monthlyRevenue ? (Number(formData.monthlyRevenue) * 12).toLocaleString() : "0"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Annual Expenses</p>
                      <p className="font-medium">
                        ${formData.operatingExpenses ? (Number(formData.operatingExpenses) * 12).toLocaleString() : "0"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Net Operating Income</p>
                      <p className="font-medium text-[#d69e2e]">
                        $
                        {formData.monthlyRevenue && formData.operatingExpenses
                          ? (
                              (Number(formData.monthlyRevenue) - Number(formData.operatingExpenses)) *
                              12
                            ).toLocaleString()
                          : "0"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Cap Rate</p>
                      <p className="font-medium">
                        {formData.monthlyRevenue && formData.operatingExpenses && formData.requestedValue
                          ? (
                              (((Number(formData.monthlyRevenue) - Number(formData.operatingExpenses)) * 12) /
                                Number(formData.requestedValue)) *
                              100
                            ).toFixed(2) + "%"
                          : "0%"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Property Images */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="text-center">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
                    <Upload className="h-12 w-12 text-[#2d3748] mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-[#2d3748] mb-2">Upload Property Images</h3>
                    <p className="text-gray-600 mb-4">
                      Add high-quality photos of your property (exterior, interior, amenities)
                    </p>
                    <input
                      type="file"
                      multiple
                      accept=".jpeg,.jpg,.png,.webp,.svg,.ico"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload">
                      <Button
                        type="button"
                        variant="outline"
                        className="cursor-pointer bg-transparent border-[#2d3748] text-[#2d3748] hover:bg-[#2d3748] hover:text-white"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Choose Images
                      </Button>
                    </label>
                    <p className="text-xs text-gray-500 mt-2">Supported formats: JPEG, PNG, WebP, SVG, ICO</p>
                  </div>
                </div>

                {images.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-[#2d3748] mb-4">Uploaded Images ({images.length})</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {images.map((image) => (
                        <div key={image.id} className="relative group">
                          <img
                            src={image.preview || "/placeholder.svg"}
                            alt="Property"
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <button
                            onClick={() => removeImage(image.id)}
                            className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 4: Documents */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="bg-[#2d3748] bg-opacity-5 p-4 rounded-lg">
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-[#2d3748] mt-0.5 mr-3" />
                    <div>
                      <h4 className="font-semibold text-[#2d3748]">Required Documents</h4>
                      <p className="text-[#2d3748] text-sm mt-1">
                        Please upload the following documents to complete your submission:
                      </p>
                      <ul className="text-[#2d3748] text-sm mt-2 space-y-1">
                        <li>• Property deed or title</li>
                        <li>• Financial statements (last 3 years)</li>
                        <li>• Property inspection report</li>
                        <li>• Insurance policy</li>
                        <li>• Zoning documentation</li>
                        <li>• Environmental assessment (if applicable)</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-[#2d3748] mb-2">Upload Documents</h3>
                    <p className="text-gray-600 mb-4">Upload PDF files and other relevant documents</p>
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx,.xls,.xlsx"
                      onChange={handleDocumentUpload}
                      className="hidden"
                      id="document-upload"
                    />
                    <label htmlFor="document-upload">
                      <Button
                        variant="outline"
                        className="cursor-pointer bg-transparent border-[#2d3748] text-[#2d3748] hover:bg-[#2d3748] hover:text-white"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Choose Documents
                      </Button>
                    </label>
                  </div>
                </div>

                {documents.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-[#2d3748] mb-4">Uploaded Documents ({documents.length})</h4>
                    <div className="space-y-3">
                      {documents.map((doc) => (
                        <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center">
                            <FileText className="h-5 w-5 text-gray-400 mr-3" />
                            <div>
                              <p className="font-medium text-[#2d3748]">{doc.name}</p>
                              <Badge variant="outline">{doc.type}</Badge>
                            </div>
                          </div>
                          <button onClick={() => removeDocument(doc.id)} className="text-red-600 hover:text-red-800">
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 5: Owner Information */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="ownerName">Full Name *</Label>
                    <Input
                      id="ownerName"
                      placeholder="John Smith"
                      value={formData.ownerName}
                      onChange={(e) => handleInputChange("ownerName", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input
                      id="companyName"
                      placeholder="ABC Properties LLC"
                      value={formData.companyName}
                      onChange={(e) => handleInputChange("companyName", e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      placeholder="+1 (555) 123-4567"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="yearsExperience">Years of Real Estate Experience</Label>
                  <Input
                    id="yearsExperience"
                    placeholder="10"
                    value={formData.yearsExperience}
                    onChange={(e) => handleInputChange("yearsExperience", e.target.value)}
                  />
                </div>

                <div>
                  <Label>Property Features</Label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {formData.features.map((feature) => (
                      <Badge key={feature} variant="secondary" className="flex items-center gap-1">
                        {feature}
                        <button onClick={() => removeFeature(feature)}>
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a feature (e.g., Pool, Gym, Parking)"
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          addFeature(e.currentTarget.value)
                          e.currentTarget.value = ""
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={(e) => {
                        const input = e.currentTarget.previousElementSibling as HTMLInputElement
                        addFeature(input.value)
                        input.value = ""
                      }}
                    >
                      Add
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 6: Review & Submit */}
            {currentStep === 6 && (
              <div className="space-y-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-[#2d3748] mb-4">Submission Summary</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-[#2d3748] mb-2">Property Details</h4>
                      <div className="space-y-1 text-sm">
                        <p>
                          <span className="text-gray-600">Title:</span> {formData.propertyTitle}
                        </p>
                        <p>
                          <span className="text-gray-600">Type:</span> {formData.propertyType}
                        </p>
                        <p>
                          <span className="text-gray-600">Location:</span> {formData.location}
                        </p>
                        <p>
                          <span className="text-gray-600">Requested Value:</span> $
                          {Number(formData.requestedValue).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-[#2d3748] mb-2">Attachments</h4>
                      <div className="space-y-1 text-sm">
                        <p>
                          <span className="text-gray-600">Images:</span> {images.length} uploaded
                        </p>
                        <p>
                          <span className="text-gray-600">Documents:</span> {documents.length} uploaded
                        </p>
                        <p>
                          <span className="text-gray-600">Owner:</span> {formData.ownerName}
                        </p>
                        <p>
                          <span className="text-gray-600">Contact:</span> {formData.email}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-[#2d3748]">Legal & Compliance Checklist</h4>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="hasCleanTitle"
                      checked={formData.hasCleanTitle}
                      onCheckedChange={(checked) => handleInputChange("hasCleanTitle", checked as boolean)}
                    />
                    <Label htmlFor="hasCleanTitle">
                      I confirm that the property has a clean title with no liens or encumbrances
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="hasInsurance"
                      checked={formData.hasInsurance}
                      onCheckedChange={(checked) => handleInputChange("hasInsurance", checked as boolean)}
                    />
                    <Label htmlFor="hasInsurance">The property is fully insured and coverage is up to date</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="hasPermits"
                      checked={formData.hasPermits}
                      onCheckedChange={(checked) => handleInputChange("hasPermits", checked as boolean)}
                    />
                    <Label htmlFor="hasPermits">All necessary permits and licenses are current and valid</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onCheckedChange={(checked) => handleInputChange("agreeToTerms", checked as boolean)}
                    />
                    <Label htmlFor="agreeToTerms">I agree to the Terms of Service and Privacy Policy</Label>
                  </div>
                </div>

                <div className="bg-[#d69e2e] bg-opacity-10 p-4 rounded-lg">
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-[#d69e2e] mt-0.5 mr-3" />
                    <div>
                      <h4 className="font-semibold text-[#2d3748]">Review Process</h4>
                      <p className="text-[#2d3748] text-sm mt-1">
                        Your submission will be reviewed by our team within 5-7 business days. You will receive email
                        updates on the status of your application.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-8 border-t">
              <Button
                variant="outline"
                onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
                disabled={currentStep === 1}
              >
                Previous
              </Button>

              {currentStep < 6 ? (
                <Button
                  onClick={() => setCurrentStep((prev) => prev + 1)}
                  disabled={!isStepValid(currentStep)}
                  className="bg-[#2d3748] hover:bg-[#2d3748]/90 text-white"
                >
                  Next Step
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={!isStepValid(currentStep) || isSubmitting}
                  className="bg-[#d69e2e] hover:bg-[#d69e2e]/90 text-white"
                >
                  {isSubmitting ? "Submitting..." : "Submit Property"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
