"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "sonner"
import { useAuth } from "@/contexts/AuthContext"
import { useSecurityAudit } from "@/hooks/useSecurityAudit"
import { Save, X, CheckCircle, AlertTriangle, Loader2, Edit, Camera } from "lucide-react"

interface ProfileData {
  id: string
  name: string
  email: string
  phone: string
  location: string
  farmSize?: string
  cropType?: string
  nin?: string
  bvn?: string
  cacNumber?: string
  cooperativeId?: string
  userType: "farmer" | "cooperative" | "lender"
  verificationStatus: {
    nin: boolean
    bvn: boolean
    farmLocation: boolean
    cac?: boolean
  }
  profileImage?: string
}

interface ProfileEditorProps {
  isOpen: boolean
  onClose: () => void
  userType: "farmer" | "cooperative" | "lender"
}

export const ProfileEditor: React.FC<ProfileEditorProps> = ({ isOpen, onClose, userType }) => {
  const { user } = useAuth()
  const { logSecurityEvent } = useSecurityAudit()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [profileData, setProfileData] = useState<ProfileData>({
    id: "",
    name: "",
    email: "",
    phone: "",
    location: "",
    userType,
    verificationStatus: {
      nin: false,
      bvn: false,
      farmLocation: false,
    },
  })

  const [originalData, setOriginalData] = useState<ProfileData | null>(null)
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    if (isOpen) {
      loadProfileData()
    }
  }, [isOpen, user])

  useEffect(() => {
    if (originalData) {
      const changed = JSON.stringify(profileData) !== JSON.stringify(originalData)
      setHasChanges(changed)
    }
  }, [profileData, originalData])

  const loadProfileData = async () => {
    setLoading(true)
    try {
      // Mock data - replace with actual API call
      const mockProfile: ProfileData = {
        id: user?.id || "user-123",
        name:
          userType === "farmer"
            ? "Musa Ibrahim"
            : userType === "cooperative"
              ? "Funtua Farmers Cooperative"
              : "First Bank Nigeria",
        email: user?.email || "user@example.com",
        phone: "+234 803 123 4567",
        location:
          userType === "farmer"
            ? "Funtua, Katsina State"
            : userType === "cooperative"
              ? "Funtua, Katsina State"
              : "Lagos, Nigeria",
        farmSize: userType === "farmer" ? "2.5 hectares" : undefined,
        cropType: userType === "farmer" ? "Maize & Millet" : undefined,
        nin: userType === "farmer" ? "12345678901" : undefined,
        bvn: userType === "farmer" ? "22123456789" : undefined,
        cacNumber: userType === "cooperative" ? "RC-1234567" : undefined,
        cooperativeId: userType === "farmer" ? "KT-FUN-CE-20241215-001" : undefined,
        userType,
        verificationStatus: {
          nin: userType === "farmer",
          bvn: userType === "farmer",
          farmLocation: userType === "farmer",
          cac: userType === "cooperative",
        },
        profileImage: "/professional-headshot.png",
      }

      setProfileData(mockProfile)
      setOriginalData(mockProfile)

      logSecurityEvent({
        action: "PROFILE_VIEW",
        resource: "USER_PROFILE",
        success: true,
        metadata: { userType, profileId: mockProfile.id },
      })
    } catch (error) {
      console.error("Error loading profile:", error)
      toast.error("Failed to load profile data")
      logSecurityEvent({
        action: "PROFILE_VIEW",
        resource: "USER_PROFILE",
        success: false,
        errorMessage: error instanceof Error ? error.message : "Unknown error",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      // Validate required fields
      if (!profileData.name || !profileData.email || !profileData.phone) {
        toast.error("Please fill in all required fields")
        return
      }

      // Mock API call - replace with actual implementation
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setOriginalData({ ...profileData })
      setHasChanges(false)

      toast.success("Profile updated successfully!")

      logSecurityEvent({
        action: "PROFILE_UPDATE",
        resource: "USER_PROFILE",
        success: true,
        metadata: {
          userType,
          profileId: profileData.id,
          changedFields: getChangedFields(),
        },
      })

      onClose()
    } catch (error) {
      console.error("Error saving profile:", error)
      toast.error("Failed to save profile changes")
      logSecurityEvent({
        action: "PROFILE_UPDATE",
        resource: "USER_PROFILE",
        success: false,
        errorMessage: error instanceof Error ? error.message : "Unknown error",
      })
    } finally {
      setSaving(false)
    }
  }

  const getChangedFields = () => {
    if (!originalData) return []
    const changes: string[] = []
    Object.keys(profileData).forEach((key) => {
      if (profileData[key as keyof ProfileData] !== originalData[key as keyof ProfileData]) {
        changes.push(key)
      }
    })
    return changes
  }

  const handleCancel = () => {
    if (hasChanges) {
      if (confirm("You have unsaved changes. Are you sure you want to cancel?")) {
        if (originalData) {
          setProfileData({ ...originalData })
        }
        setHasChanges(false)
        onClose()
      }
    } else {
      onClose()
    }
  }

  const getVerificationIcon = (verified: boolean) => {
    return verified ? (
      <CheckCircle className="text-green-500" size={16} />
    ) : (
      <AlertTriangle className="text-yellow-500" size={16} />
    )
  }

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  if (loading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="animate-spin mr-2" size={24} />
            <span>Loading profile...</span>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit size={20} />
            Edit Profile - {userType.charAt(0).toUpperCase() + userType.slice(1)}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Profile Image Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Profile Photo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img
                    src={profileData.profileImage || "/placeholder.svg"}
                    alt="Profile"
                    className="w-20 h-20 rounded-full object-cover border-2 border-border"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute -bottom-2 -right-2 rounded-full p-2 bg-transparent"
                  >
                    <Camera size={14} />
                  </Button>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Upload a professional photo for your profile</p>
                  <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                    Change Photo
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{userType === "cooperative" ? "Cooperative Name" : "Full Name"} *</Label>
                  <Input
                    id="name"
                    value={profileData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder={userType === "cooperative" ? "Enter cooperative name" : "Enter full name"}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="Enter email address"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    value={profileData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="+234 XXX XXX XXXX"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    value={profileData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    placeholder="City, State"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Farmer-specific fields */}
          {userType === "farmer" && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Farm Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="farmSize">Farm Size</Label>
                    <Input
                      id="farmSize"
                      value={profileData.farmSize || ""}
                      onChange={(e) => handleInputChange("farmSize", e.target.value)}
                      placeholder="e.g., 2.5 hectares"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cropType">Primary Crop Type</Label>
                    <Input
                      id="cropType"
                      value={profileData.cropType || ""}
                      onChange={(e) => handleInputChange("cropType", e.target.value)}
                      placeholder="e.g., Maize, Rice, Millet"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cooperativeId">Cooperative ID</Label>
                    <Input
                      id="cooperativeId"
                      value={profileData.cooperativeId || ""}
                      onChange={(e) => handleInputChange("cooperativeId", e.target.value)}
                      placeholder="Enter cooperative membership ID"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Verification Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Verification Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userType === "farmer" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="nin" className="flex items-center gap-2">
                        NIN (National Identification Number)
                        {getVerificationIcon(profileData.verificationStatus.nin)}
                      </Label>
                      <Input
                        id="nin"
                        value={profileData.nin || ""}
                        onChange={(e) => handleInputChange("nin", e.target.value)}
                        placeholder="Enter 11-digit NIN"
                        maxLength={11}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bvn" className="flex items-center gap-2">
                        BVN (Bank Verification Number)
                        {getVerificationIcon(profileData.verificationStatus.bvn)}
                      </Label>
                      <Input
                        id="bvn"
                        value={profileData.bvn || ""}
                        onChange={(e) => handleInputChange("bvn", e.target.value)}
                        placeholder="Enter 11-digit BVN"
                        maxLength={11}
                      />
                    </div>
                  </>
                )}
                {userType === "cooperative" && (
                  <div className="space-y-2">
                    <Label htmlFor="cacNumber" className="flex items-center gap-2">
                      CAC Registration Number
                      {getVerificationIcon(profileData.verificationStatus.cac || false)}
                    </Label>
                    <Input
                      id="cacNumber"
                      value={profileData.cacNumber || ""}
                      onChange={(e) => handleInputChange("cacNumber", e.target.value)}
                      placeholder="Enter CAC registration number"
                    />
                  </div>
                )}
              </div>

              {/* Verification Status Display */}
              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Verification Status</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {userType === "farmer" && (
                    <>
                      <div className="flex items-center gap-2">
                        {getVerificationIcon(profileData.verificationStatus.nin)}
                        <span className="text-sm">NIN Verified</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {getVerificationIcon(profileData.verificationStatus.bvn)}
                        <span className="text-sm">BVN Verified</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {getVerificationIcon(profileData.verificationStatus.farmLocation)}
                        <span className="text-sm">Farm Location</span>
                      </div>
                    </>
                  )}
                  {userType === "cooperative" && (
                    <div className="flex items-center gap-2">
                      {getVerificationIcon(profileData.verificationStatus.cac || false)}
                      <span className="text-sm">CAC Verified</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center gap-2">
              {hasChanges && (
                <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                  <AlertTriangle size={12} className="mr-1" />
                  Unsaved Changes
                </Badge>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleCancel} disabled={saving}>
                <X size={16} className="mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={saving || !hasChanges}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={16} className="mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
