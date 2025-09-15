"use client"

import { useEffect } from "react"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/contexts/AuthContext"

interface SecurityAuditLog {
  action: string
  resource?: string
  success: boolean
  errorMessage?: string
  metadata?: Record<string, any>
}

export const useSecurityAudit = () => {
  const { user } = useAuth()

  const logSecurityEvent = async (logData: SecurityAuditLog) => {
    try {
      // Get client IP and user agent
      const userAgent = navigator.userAgent

      await supabase.from("security_audit_logs").insert({
        user_id: user?.id,
        action: logData.action,
        resource: logData.resource,
        success: logData.success,
        error_message: logData.errorMessage,
        user_agent: userAgent,
        metadata: logData.metadata,
        timestamp: new Date().toISOString(),
      })
    } catch (error) {
      console.error("Failed to log security event:", error)
    }
  }

  const logLogin = (success: boolean, errorMessage?: string) => {
    logSecurityEvent({
      action: "LOGIN_ATTEMPT",
      resource: "AUTH",
      success,
      errorMessage,
      metadata: { timestamp: new Date().toISOString() },
    })
  }

  const logLogout = () => {
    logSecurityEvent({
      action: "LOGOUT",
      resource: "AUTH",
      success: true,
      metadata: { timestamp: new Date().toISOString() },
    })
  }

  const logProfileUpdate = (success: boolean, fields: string[], errorMessage?: string) => {
    logSecurityEvent({
      action: "PROFILE_UPDATE",
      resource: "USER_PROFILE",
      success,
      errorMessage,
      metadata: {
        updated_fields: fields,
        timestamp: new Date().toISOString(),
      },
    })
  }

  const logDataAccess = (resource: string, success: boolean, errorMessage?: string) => {
    logSecurityEvent({
      action: "DATA_ACCESS",
      resource,
      success,
      errorMessage,
      metadata: { timestamp: new Date().toISOString() },
    })
  }

  const logSensitiveAction = (action: string, resource: string, success: boolean, metadata?: Record<string, any>) => {
    logSecurityEvent({
      action,
      resource,
      success,
      metadata: {
        ...metadata,
        timestamp: new Date().toISOString(),
        flagged_as_sensitive: true,
      },
    })
  }

  // Auto-log page visits for security monitoring
  useEffect(() => {
    if (user) {
      logSecurityEvent({
        action: "PAGE_VISIT",
        resource: window.location.pathname,
        success: true,
        metadata: {
          url: window.location.href,
          timestamp: new Date().toISOString(),
        },
      })
    }
  }, [user, window.location.pathname])

  return {
    logSecurityEvent,
    logLogin,
    logLogout,
    logProfileUpdate,
    logDataAccess,
    logSensitiveAction,
  }
}
