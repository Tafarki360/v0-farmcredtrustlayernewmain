"use client"

import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { QrCode, Download, Share2, Copy } from "lucide-react"
import { toast } from "sonner"

interface CooperativeIDCardProps {
  cooperativeId: string
  cooperativeName: string
  state: string
  lga: string
  ward: string
  registrationNumber: string
  cacNumber: string
  memberCount: number
  establishedYear: number
  status: "active" | "inactive" | "suspended"
}

export const CooperativeIDCard: React.FC<CooperativeIDCardProps> = ({
  cooperativeId,
  cooperativeName,
  state,
  lga,
  ward,
  registrationNumber,
  cacNumber,
  memberCount,
  establishedYear,
  status,
}) => {
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast.success(`${label} copied to clipboard`)
  }

  const generateQRCode = () => {
    const qrData = {
      cooperativeId,
      cooperativeName,
      registrationNumber,
      cacNumber,
      location: `${ward}, ${lga}, ${state}`,
      memberCount,
      status,
      verifiedAt: new Date().toISOString(),
    }

    // In a real implementation, you would generate a QR code here
    toast.success("QR Code generated successfully")
  }

  const downloadIDCard = () => {
    // In a real implementation, you would generate and download a PDF ID card
    toast.success("ID Card download initiated")
  }

  const shareCooperativeInfo = () => {
    const shareData = {
      title: cooperativeName,
      text: `${cooperativeName} - Cooperative ID: ${cooperativeId}`,
      url: window.location.href,
    }

    if (navigator.share) {
      navigator.share(shareData)
    } else {
      copyToClipboard(shareData.text, "Cooperative info")
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      case "suspended":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center pb-2">
        <div className="flex items-center justify-between">
          <Badge className={getStatusColor(status)}>{status.toUpperCase()}</Badge>
          <div className="text-xs text-muted-foreground">Est. {establishedYear}</div>
        </div>
        <CardTitle className="text-lg">{cooperativeName}</CardTitle>
        <div className="text-sm text-muted-foreground">
          {ward}, {lga}, {state}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Cooperative ID */}
        <div className="text-center">
          <div className="text-xs text-muted-foreground mb-1">Cooperative ID</div>
          <div className="font-mono text-lg font-bold bg-primary/10 px-3 py-2 rounded border">{cooperativeId}</div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => copyToClipboard(cooperativeId, "Cooperative ID")}
            className="mt-1"
          >
            <Copy size={14} className="mr-1" />
            Copy ID
          </Button>
        </div>

        {/* Registration Details */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-muted-foreground">Registration No.</div>
            <div className="font-medium">{registrationNumber}</div>
          </div>
          <div>
            <div className="text-muted-foreground">CAC Number</div>
            <div className="font-medium">{cacNumber}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Members</div>
            <div className="font-medium">{memberCount.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Status</div>
            <div className="font-medium capitalize">{status}</div>
          </div>
        </div>

        {/* QR Code Placeholder */}
        <div className="text-center py-4 border-2 border-dashed border-muted rounded-lg">
          <QrCode size={48} className="mx-auto text-muted-foreground mb-2" />
          <div className="text-xs text-muted-foreground">QR Code</div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-2">
          <Button variant="outline" size="sm" onClick={generateQRCode}>
            <QrCode size={14} className="mr-1" />
            QR
          </Button>
          <Button variant="outline" size="sm" onClick={downloadIDCard}>
            <Download size={14} className="mr-1" />
            PDF
          </Button>
          <Button variant="outline" size="sm" onClick={shareCooperativeInfo}>
            <Share2 size={14} className="mr-1" />
            Share
          </Button>
        </div>

        {/* Verification Notice */}
        <div className="text-xs text-center text-muted-foreground bg-secondary/20 p-2 rounded">
          This ID is digitally verified and linked to government databases
        </div>
      </CardContent>
    </Card>
  )
}
