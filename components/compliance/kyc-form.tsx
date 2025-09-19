"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import type { InvestorProfile } from "@/lib/compliance/kyc-service"
import { Upload, FileText, CheckCircle, Clock } from "lucide-react"

interface KYCFormProps {
  onSubmit: (profile: Partial<InvestorProfile>) => void
  loading?: boolean
}

export function KYCForm({ onSubmit, loading = false }: KYCFormProps) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    nationality: "",
    residenceCountry: "",
    address: {
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
    },
    email: "",
    phone: "",
    documents: [] as any[],
    agreements: {
      termsOfService: false,
      privacyPolicy: false,
      amlPolicy: false,
      dataProcessing: false,
    },
  })

  const countries = [
    "United States",
    "United Kingdom",
    "Canada",
    "Australia",
    "Germany",
    "France",
    "Singapore",
    "Japan",
    "Brazil",
    "Nigeria",
    "India",
    "South Africa",
  ]

  const documentTypes = [
    { value: "passport", label: "Passport", required: true },
    { value: "national_id", label: "National ID", required: false },
    { value: "drivers_license", label: "Driver's License", required: false },
    { value: "utility_bill", label: "Utility Bill", required: true },
    { value: "bank_statement", label: "Bank Statement", required: false },
  ]

  const handleInputChange = (field: string, value: any) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".")
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value,
        },
      }))
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }))
    }
  }

  const handleFileUpload = (documentType: string, file: File) => {
    const newDocument = {
      type: documentType,
      fileName: file.name,
      status: "pending",
      uploadDate: new Date(),
    }

    setFormData((prev) => ({
      ...prev,
      documents: [...prev.documents.filter((doc) => doc.type !== documentType), newDocument],
    }))
  }

  const handleSubmit = () => {
    const profile: Partial<InvestorProfile> = {
      personalInfo: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        dateOfBirth: new Date(formData.dateOfBirth),
        nationality: formData.nationality,
        residenceCountry: formData.residenceCountry,
        address: formData.address,
      },
      contactInfo: {
        email: formData.email,
        phone: formData.phone,
      },
      documents: formData.documents,
    }

    onSubmit(profile)
  }

  const getStepStatus = (stepNumber: number) => {
    if (stepNumber < step) return "completed"
    if (stepNumber === step) return "current"
    return "upcoming"
  }

  const isStepValid = (stepNumber: number) => {
    switch (stepNumber) {
      case 1:
        return (
          formData.firstName &&
          formData.lastName &&
          formData.dateOfBirth &&
          formData.nationality &&
          formData.residenceCountry
        )
      case 2:
        return (
          formData.address.street &&
          formData.address.city &&
          formData.address.country &&
          formData.email &&
          formData.phone
        )
      case 3:
        const requiredDocs = documentTypes.filter((doc) => doc.required)
        return requiredDocs.every((doc) => formData.documents.some((uploaded) => uploaded.type === doc.value))
      case 4:
        return Object.values(formData.agreements).every((agreed) => agreed)
      default:
        return false
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8">
        {[1, 2, 3, 4].map((stepNumber) => (
          <div key={stepNumber} className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                getStepStatus(stepNumber) === "completed"
                  ? "bg-green-500 text-white"
                  : getStepStatus(stepNumber) === "current"
                    ? "bg-[#d69e2e] text-white"
                    : "bg-gray-200 text-gray-600"
              }`}
            >
              {getStepStatus(stepNumber) === "completed" ? <CheckCircle className="h-5 w-5" /> : stepNumber}
            </div>
            {stepNumber < 4 && (
              <div className={`w-20 h-1 mx-2 ${stepNumber < step ? "bg-green-500" : "bg-gray-200"}`} />
            )}
          </div>
        ))}
      </div>

      <Card className="border-[#2d3748]">
        <CardHeader>
          <CardTitle className="text-[#2d3748] flex items-center gap-2">
            <FileText className="h-5 w-5 text-[#d69e2e]" />
            KYC Verification - Step {step} of 4
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Step 1: Personal Information */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#2d3748]">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    className="border-gray-300 focus:border-[#d69e2e]"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    className="border-gray-300 focus:border-[#d69e2e]"
                  />
                </div>
                <div>
                  <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                    className="border-gray-300 focus:border-[#d69e2e]"
                  />
                </div>
                <div>
                  <Label htmlFor="nationality">Nationality *</Label>
                  <Select onValueChange={(value) => handleInputChange("nationality", value)}>
                    <SelectTrigger className="border-gray-300 focus:border-[#d69e2e]">
                      <SelectValue placeholder="Select nationality" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country} value={country}>
                          {country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="residenceCountry">Country of Residence *</Label>
                  <Select onValueChange={(value) => handleInputChange("residenceCountry", value)}>
                    <SelectTrigger className="border-gray-300 focus:border-[#d69e2e]">
                      <SelectValue placeholder="Select country of residence" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country} value={country}>
                          {country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Address & Contact */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#2d3748]">Address & Contact Information</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="street">Street Address *</Label>
                  <Input
                    id="street"
                    value={formData.address.street}
                    onChange={(e) => handleInputChange("address.street", e.target.value)}
                    className="border-gray-300 focus:border-[#d69e2e]"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={formData.address.city}
                      onChange={(e) => handleInputChange("address.city", e.target.value)}
                      className="border-gray-300 focus:border-[#d69e2e]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State/Province</Label>
                    <Input
                      id="state"
                      value={formData.address.state}
                      onChange={(e) => handleInputChange("address.state", e.target.value)}
                      className="border-gray-300 focus:border-[#d69e2e]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="postalCode">Postal Code</Label>
                    <Input
                      id="postalCode"
                      value={formData.address.postalCode}
                      onChange={(e) => handleInputChange("address.postalCode", e.target.value)}
                      className="border-gray-300 focus:border-[#d69e2e]"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="addressCountry">Country *</Label>
                  <Select onValueChange={(value) => handleInputChange("address.country", value)}>
                    <SelectTrigger className="border-gray-300 focus:border-[#d69e2e]">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country} value={country}>
                          {country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="border-gray-300 focus:border-[#d69e2e]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className="border-gray-300 focus:border-[#d69e2e]"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Document Upload */}
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#2d3748]">Document Upload</h3>
              <p className="text-gray-600">Please upload the required documents for verification.</p>

              <div className="space-y-4">
                {documentTypes.map((docType) => {
                  const uploadedDoc = formData.documents.find((doc) => doc.type === docType.value)

                  return (
                    <div key={docType.value} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{docType.label}</span>
                          {docType.required && <Badge className="bg-red-100 text-red-800 text-xs">Required</Badge>}
                        </div>
                        {uploadedDoc && (
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Uploaded
                          </Badge>
                        )}
                      </div>

                      {uploadedDoc ? (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <FileText className="h-4 w-4" />
                          <span>{uploadedDoc.fileName}</span>
                          <Badge className="bg-yellow-100 text-yellow-800">
                            <Clock className="h-3 w-3 mr-1" />
                            Pending Review
                          </Badge>
                        </div>
                      ) : (
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                          <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-600 mb-2">Click to upload or drag and drop</p>
                          <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (file) {
                                handleFileUpload(docType.value, file)
                              }
                            }}
                            className="hidden"
                            id={`upload-${docType.value}`}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => document.getElementById(`upload-${docType.value}`)?.click()}
                            className="border-[#2d3748] text-[#2d3748] hover:bg-gray-50"
                          >
                            Choose File
                          </Button>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Step 4: Agreements */}
          {step === 4 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#2d3748]">Terms and Agreements</h3>
              <p className="text-gray-600">
                Please review and accept the following agreements to complete your verification.
              </p>

              <div className="space-y-4">
                {[
                  { key: "termsOfService", label: "Terms of Service", required: true },
                  { key: "privacyPolicy", label: "Privacy Policy", required: true },
                  { key: "amlPolicy", label: "Anti-Money Laundering Policy", required: true },
                  { key: "dataProcessing", label: "Data Processing Agreement", required: true },
                ].map((agreement) => (
                  <div key={agreement.key} className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg">
                    <Checkbox
                      id={agreement.key}
                      checked={formData.agreements[agreement.key as keyof typeof formData.agreements]}
                      onCheckedChange={(checked) => handleInputChange(`agreements.${agreement.key}`, checked)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <Label htmlFor={agreement.key} className="text-sm font-medium cursor-pointer">
                        I agree to the {agreement.label}
                        {agreement.required && <span className="text-red-500 ml-1">*</span>}
                      </Label>
                      <p className="text-xs text-gray-500 mt-1">
                        By checking this box, you acknowledge that you have read and agree to our{" "}
                        {agreement.label.toLowerCase()}.
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6">
            <Button
              onClick={() => setStep(step - 1)}
              disabled={step === 1}
              variant="outline"
              className="border-[#2d3748] text-[#2d3748] hover:bg-gray-50"
            >
              Previous
            </Button>

            {step < 4 ? (
              <Button
                onClick={() => setStep(step + 1)}
                disabled={!isStepValid(step)}
                className="bg-[#d69e2e] hover:bg-[#b7791f] text-white"
              >
                Next
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!isStepValid(step) || loading}
                className="bg-[#d69e2e] hover:bg-[#b7791f] text-white"
              >
                {loading ? "Submitting..." : "Submit for Review"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
