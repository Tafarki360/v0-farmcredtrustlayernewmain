import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"

export interface LogoutOptions {
  userType: "farmer" | "cooperative" | "bank"
  userId?: string
  sessionId?: string
  reason?: "user_initiated" | "session_timeout" | "security_logout" | "admin_logout"
  redirectTo?: string
}

class LogoutService {
  private async logSecurityEvent(userId: string | undefined, action: string, success: boolean, metadata?: any) {
    try {
      if (!userId) return

      await supabase.from("security_audit_logs").insert({
        user_id: userId,
        action,
        resource: "AUTH_SESSION",
        success,
        user_agent: navigator.userAgent,
        metadata: {
          ...metadata,
          timestamp: new Date().toISOString(),
          ip_address: "client_side", // In production, get from server
        },
      })
    } catch (error) {
      console.error("Failed to log security event:", error)
    }
  }

  private async clearLocalStorage() {
    try {
      // Clear sensitive data from localStorage
      const keysToRemove = [
        "supabase.auth.token",
        "farmcred_session",
        "user_preferences",
        "cached_data",
        "temp_verification_data",
      ]

      keysToRemove.forEach((key) => {
        localStorage.removeItem(key)
      })

      // Clear sessionStorage
      sessionStorage.clear()
    } catch (error) {
      console.error("Failed to clear local storage:", error)
    }
  }

  private async clearCookies() {
    try {
      // Clear authentication cookies
      const cookiesToClear = ["sb-access-token", "sb-refresh-token", "farmcred-session", "user-session"]

      cookiesToClear.forEach((cookieName) => {
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname}`
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
      })
    } catch (error) {
      console.error("Failed to clear cookies:", error)
    }
  }

  private async invalidateServerSession(userId: string) {
    try {
      // Call server-side session invalidation
      await supabase.functions.invoke("invalidate-session", {
        body: { userId, timestamp: new Date().toISOString() },
      })
    } catch (error) {
      console.error("Failed to invalidate server session:", error)
    }
  }

  private getRedirectPath(userType: string, customRedirect?: string): string {
    if (customRedirect) return customRedirect

    // Default redirect paths based on user type
    switch (userType) {
      case "farmer":
        return "/"
      case "cooperative":
        return "/"
      case "bank":
        return "/"
      default:
        return "/"
    }
  }

  private showLogoutNotification(reason: string) {
    const messages = {
      user_initiated: "You have been logged out successfully",
      session_timeout: "Your session has expired. Please log in again.",
      security_logout: "You have been logged out for security reasons",
      admin_logout: "Your session was terminated by an administrator",
    }

    const message = messages[reason as keyof typeof messages] || "You have been logged out"

    if (reason === "user_initiated") {
      toast.success(message)
    } else {
      toast.warning(message)
    }
  }

  async performLogout(options: LogoutOptions): Promise<{ success: boolean; redirectTo: string }> {
    const { userType, userId, sessionId, reason = "user_initiated", redirectTo } = options

    try {
      // Log logout attempt
      await this.logSecurityEvent(userId, "LOGOUT_INITIATED", true, {
        userType,
        reason,
        sessionId,
      })

      // Step 1: Sign out from Supabase
      const { error: signOutError } = await supabase.auth.signOut()

      if (signOutError) {
        console.error("Supabase signout error:", signOutError)
        await this.logSecurityEvent(userId, "LOGOUT_FAILED", false, {
          error: signOutError.message,
          userType,
          reason,
        })
      }

      // Step 2: Clear local storage and cookies
      await this.clearLocalStorage()
      await this.clearCookies()

      // Step 3: Invalidate server session
      if (userId) {
        await this.invalidateServerSession(userId)
      }

      // Step 4: Log successful logout
      await this.logSecurityEvent(userId, "LOGOUT_COMPLETED", true, {
        userType,
        reason,
        sessionId,
        cleared_storage: true,
        cleared_cookies: true,
      })

      // Step 5: Show notification
      this.showLogoutNotification(reason)

      // Step 6: Determine redirect path
      const redirectPath = this.getRedirectPath(userType, redirectTo)

      return {
        success: true,
        redirectTo: redirectPath,
      }
    } catch (error) {
      console.error("Logout error:", error)

      await this.logSecurityEvent(userId, "LOGOUT_ERROR", false, {
        error: error instanceof Error ? error.message : "Unknown error",
        userType,
        reason,
      })

      // Even if there's an error, try to clear local data
      await this.clearLocalStorage()
      await this.clearCookies()

      toast.error("Logout encountered an issue, but local session has been cleared")

      return {
        success: false,
        redirectTo: this.getRedirectPath(userType, redirectTo),
      }
    }
  }

  // Automatic logout for session timeout
  async performTimeoutLogout(userType: string, userId?: string) {
    return this.performLogout({
      userType: userType as any,
      userId,
      reason: "session_timeout",
    })
  }

  // Security-triggered logout
  async performSecurityLogout(userType: string, userId?: string, securityReason?: string) {
    await this.logSecurityEvent(userId, "SECURITY_LOGOUT_TRIGGERED", true, {
      securityReason,
      userType,
    })

    return this.performLogout({
      userType: userType as any,
      userId,
      reason: "security_logout",
    })
  }

  // Logout all sessions (for security incidents)
  async performGlobalLogout(userId: string) {
    try {
      // Invalidate all sessions for this user
      await supabase.functions.invoke("invalidate-all-sessions", {
        body: { userId, timestamp: new Date().toISOString() },
      })

      await this.logSecurityEvent(userId, "GLOBAL_LOGOUT_PERFORMED", true, {
        reason: "security_incident",
      })

      return { success: true }
    } catch (error) {
      console.error("Global logout error:", error)
      return { success: false }
    }
  }
}

export const logoutService = new LogoutService()
