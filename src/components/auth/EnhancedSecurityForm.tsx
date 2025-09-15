"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { verificationAPI } from "@/services/verificationAPI"
import { cooperativeIDService } from "@/services/cooperativeIDService"
import { toast } from "sonner"
import { Shield, CheckCircle, AlertTriangle, Loader2, Eye, EyeOff } from "lucide-react"

interface EnhancedSecurityFormProps {
  userType: "farmer" | "cooperative" | "bank"
  onVerificationComplete: (verificationData: any) => void
  userId: string
}

export const EnhancedSecurityForm: React.FC<EnhancedSecurityFormProps> = ({
  userType,
  onVerificationComplete,
  userId,
}) => {
  const [formData, setFormData] = useState({
    // Farmer fields
    nin: "",
    bvn: "",
    // Cooperative fields
    cooperativeName: "",
    cacNumber: "",
    cooperativeRegNumber: "",
    state: "",
    lga: "",
    ward: "",
    // Bank fields
    bankName: "",
    bankCode: "",
    // Common fields
    email: "",
  })

  const [verificationStatus, setVerificationStatus] = useState({
    nin: "pending",
    bvn: "pending",
    cac: "pending",
    cooperative: "pending",
    bank: "pending",
    crossVerify: "pending",
  })

  const [loading, setLoading] = useState(false)
  const [showSensitiveData, setShowSensitiveData] = useState(false)
  const [verificationResults, setVerificationResults] = useState<any>({})

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
        return <CheckCircle className="text-green-500" size={16} />
      case "failed":
        return <AlertTriangle className="text-red-500" size={16} />
      case "loading":
        return <Loader2 className="text-blue-500 animate-spin" size={16} />
      default:
        return <Shield className="text-gray-400" size={16} />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified":
        return "bg-green-100 text-green-800"
      case "failed":
        return "bg-red-100 text-red-800"
      case "loading":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const validateFarmerData = (): boolean => {
    if (!/^\d{11}$/.test(formData.nin)) {
      toast.error("NIN must be exactly 11 digits")
      return false
    }
    if (!/^\d{11}$/.test(formData.bvn)) {
      toast.error("BVN must be exactly 11 digits")
      return false
    }
    return true
  }

  const validateCooperativeData = (): boolean => {
    if (!formData.cooperativeName.trim()) {
      toast.error("Cooperative name is required")
      return false
    }
    if (!/^RC\d{6,8}$/.test(formData.cacNumber)) {
      toast.error("CAC number must follow format RC1234567")
      return false
    }
    if (!/^COOP\/\d{4}\/\d{6}$/.test(formData.cooperativeRegNumber)) {
      toast.error("Cooperative registration number must follow format COOP/2024/123456")
      return false
    }
    if (!formData.state || !formData.lga || !formData.ward) {
      toast.error("State, LGA, and Ward are required")
      return false
    }
    return true
  }

  const validateBankData = (): boolean => {
    if (!formData.bankName.trim()) {
      toast.error("Bank name is required")
      return false
    }
    if (!formData.bankCode.trim()) {
      toast.error("Bank code is required")
      return false
    }
    return true
  }

  const handleFarmerVerification = async () => {
    if (!validateFarmerData()) return

    setLoading(true)

    try {
      // Step 1: Verify NIN
      setVerificationStatus((prev) => ({ ...prev, nin: "loading" }))
      const ninResult = await verificationAPI.verifyNIN(formData.nin, userId)

      if (ninResult.success) {
        setVerificationStatus((prev) => ({ ...prev, nin: "verified" }))
        setVerificationResults((prev) => ({ ...prev, nin: ninResult.data }))
        toast.success("NIN verified successfully")
      } else {
        setVerificationStatus((prev) => ({ ...prev, nin: "failed" }))
        toast.error(`NIN verification failed: ${ninResult.error}`)
        return
      }

      // Step 2: Verify BVN
      setVerificationStatus((prev) => ({ ...prev, bvn: "loading" }))
      const bvnResult = await verificationAPI.verifyBVN(formData.bvn, userId)

      if (bvnResult.success) {
        setVerificationStatus((prev) => ({ ...prev, bvn: "verified" }))
        setVerificationResults((prev) => ({ ...prev, bvn: bvnResult.data }))
        toast.success("BVN verified successfully")
      } else {
        setVerificationStatus((prev) => ({ ...prev, bvn: "failed" }))
        toast.error(`BVN verification failed: ${bvnResult.error}`)
        return
      }

      // Step 3: Cross-verify NIN and BVN
      setVerificationStatus((prev) => ({ ...prev, crossVerify: "loading" }))
      const crossVerifyResult = await verificationAPI.crossVerifyNINBVN(formData.nin, formData.bvn, userId)

      if (crossVerifyResult.success && crossVerifyResult.match) {
        setVerificationStatus((prev) => ({ ...prev, crossVerify: "verified" }))
        toast.success("NIN and BVN cross-verification successful")

        onVerificationComplete({
          userType: "farmer",
          nin: formData.nin,
          bvn: formData.bvn,
          verificationResults,
          allVerified: true,
        })
      } else {
        setVerificationStatus((prev) => ({ ...prev, crossVerify: "failed" }))
        toast.error("NIN and BVN details do not match")
      }
    } catch (error) {
      console.error("Farmer verification error:", error)
      toast.error("Verification process failed")
    } finally {
      setLoading(false)
    }
  }

  const handleCooperativeVerification = async () => {
    if (!validateCooperativeData()) return

    setLoading(true)

    try {
      // Step 1: Verify CAC
      setVerificationStatus((prev) => ({ ...prev, cac: "loading" }))
      const cacResult = await verificationAPI.verifyCAC(formData.cacNumber, userId)

      if (cacResult.success) {
        setVerificationStatus((prev) => ({ ...prev, cac: "verified" }))
        setVerificationResults((prev) => ({ ...prev, cac: cacResult.data }))
        toast.success("CAC verified successfully")
      } else {
        setVerificationStatus((prev) => ({ ...prev, cac: "failed" }))
        toast.error(`CAC verification failed: ${cacResult.error}`)
        return
      }

      // Step 2: Verify Cooperative Registration
      setVerificationStatus((prev) => ({ ...prev, cooperative: "loading" }))
      const coopResult = await verificationAPI.verifyCooperative(
        formData.cooperativeRegNumber,
        formData.cooperativeName,
        userId,
      )

      if (coopResult.success) {
        setVerificationStatus((prev) => ({ ...prev, cooperative: "verified" }))
        setVerificationResults((prev) => ({ ...prev, cooperative: coopResult.data }))
        toast.success("Cooperative registration verified successfully")

        // Step 3: Register cooperative and generate ID
        const cooperativeRegistration = await cooperativeIDService.registerCooperative({
          cooperativeName: formData.cooperativeName,
          state: formData.state,
          lga: formData.lga,
          ward: formData.ward,
          registrationNumber: formData.cooperativeRegNumber,
          cacNumber: formData.cacNumber,
          establishedYear: new Date().getFullYear(),
          executiveCommittee: {
            chairman: "To be updated",
            secretary: "To be updated",
            treasurer: "To be updated",
          },
          address: `${formData.ward}, ${formData.lga}, ${formData.state}`,
          userId,
        })

        if (cooperativeRegistration.success) {
          toast.success(`Cooperative ID generated: ${cooperativeRegistration.cooperativeId}`)

          onVerificationComplete({
            userType: "cooperative",
            cooperativeId: cooperativeRegistration.cooperativeId,
            cooperativeName: formData.cooperativeName,
            cacNumber: formData.cacNumber,
            cooperativeRegNumber: formData.cooperativeRegNumber,
            verificationResults,
            allVerified: true,
          })
        }
      } else {
        setVerificationStatus((prev) => ({ ...prev, cooperative: "failed" }))
        toast.error(`Cooperative verification failed: ${coopResult.error}`)
      }
    } catch (error) {
      console.error("Cooperative verification error:", error)
      toast.error("Verification process failed")
    } finally {
      setLoading(false)
    }
  }

  const handleBankVerification = async () => {
    if (!validateBankData()) return

    setLoading(true)

    try {
      setVerificationStatus((prev) => ({ ...prev, bank: "loading" }))
      const bankResult = await verificationAPI.verifyBank(formData.bankName, formData.bankCode, userId)

      if (bankResult.success) {
        setVerificationStatus((prev) => ({ ...prev, bank: "verified" }))
        setVerificationResults((prev) => ({ ...prev, bank: bankResult.data }))
        toast.success("Bank details verified successfully")

        onVerificationComplete({
          userType: "bank",
          bankName: formData.bankName,
          bankCode: formData.bankCode,
          verificationResults,
          allVerified: true,
        })
      } else {
        setVerificationStatus((prev) => ({ ...prev, bank: "failed" }))
        toast.error(`Bank verification failed: ${bankResult.error}`)
      }
    } catch (error) {
      console.error("Bank verification error:", error)
      toast.error("Verification process failed")
    } finally {
      setLoading(false)
    }
  }

  const handleVerification = () => {
    switch (userType) {
      case "farmer":
        handleFarmerVerification()
        break
      case "cooperative":
        handleCooperativeVerification()
        break
      case "bank":
        handleBankVerification()
        break
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="text-primary" size={24} />
          Enhanced Security Verification
        </CardTitle>
        <p className="text-sm text-muted-foreground">Complete identity verification to access your {userType} portal</p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Verification Status Display */}
        <div className="grid grid-cols-2 gap-4">
          {userType === "farmer" && (
            <>
              <div className="flex items-center gap-2">
                {getStatusIcon(verificationStatus.nin)}
                <Badge className={getStatusColor(verificationStatus.nin)}>NIN Verification</Badge>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(verificationStatus.bvn)}
                <Badge className={getStatusColor(verificationStatus.bvn)}>BVN Verification</Badge>
              </div>
              <div className="flex items-center gap-2 col-span-2">
                {getStatusIcon(verificationStatus.crossVerify)}
                <Badge className={getStatusColor(verificationStatus.crossVerify)}>Cross Verification</Badge>
              </div>
            </>
          )}

          {userType === "cooperative" && (
            <>
              <div className="flex items-center gap-2">
                {getStatusIcon(verificationStatus.cac)}
                <Badge className={getStatusColor(verificationStatus.cac)}>CAC Verification</Badge>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(verificationStatus.cooperative)}
                <Badge className={getStatusColor(verificationStatus.cooperative)}>Cooperative Registration</Badge>
              </div>
            </>
          )}

          {userType === "bank" && (
            <div className="flex items-center gap-2 col-span-2">
              {getStatusIcon(verificationStatus.bank)}
              <Badge className={getStatusColor(verificationStatus.bank)}>Bank Verification</Badge>
            </div>
          )}
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          {userType === "farmer" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="nin">National Identification Number (NIN)</Label>
                <div className="relative">
                  <Input
                    id="nin"
                    type={showSensitiveData ? "text" : "password"}
                    value={formData.nin}
                    onChange={(e) => handleInputChange("nin", e.target.value)}
                    placeholder="Enter 11-digit NIN"
                    maxLength={11}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowSensitiveData(!showSensitiveData)}
                  >
                    {showSensitiveData ? <EyeOff size={16} /> : <Eye size={16} />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bvn">Bank Verification Number (BVN)</Label>
                <div className="relative">
                  <Input
                    id="bvn"
                    type={showSensitiveData ? "text" : "password"}
                    value={formData.bvn}
                    onChange={(e) => handleInputChange("bvn", e.target.value)}
                    placeholder="Enter 11-digit BVN"
                    maxLength={11}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowSensitiveData(!showSensitiveData)}
                  >
                    {showSensitiveData ? <EyeOff size={16} /> : <Eye size={16} />}
                  </Button>
                </div>
              </div>
            </>
          )}

          {userType === "cooperative" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="cooperativeName">Cooperative Name</Label>
                <Input
                  id="cooperativeName"
                  value={formData.cooperativeName}
                  onChange={(e) => handleInputChange("cooperativeName", e.target.value)}
                  placeholder="Enter cooperative name"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cacNumber">CAC Registration Number</Label>
                  <Input
                    id="cacNumber"
                    value={formData.cacNumber}
                    onChange={(e) => handleInputChange("cacNumber", e.target.value)}
                    placeholder="RC1234567"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cooperativeRegNumber">Cooperative Registration</Label>
                  <Input
                    id="cooperativeRegNumber"
                    value={formData.cooperativeRegNumber}
                    onChange={(e) => handleInputChange("cooperativeRegNumber", e.target.value)}
                    placeholder="COOP/2024/123456"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => handleInputChange("state", e.target.value)}
                    placeholder="State"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lga">Local Government Area</Label>
                  <Input
                    id="lga"
                    value={formData.lga}
                    onChange={(e) => handleInputChange("lga", e.target.value)}
                    placeholder="LGA"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ward">Ward</Label>
                  <Input
                    id="ward"
                    value={formData.ward}
                    onChange={(e) => handleInputChange("ward", e.target.value)}
                    placeholder="Ward"
                  />
                </div>
              </div>
            </>
          )}

          {userType === "bank" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="bankName">Bank Name</Label>
                <Input
                  id="bankName"
                  value={formData.bankName}
                  onChange={(e) => handleInputChange("bankName", e.target.value)}
                  placeholder="Enter bank name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bankCode">Bank Code</Label>
                <Input
                  id="bankCode"
                  value={formData.bankCode}
                  onChange={(e) => handleInputChange("bankCode", e.target.value)}
                  placeholder="Enter bank code"
                />
              </div>
            </>
          )}
        </div>

        {/* Security Notice */}
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            All verification data is encrypted and processed through secure government APIs. Your information is
            protected with bank-grade security.
          </AlertDescription>
        </Alert>

        {/* Verification Button */}
        <Button onClick={handleVerification} disabled={loading} className="w-full" size="lg">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Verifying...
            </>
          ) : (
            <>
              <Shield className="mr-2 h-4 w-4" />
              Start Verification Process
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
