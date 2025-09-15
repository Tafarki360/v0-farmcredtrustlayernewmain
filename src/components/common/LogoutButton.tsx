"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { useEnhancedLogout } from "@/hooks/useEnhancedLogout"
import { LogOut, Shield, AlertTriangle } from "lucide-react"

interface LogoutButtonProps {
  variant?: "default" | "ghost" | "outline"
  size?: "default" | "sm" | "lg" | "icon"
  showConfirmation?: boolean
  customRedirect?: string
  className?: string
  children?: React.ReactNode
}

export const LogoutButton: React.FC<LogoutButtonProps> = ({
  variant = "ghost",
  size = "icon",
  showConfirmation = false,
  customRedirect,
  className,
  children,
}) => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const { performLogout } = useEnhancedLogout()

  const handleLogoutClick = () => {
    if (showConfirmation) {
      setShowConfirmDialog(true)
    } else {
      handleLogout()
    }
  }

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await performLogout({
        redirectTo: customRedirect,
        reason: "user_initiated",
      })
    } catch (error) {
      console.error("Logout failed:", error)
    } finally {
      setIsLoggingOut(false)
      setShowConfirmDialog(false)
    }
  }

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={handleLogoutClick}
        disabled={isLoggingOut}
        className={className}
        title="Sign out"
      >
        {children || <LogOut size={20} />}
      </Button>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="text-primary" size={20} />
              Confirm Logout
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to log out? This will end your current session and you'll need to sign in again.
            </DialogDescription>
          </DialogHeader>

          <div className="bg-secondary/20 p-4 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <AlertTriangle size={16} />
              <span>Your session will be securely terminated and all local data will be cleared.</span>
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)} disabled={isLoggingOut}>
              Cancel
            </Button>
            <Button onClick={handleLogout} disabled={isLoggingOut} className="bg-destructive hover:bg-destructive/90">
              {isLoggingOut ? "Logging out..." : "Logout"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
