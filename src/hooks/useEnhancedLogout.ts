"use client"

import { useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { logoutService, type LogoutOptions } from "@/services/logoutService"
import { useSecurityAudit } from "@/hooks/useSecurityAudit"

export const useEnhancedLogout = () => {
  const navigate = useNavigate()
  const { user, signOut } = useAuth()
  const { logLogout } = useSecurityAudit()

  const performLogout = useCallback(
    async (options: Partial<LogoutOptions> = {}) => {
      try {
        // Determine user type from user metadata or default
        const userType = user?.user_metadata?.user_type || "farmer"

        const logoutOptions: LogoutOptions = {
          userType,
          userId: user?.id,
          reason: "user_initiated",
          ...options,
        }

        // Use the centralized logout service
        const result = await logoutService.performLogout(logoutOptions)

        // Log the logout event
        logLogout()

        // Navigate to the appropriate page
        navigate(result.redirectTo)

        return result
      } catch (error) {
        console.error("Enhanced logout error:", error)

        // Fallback to basic logout
        try {
          await signOut()
          navigate("/")
        } catch (fallbackError) {
          console.error("Fallback logout error:", fallbackError)
          // Force navigation even if logout fails
          window.location.href = "/"
        }

        return { success: false, redirectTo: "/" }
      }
    },
    [user, navigate, signOut, logLogout],
  )

  const performTimeoutLogout = useCallback(async () => {
    const userType = user?.user_metadata?.user_type || "farmer"
    return logoutService.performTimeoutLogout(userType, user?.id)
  }, [user])

  const performSecurityLogout = useCallback(
    async (securityReason?: string) => {
      const userType = user?.user_metadata?.user_type || "farmer"
      return logoutService.performSecurityLogout(userType, user?.id, securityReason)
    },
    [user],
  )

  return {
    performLogout,
    performTimeoutLogout,
    performSecurityLogout,
    isLoggedIn: !!user,
    user,
  }
}
