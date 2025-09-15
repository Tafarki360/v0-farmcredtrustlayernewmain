"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "sonner"
import {
  Users,
  Plus,
  Search,
  Download,
  Eye,
  Edit,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  CheckCircle,
  AlertTriangle,
  Loader2,
  QrCode,
} from "lucide-react"

interface Member {
  id: string
  membershipId: string
  name: string
  email: string
  phone: string
  location: string
  farmSize: string
  cropType: string
  joinDate: string
  creditScore: number
  status: "active" | "pending" | "suspended" | "inactive"
  verificationStatus: {
    nin: boolean
    bvn: boolean
    farmLocation: boolean
  }
}

interface MemberManagementProps {
  cooperativeId: string
  cooperativeName: string
}

export const MemberManagement: React.FC<MemberManagementProps> = ({ cooperativeId, cooperativeName }) => {
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [showAddMemberDialog, setShowAddMemberDialog] = useState(false)
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)

  const [newMemberData, setNewMemberData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    farmSize: "",
    cropType: "",
  })

  useEffect(() => {
    loadMembers()
  }, [cooperativeId])

  const loadMembers = async () => {
    setLoading(true)
    try {
      // Mock data for demonstration - replace with actual API call
      const mockMembers: Member[] = [
        {
          id: "M001",
          membershipId: `${cooperativeId}-M0001`,
          name: "Musa Ibrahim",
          email: "musa.ibrahim@email.com",
          phone: "+234 803 123 4567",
          location: "Funtua, Katsina",
          farmSize: "2.5 ha",
          cropType: "Maize",
          joinDate: "2024-01-15",
          creditScore: 750,
          status: "active",
          verificationStatus: {
            nin: true,
            bvn: true,
            farmLocation: true,
          },
        },
        {
          id: "M002",
          membershipId: `${cooperativeId}-M0002`,
          name: "Fatima Sani",
          email: "fatima.sani@email.com",
          phone: "+234 802 987 6543",
          location: "Zaria, Kaduna",
          farmSize: "1.8 ha",
          cropType: "Rice",
          joinDate: "2024-02-03",
          creditScore: 680,
          status: "pending",
          verificationStatus: {
            nin: true,
            bvn: false,
            farmLocation: false,
          },
        },
        {
          id: "M003",
          membershipId: `${cooperativeId}-M0003`,
          name: "Ahmad Usman",
          email: "ahmad.usman@email.com",
          phone: "+234 805 456 7890",
          location: "Kano, Kano",
          farmSize: "3.2 ha",
          cropType: "Millet",
          joinDate: "2024-01-28",
          creditScore: 720,
          status: "active",
          verificationStatus: {
            nin: true,
            bvn: true,
            farmLocation: true,
          },
        },
      ]
      setMembers(mockMembers)
    } catch (error) {
      console.error("Error loading members:", error)
      toast.error("Failed to load members")
    } finally {
      setLoading(false)
    }
  }

  const handleAddMember = async () => {
    if (!newMemberData.name || !newMemberData.email || !newMemberData.phone) {
      toast.error("Please fill in all required fields")
      return
    }

    setLoading(true)
    try {
      // Generate membership ID
      const membershipId = `${cooperativeId}-M${String(members.length + 1).padStart(4, "0")}`

      const newMember: Member = {
        id: `M${String(members.length + 1).padStart(3, "0")}`,
        membershipId,
        name: newMemberData.name,
        email: newMemberData.email,
        phone: newMemberData.phone,
        location: newMemberData.location,
        farmSize: newMemberData.farmSize,
        cropType: newMemberData.cropType,
        joinDate: new Date().toISOString().split("T")[0],
        creditScore: 0,
        status: "pending",
        verificationStatus: {
          nin: false,
          bvn: false,
          farmLocation: false,
        },
      }

      setMembers((prev) => [...prev, newMember])
      setNewMemberData({
        name: "",
        email: "",
        phone: "",
        location: "",
        farmSize: "",
        cropType: "",
      })
      setShowAddMemberDialog(false)

      toast.success(`Member added successfully! Membership ID: ${membershipId}`)
    } catch (error) {
      console.error("Error adding member:", error)
      toast.error("Failed to add member")
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "suspended":
        return "bg-red-100 text-red-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getVerificationIcon = (verified: boolean) => {
    return verified ? (
      <CheckCircle className="text-green-500" size={16} />
    ) : (
      <AlertTriangle className="text-yellow-500" size={16} />
    )
  }

  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.membershipId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || member.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const generateMemberQR = (member: Member) => {
    const qrData = {
      membershipId: member.membershipId,
      cooperativeId,
      cooperativeName,
      memberName: member.name,
      status: member.status,
      joinDate: member.joinDate,
    }

    // In a real implementation, you would generate a QR code here
    toast.success(`QR Code generated for ${member.name}`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Member Management</h2>
          <p className="text-muted-foreground">Manage cooperative members and their unique IDs</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download size={16} className="mr-2" />
            Export Members
          </Button>
          <Dialog open={showAddMemberDialog} onOpenChange={setShowAddMemberDialog}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus size={16} className="mr-2" />
                Add Member
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Member</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={newMemberData.name}
                    onChange={(e) => setNewMemberData((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newMemberData.email}
                    onChange={(e) => setNewMemberData((prev) => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter email address"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    value={newMemberData.phone}
                    onChange={(e) => setNewMemberData((prev) => ({ ...prev, phone: e.target.value }))}
                    placeholder="+234 XXX XXX XXXX"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Farm Location</Label>
                  <Input
                    id="location"
                    value={newMemberData.location}
                    onChange={(e) => setNewMemberData((prev) => ({ ...prev, location: e.target.value }))}
                    placeholder="City, State"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="farmSize">Farm Size</Label>
                    <Input
                      id="farmSize"
                      value={newMemberData.farmSize}
                      onChange={(e) => setNewMemberData((prev) => ({ ...prev, farmSize: e.target.value }))}
                      placeholder="e.g., 2.5 ha"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cropType">Crop Type</Label>
                    <Input
                      id="cropType"
                      value={newMemberData.cropType}
                      onChange={(e) => setNewMemberData((prev) => ({ ...prev, cropType: e.target.value }))}
                      placeholder="e.g., Maize"
                    />
                  </div>
                </div>
                <Button onClick={handleAddMember} disabled={loading} className="w-full">
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding Member...
                    </>
                  ) : (
                    "Add Member"
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
          <Input
            placeholder="Search members by name, email, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-input rounded-md bg-background"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="suspended">Suspended</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Users className="text-blue-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Members</p>
              <p className="text-xl font-bold">{members.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-2 rounded-lg">
              <CheckCircle className="text-green-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Members</p>
              <p className="text-xl font-bold">{members.filter((m) => m.status === "active").length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="bg-yellow-100 p-2 rounded-lg">
              <AlertTriangle className="text-yellow-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pending Verification</p>
              <p className="text-xl font-bold">{members.filter((m) => m.status === "pending").length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="bg-purple-100 p-2 rounded-lg">
              <CreditCard className="text-purple-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg Credit Score</p>
              <p className="text-xl font-bold">
                {Math.round(members.reduce((sum, m) => sum + m.creditScore, 0) / members.length) || 0}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Members Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users size={20} />
            Members List ({filteredMembers.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary">
                <tr>
                  <th className="text-left p-4">Member Details</th>
                  <th className="text-left p-4">Contact</th>
                  <th className="text-left p-4">Farm Info</th>
                  <th className="text-left p-4">Verification</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map((member) => (
                  <tr key={member.id} className="border-b border-border hover:bg-secondary/50">
                    <td className="p-4">
                      <div>
                        <div className="font-medium">{member.name}</div>
                        <div className="text-sm text-muted-foreground font-mono">{member.membershipId}</div>
                        <div className="text-xs text-muted-foreground">
                          Joined: {new Date(member.joinDate).toLocaleDateString()}
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail size={14} />
                          {member.email}
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone size={14} />
                          {member.phone}
                        </div>
                        {member.location && (
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin size={14} />
                            {member.location}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        {member.farmSize && <div className="text-sm">Size: {member.farmSize}</div>}
                        {member.cropType && <div className="text-sm">Crop: {member.cropType}</div>}
                        {member.creditScore > 0 && <div className="text-sm">Score: {member.creditScore}</div>}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          {getVerificationIcon(member.verificationStatus.nin)}
                          <span className="text-xs">NIN</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {getVerificationIcon(member.verificationStatus.bvn)}
                          <span className="text-xs">BVN</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {getVerificationIcon(member.verificationStatus.farmLocation)}
                          <span className="text-xs">Farm</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge className={getStatusBadgeColor(member.status)}>{member.status}</Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedMember(member)}
                          title="View Details"
                        >
                          <Eye size={14} />
                        </Button>
                        <Button variant="ghost" size="sm" title="Edit Member">
                          <Edit size={14} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => generateMemberQR(member)}
                          title="Generate QR Code"
                        >
                          <QrCode size={14} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredMembers.length === 0 && (
            <div className="text-center py-8">
              <Users className="mx-auto text-muted-foreground mb-2" size={48} />
              <p className="text-muted-foreground">No members found</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Member Details Modal */}
      {selectedMember && (
        <Dialog open={!!selectedMember} onOpenChange={() => setSelectedMember(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Member Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Personal Information</h3>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-muted-foreground">Name:</span>
                      <p className="font-medium">{selectedMember.name}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Membership ID:</span>
                      <p className="font-mono text-sm">{selectedMember.membershipId}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Email:</span>
                      <p>{selectedMember.email}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Phone:</span>
                      <p>{selectedMember.phone}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Farm Information</h3>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-muted-foreground">Location:</span>
                      <p>{selectedMember.location || "Not provided"}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Farm Size:</span>
                      <p>{selectedMember.farmSize || "Not provided"}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Crop Type:</span>
                      <p>{selectedMember.cropType || "Not provided"}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Credit Score:</span>
                      <p>{selectedMember.creditScore || "Not assessed"}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Verification Status</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    {getVerificationIcon(selectedMember.verificationStatus.nin)}
                    <span>NIN Verification</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getVerificationIcon(selectedMember.verificationStatus.bvn)}
                    <span>BVN Verification</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getVerificationIcon(selectedMember.verificationStatus.farmLocation)}
                    <span>Farm Location</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={() => generateMemberQR(selectedMember)}>
                  <QrCode size={16} className="mr-2" />
                  Generate QR Code
                </Button>
                <Button variant="outline">
                  <Edit size={16} className="mr-2" />
                  Edit Member
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
