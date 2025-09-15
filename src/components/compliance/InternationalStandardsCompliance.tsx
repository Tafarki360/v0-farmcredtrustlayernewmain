"use client"

import { Calendar } from "@/components/ui/calendar"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "sonner"
import { useSecurityAudit } from "@/hooks/useSecurityAudit"
import {
  Shield,
  CheckCircle,
  AlertTriangle,
  FileText,
  Globe,
  Users,
  Building2,
  Eye,
  Download,
  RefreshCw,
  Clock,
  Target,
  BarChart3,
} from "lucide-react"

interface ComplianceStandard {
  id: string
  name: string
  category: "financial" | "cooperative" | "general"
  description: string
  requirements: string[]
  complianceLevel: number
  status: "compliant" | "partial" | "non_compliant" | "pending"
  lastAudit: string
  nextAudit: string
  certificationBody: string
  documents: string[]
}

interface ComplianceProps {
  userType: "cooperative" | "lender"
  organizationId: string
  organizationName: string
}

export const InternationalStandardsCompliance: React.FC<ComplianceProps> = ({
  userType,
  organizationId,
  organizationName,
}) => {
  const { logSecurityEvent } = useSecurityAudit()
  const [loading, setLoading] = useState(false)
  const [selectedStandard, setSelectedStandard] = useState<ComplianceStandard | null>(null)
  const [complianceData, setComplianceData] = useState<ComplianceStandard[]>([])

  useEffect(() => {
    loadComplianceData()
  }, [userType, organizationId])

  const loadComplianceData = async () => {
    setLoading(true)
    try {
      // Mock compliance data based on user type
      const standards: ComplianceStandard[] =
        userType === "lender"
          ? [
              {
                id: "basel-iii",
                name: "Basel III Capital Requirements",
                category: "financial",
                description:
                  "International regulatory framework for banks addressing capital adequacy, stress testing, and market liquidity risk",
                requirements: [
                  "Minimum Common Equity Tier 1 (CET1) ratio of 4.5%",
                  "Minimum Tier 1 capital ratio of 6%",
                  "Minimum total capital ratio of 8%",
                  "Capital conservation buffer of 2.5%",
                  "Liquidity Coverage Ratio (LCR) of 100%",
                  "Net Stable Funding Ratio (NSFR) of 100%",
                ],
                complianceLevel: 92,
                status: "compliant",
                lastAudit: "2024-01-15",
                nextAudit: "2024-07-15",
                certificationBody: "Central Bank of Nigeria (CBN)",
                documents: ["Capital Adequacy Report", "Stress Test Results", "Liquidity Risk Assessment"],
              },
              {
                id: "ifrs-9",
                name: "IFRS 9 Financial Instruments",
                category: "financial",
                description:
                  "International accounting standard for financial instruments classification, measurement, and impairment",
                requirements: [
                  "Expected Credit Loss (ECL) model implementation",
                  "Financial asset classification and measurement",
                  "Hedge accounting requirements",
                  "Impairment methodology documentation",
                  "Forward-looking information integration",
                ],
                complianceLevel: 88,
                status: "compliant",
                lastAudit: "2024-02-01",
                nextAudit: "2024-08-01",
                certificationBody: "Financial Reporting Council of Nigeria",
                documents: ["IFRS 9 Implementation Guide", "ECL Model Documentation", "Audit Report"],
              },
              {
                id: "aml-cft",
                name: "Anti-Money Laundering & Counter-Terrorism Financing",
                category: "financial",
                description: "International standards for preventing money laundering and terrorism financing",
                requirements: [
                  "Customer Due Diligence (CDD) procedures",
                  "Enhanced Due Diligence (EDD) for high-risk customers",
                  "Suspicious Transaction Reporting (STR)",
                  "Record keeping and monitoring systems",
                  "Staff training and awareness programs",
                  "Risk assessment and management framework",
                ],
                complianceLevel: 95,
                status: "compliant",
                lastAudit: "2024-03-10",
                nextAudit: "2024-09-10",
                certificationBody: "Nigerian Financial Intelligence Unit (NFIU)",
                documents: ["AML Policy Manual", "Training Records", "STR Reports"],
              },
              {
                id: "iso-27001",
                name: "ISO 27001 Information Security",
                category: "general",
                description: "International standard for information security management systems",
                requirements: [
                  "Information Security Management System (ISMS)",
                  "Risk assessment and treatment",
                  "Security controls implementation",
                  "Incident management procedures",
                  "Business continuity planning",
                  "Regular security audits and reviews",
                ],
                complianceLevel: 85,
                status: "partial",
                lastAudit: "2024-01-20",
                nextAudit: "2024-07-20",
                certificationBody: "International Organization for Standardization",
                documents: ["ISMS Documentation", "Risk Register", "Security Audit Report"],
              },
            ]
          : [
              {
                id: "ica-principles",
                name: "ICA Cooperative Principles",
                category: "cooperative",
                description: "International Cooperative Alliance principles for cooperative identity and values",
                requirements: [
                  "Voluntary and Open Membership",
                  "Democratic Member Control",
                  "Member Economic Participation",
                  "Autonomy and Independence",
                  "Education, Training and Information",
                  "Cooperation among Cooperatives",
                  "Concern for Community",
                ],
                complianceLevel: 94,
                status: "compliant",
                lastAudit: "2024-02-15",
                nextAudit: "2024-08-15",
                certificationBody: "International Cooperative Alliance",
                documents: ["Cooperative Constitution", "Member Handbook", "Annual Report"],
              },
              {
                id: "iso-26000",
                name: "ISO 26000 Social Responsibility",
                category: "cooperative",
                description: "International standard providing guidance on social responsibility",
                requirements: [
                  "Organizational governance",
                  "Human rights protection",
                  "Labour practices compliance",
                  "Environmental responsibility",
                  "Fair operating practices",
                  "Consumer issues management",
                  "Community involvement and development",
                ],
                complianceLevel: 87,
                status: "compliant",
                lastAudit: "2024-01-30",
                nextAudit: "2024-07-30",
                certificationBody: "International Organization for Standardization",
                documents: ["Social Responsibility Policy", "Impact Assessment", "Community Programs Report"],
              },
              {
                id: "fair-trade",
                name: "Fair Trade Standards",
                category: "cooperative",
                description: "International fair trade standards for agricultural cooperatives",
                requirements: [
                  "Democratic organization and participation",
                  "Economic development and empowerment",
                  "Social development programs",
                  "Environmental protection measures",
                  "Premium utilization transparency",
                  "Non-discrimination policies",
                ],
                complianceLevel: 91,
                status: "compliant",
                lastAudit: "2024-03-01",
                nextAudit: "2024-09-01",
                certificationBody: "Fairtrade International",
                documents: ["Fair Trade Certificate", "Premium Usage Report", "Social Audit Report"],
              },
              {
                id: "global-gap",
                name: "GLOBALG.A.P. Certification",
                category: "cooperative",
                description: "Global standard for good agricultural practices",
                requirements: [
                  "Food safety management",
                  "Environmental protection",
                  "Worker health and safety",
                  "Animal welfare standards",
                  "Traceability systems",
                  "Quality management systems",
                ],
                complianceLevel: 78,
                status: "partial",
                lastAudit: "2024-02-20",
                nextAudit: "2024-08-20",
                certificationBody: "GLOBALG.A.P. c/o FoodPLUS GmbH",
                documents: ["GAP Certificate", "Farm Inspection Report", "Corrective Action Plan"],
              },
            ]

      setComplianceData(standards)

      logSecurityEvent({
        action: "COMPLIANCE_DATA_LOADED",
        resource: "COMPLIANCE_SYSTEM",
        success: true,
        metadata: { userType, organizationId, standardsCount: standards.length },
      })
    } catch (error) {
      console.error("Error loading compliance data:", error)
      toast.error("Failed to load compliance data")
      logSecurityEvent({
        action: "COMPLIANCE_DATA_LOADED",
        resource: "COMPLIANCE_SYSTEM",
        success: false,
        errorMessage: error instanceof Error ? error.message : "Unknown error",
      })
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "compliant":
        return "bg-green-100 text-green-800 border-green-200"
      case "partial":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "non_compliant":
        return "bg-red-100 text-red-800 border-red-200"
      case "pending":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "compliant":
        return <CheckCircle className="text-green-600" size={16} />
      case "partial":
        return <AlertTriangle className="text-yellow-600" size={16} />
      case "non_compliant":
        return <AlertTriangle className="text-red-600" size={16} />
      case "pending":
        return <Clock className="text-blue-600" size={16} />
      default:
        return <Clock className="text-gray-600" size={16} />
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "financial":
        return <Building2 className="text-blue-600" size={20} />
      case "cooperative":
        return <Users className="text-green-600" size={20} />
      case "general":
        return <Globe className="text-purple-600" size={20} />
      default:
        return <Shield className="text-gray-600" size={20} />
    }
  }

  const handleAuditRefresh = async (standardId: string) => {
    setLoading(true)
    try {
      // Mock audit refresh
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setComplianceData((prev) =>
        prev.map((standard) =>
          standard.id === standardId ? { ...standard, lastAudit: new Date().toISOString().split("T")[0] } : standard,
        ),
      )

      toast.success("Compliance audit refreshed successfully")
      logSecurityEvent({
        action: "COMPLIANCE_AUDIT_REFRESH",
        resource: "COMPLIANCE_SYSTEM",
        success: true,
        metadata: { standardId, organizationId },
      })
    } catch (error) {
      toast.error("Failed to refresh audit")
      logSecurityEvent({
        action: "COMPLIANCE_AUDIT_REFRESH",
        resource: "COMPLIANCE_SYSTEM",
        success: false,
        errorMessage: error instanceof Error ? error.message : "Unknown error",
      })
    } finally {
      setLoading(false)
    }
  }

  const overallComplianceScore = Math.round(
    complianceData.reduce((sum, standard) => sum + standard.complianceLevel, 0) / complianceData.length,
  )

  const compliantCount = complianceData.filter((s) => s.status === "compliant").length
  const partialCount = complianceData.filter((s) => s.status === "partial").length
  const nonCompliantCount = complianceData.filter((s) => s.status === "non_compliant").length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">International Standards Compliance</h2>
          <p className="text-muted-foreground">
            {userType === "lender" ? "Financial Institution" : "Cooperative"} Regulatory Compliance Dashboard
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download size={16} className="mr-2" />
            Export Report
          </Button>
          <Button variant="outline" size="sm" onClick={() => loadComplianceData()} disabled={loading}>
            <RefreshCw size={16} className={`mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Target className="text-blue-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Overall Score</p>
              <p className="text-2xl font-bold">{overallComplianceScore}%</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-2 rounded-lg">
              <CheckCircle className="text-green-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Compliant</p>
              <p className="text-2xl font-bold">{compliantCount}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="bg-yellow-100 p-2 rounded-lg">
              <AlertTriangle className="text-yellow-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Partial</p>
              <p className="text-2xl font-bold">{partialCount}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="bg-red-100 p-2 rounded-lg">
              <AlertTriangle className="text-red-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Non-Compliant</p>
              <p className="text-2xl font-bold">{nonCompliantCount}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Compliance Standards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {complianceData.map((standard) => (
          <Card key={standard.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                {getCategoryIcon(standard.category)}
                <div>
                  <h3 className="font-semibold">{standard.name}</h3>
                  <p className="text-sm text-muted-foreground">{standard.certificationBody}</p>
                </div>
              </div>
              <Badge className={getStatusColor(standard.status)}>
                <div className="flex items-center gap-1">
                  {getStatusIcon(standard.status)}
                  {standard.status.replace("_", " ")}
                </div>
              </Badge>
            </div>

            <p className="text-sm text-muted-foreground mb-4">{standard.description}</p>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Compliance Level</span>
                  <span className="text-sm font-bold">{standard.complianceLevel}%</span>
                </div>
                <Progress value={standard.complianceLevel} className="h-2" />
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Last Audit:</span>
                  <p className="font-medium">{new Date(standard.lastAudit).toLocaleDateString()}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Next Audit:</span>
                  <p className="font-medium">{new Date(standard.nextAudit).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" onClick={() => setSelectedStandard(standard)}>
                      <Eye size={14} className="mr-1" />
                      Details
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        {getCategoryIcon(standard.category)}
                        {standard.name}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Requirements</h4>
                        <ul className="space-y-1">
                          {standard.requirements.map((req, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm">
                              <CheckCircle className="text-green-500 mt-0.5 flex-shrink-0" size={14} />
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Documentation</h4>
                        <div className="space-y-2">
                          {standard.documents.map((doc, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm">
                              <FileText size={14} className="text-blue-500" />
                              <span>{doc}</span>
                              <Button variant="ghost" size="sm">
                                <Download size={12} />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <Button variant="outline" size="sm" onClick={() => handleAuditRefresh(standard.id)} disabled={loading}>
                  <RefreshCw size={14} className={`mr-1 ${loading ? "animate-spin" : ""}`} />
                  Audit
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Compliance Timeline */}
      <Card className="p-6">
        <CardHeader className="px-0 pt-0">
          <CardTitle className="flex items-center gap-2">
            <BarChart3 size={20} />
            Upcoming Compliance Activities
          </CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          <div className="space-y-4">
            {complianceData
              .sort((a, b) => new Date(a.nextAudit).getTime() - new Date(b.nextAudit).getTime())
              .slice(0, 3)
              .map((standard) => (
                <div key={standard.id} className="flex items-center gap-4 p-3 border rounded-lg">
                  <div className="bg-blue-100 p-2 rounded">
                    <Calendar className="text-blue-600" size={16} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{standard.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Next audit: {new Date(standard.nextAudit).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant="outline">
                    {Math.ceil((new Date(standard.nextAudit).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}{" "}
                    days
                  </Badge>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
