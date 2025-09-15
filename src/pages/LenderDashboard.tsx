"use client"

import { Button } from "@/components/ui/button"
import { FarmCredLogo } from "@/components/FarmCredLogo"
import { StatsCard } from "@/components/StatsCard"
import { LogoutButton } from "@/components/common/LogoutButton"
import { InternationalStandardsCompliance } from "@/components/compliance/InternationalStandardsCompliance"
import { useState } from "react"
import { useAuth } from "@/contexts/AuthContext"

import { DollarSign, TrendingUp, Users, Shield, Bell, User } from "lucide-react"

const LenderDashboard = () => {
  const [selectedTab, setSelectedTab] = useState("overview")
  const [selectedRiskFilter, setSelectedRiskFilter] = useState("all")
  const { user } = useAuth()

  const lenderStats = [
    {
      icon: Users,
      title: "Total Applications",
      value: "2,456",
      description: "Loan applications received",
      trend: { value: "12%", isPositive: true },
    },
    {
      icon: DollarSign,
      title: "Portfolio Value",
      value: "₦2.4B",
      description: "Total loans disbursed",
      trend: { value: "18%", isPositive: true },
    },
    {
      icon: TrendingUp,
      title: "Approval Rate",
      value: "68%",
      description: "Applications approved",
      trend: { value: "5%", isPositive: true },
    },
    {
      icon: Shield,
      title: "Repayment Rate",
      value: "94%",
      description: "On-time repayments",
      trend: { value: "2%", isPositive: true },
    },
  ]

  // ... existing code for generateSampleApplications and other functions ...

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-primary/5">
      {/* Header */}
      <div className="bg-background border-b border-border p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <FarmCredLogo size="md" />
            <div className="h-8 w-px bg-border"></div>
            <div>
              <h1 className="text-xl font-semibold">Financial Institution Portal</h1>
              <p className="text-sm text-muted-foreground">Loan Assessment & Management</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-success/10 rounded-full">
              <Shield size={14} className="text-success" />
              <span className="text-xs text-success font-medium">Secure Session</span>
            </div>
            <Button variant="ghost" size="icon">
              <Bell size={20} />
            </Button>
            <LogoutButton variant="ghost" size="icon" showConfirmation={true} customRedirect="/" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <User size={16} className="text-primary-foreground" />
              </div>
              <div className="text-left">
                <div className="text-sm font-medium">First Bank Nigeria</div>
                <div className="text-xs text-muted-foreground">Loan Officer Portal</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 space-y-6">
        {/* Tab Navigation */}
        <div className="flex gap-6">
          {["Overview", "Loan Applications", "Portfolio", "Compliance", "Analytics"].map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab.toLowerCase().replace(/ /g, "-"))}
              className={`pb-2 border-b-2 font-medium transition-colors ${
                selectedTab === tab.toLowerCase().replace(/ /g, "-")
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {selectedTab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {lenderStats.map((stat, index) => (
                <StatsCard key={index} {...stat} />
              ))}
            </div>

            {/* ... existing overview content ... */}
          </div>
        )}

        {selectedTab === "compliance" && (
          <InternationalStandardsCompliance
            userType="lender"
            organizationId="first-bank-nigeria"
            organizationName="First Bank Nigeria"
          />
        )}

        {/* ... existing tabs content ... */}
      </div>
    </div>
  )
}

export default LenderDashboard
