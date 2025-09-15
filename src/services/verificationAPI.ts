import { supabase } from "@/integrations/supabase/client"

export interface NIMCVerificationResponse {
  success: boolean
  data?: {
    nin: string
    firstName: string
    lastName: string
    middleName?: string
    dateOfBirth: string
    gender: string
    phoneNumber: string
    email?: string
    address: string
    photo?: string
  }
  error?: string
}

export interface CBNBVNVerificationResponse {
  success: boolean
  data?: {
    bvn: string
    firstName: string
    lastName: string
    middleName?: string
    dateOfBirth: string
    phoneNumber: string
    email?: string
    enrollmentBank: string
    enrollmentBranch: string
    watchListed: boolean
  }
  error?: string
}

export interface CACVerificationResponse {
  success: boolean
  data?: {
    rcNumber: string
    companyName: string
    companyType: string
    registrationDate: string
    companyStatus: string
    companyEmail?: string
    companyAddress: string
    directors: Array<{
      name: string
      nationality: string
      occupation: string
    }>
  }
  error?: string
}

export interface CooperativeVerificationResponse {
  success: boolean
  data?: {
    registrationNumber: string
    cooperativeName: string
    registrationDate: string
    status: string
    address: string
    state: string
    lga: string
    ward: string
    memberCount: number
  }
  error?: string
}

export interface BankVerificationResponse {
  success: boolean
  data?: {
    bankName: string
    bankCode: string
    nibssCode: string
    swiftCode?: string
    category: string
    status: string
    establishedDate: string
  }
  error?: string
}

class VerificationAPIService {
  private readonly NIMC_API_BASE = process.env.REACT_APP_NIMC_API_URL || "https://api.nimc.gov.ng/v1"
  private readonly CBN_API_BASE = process.env.REACT_APP_CBN_API_URL || "https://api.cbn.gov.ng/v1"
  private readonly CAC_API_BASE = process.env.REACT_APP_CAC_API_URL || "https://api.cac.gov.ng/v1"
  private readonly COOPERATIVE_API_BASE =
    process.env.REACT_APP_COOPERATIVE_API_URL || "https://api.cooperatives.gov.ng/v1"
  private readonly BANK_API_BASE = process.env.REACT_APP_BANK_API_URL || "https://api.nibss.com/v1"

  private async makeSecureRequest(url: string, options: RequestInit = {}): Promise<Response> {
    const defaultHeaders = {
      "Content-Type": "application/json",
      "User-Agent": "FarmCred-Platform/1.0",
      "X-Request-ID": crypto.randomUUID(),
    }

    return fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    })
  }

  async verifyNIN(nin: string, userId: string): Promise<NIMCVerificationResponse> {
    try {
      // Input validation
      if (!/^\d{11}$/.test(nin)) {
        return { success: false, error: "Invalid NIN format. Must be 11 digits." }
      }

      // Log verification attempt
      await supabase.from("verification_logs").insert({
        user_id: userId,
        verification_type: "NIN",
        identifier: nin,
        status: "initiated",
        timestamp: new Date().toISOString(),
      })

      const response = await this.makeSecureRequest(`${this.NIMC_API_BASE}/verify/nin`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_NIMC_API_KEY}`,
        },
        body: JSON.stringify({ nin }),
      })

      if (!response.ok) {
        throw new Error(`NIMC API error: ${response.status}`)
      }

      const data = await response.json()

      // Update verification status
      await supabase.from("verification_logs").insert({
        user_id: userId,
        verification_type: "NIN",
        identifier: nin,
        status: data.success ? "verified" : "failed",
        response_data: data,
        timestamp: new Date().toISOString(),
      })

      return {
        success: data.success,
        data: data.success ? data.data : undefined,
        error: data.success ? undefined : data.message,
      }
    } catch (error) {
      console.error("NIN verification error:", error)

      // Log error
      await supabase.from("verification_logs").insert({
        user_id: userId,
        verification_type: "NIN",
        identifier: nin,
        status: "error",
        error_message: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      })

      return { success: false, error: "Verification service temporarily unavailable" }
    }
  }

  async verifyBVN(bvn: string, userId: string): Promise<CBNBVNVerificationResponse> {
    try {
      // Input validation
      if (!/^\d{11}$/.test(bvn)) {
        return { success: false, error: "Invalid BVN format. Must be 11 digits." }
      }

      // Log verification attempt
      await supabase.from("verification_logs").insert({
        user_id: userId,
        verification_type: "BVN",
        identifier: bvn,
        status: "initiated",
        timestamp: new Date().toISOString(),
      })

      const response = await this.makeSecureRequest(`${this.CBN_API_BASE}/verify/bvn`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_CBN_API_KEY}`,
        },
        body: JSON.stringify({ bvn }),
      })

      if (!response.ok) {
        throw new Error(`CBN API error: ${response.status}`)
      }

      const data = await response.json()

      // Update verification status
      await supabase.from("verification_logs").insert({
        user_id: userId,
        verification_type: "BVN",
        identifier: bvn,
        status: data.success ? "verified" : "failed",
        response_data: data,
        timestamp: new Date().toISOString(),
      })

      return {
        success: data.success,
        data: data.success ? data.data : undefined,
        error: data.success ? undefined : data.message,
      }
    } catch (error) {
      console.error("BVN verification error:", error)

      await supabase.from("verification_logs").insert({
        user_id: userId,
        verification_type: "BVN",
        identifier: bvn,
        status: "error",
        error_message: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      })

      return { success: false, error: "Verification service temporarily unavailable" }
    }
  }

  async verifyCAC(cacNumber: string, userId: string): Promise<CACVerificationResponse> {
    try {
      // Input validation
      if (!/^RC\d{6,8}$/.test(cacNumber)) {
        return { success: false, error: "Invalid CAC number format. Must be RC followed by 6-8 digits." }
      }

      await supabase.from("verification_logs").insert({
        user_id: userId,
        verification_type: "CAC",
        identifier: cacNumber,
        status: "initiated",
        timestamp: new Date().toISOString(),
      })

      const response = await this.makeSecureRequest(`${this.CAC_API_BASE}/verify/company`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_CAC_API_KEY}`,
        },
        body: JSON.stringify({ rcNumber: cacNumber }),
      })

      if (!response.ok) {
        throw new Error(`CAC API error: ${response.status}`)
      }

      const data = await response.json()

      await supabase.from("verification_logs").insert({
        user_id: userId,
        verification_type: "CAC",
        identifier: cacNumber,
        status: data.success ? "verified" : "failed",
        response_data: data,
        timestamp: new Date().toISOString(),
      })

      return {
        success: data.success,
        data: data.success ? data.data : undefined,
        error: data.success ? undefined : data.message,
      }
    } catch (error) {
      console.error("CAC verification error:", error)

      await supabase.from("verification_logs").insert({
        user_id: userId,
        verification_type: "CAC",
        identifier: cacNumber,
        status: "error",
        error_message: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      })

      return { success: false, error: "Verification service temporarily unavailable" }
    }
  }

  async verifyCooperative(
    regNumber: string,
    cooperativeName: string,
    userId: string,
  ): Promise<CooperativeVerificationResponse> {
    try {
      // Input validation
      if (!/^COOP\/\d{4}\/\d{6}$/.test(regNumber)) {
        return { success: false, error: "Invalid cooperative registration number format." }
      }

      await supabase.from("verification_logs").insert({
        user_id: userId,
        verification_type: "COOPERATIVE",
        identifier: regNumber,
        status: "initiated",
        timestamp: new Date().toISOString(),
      })

      const response = await this.makeSecureRequest(`${this.COOPERATIVE_API_BASE}/verify/cooperative`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_COOPERATIVE_API_KEY}`,
        },
        body: JSON.stringify({
          registrationNumber: regNumber,
          cooperativeName,
        }),
      })

      if (!response.ok) {
        throw new Error(`Cooperative API error: ${response.status}`)
      }

      const data = await response.json()

      await supabase.from("verification_logs").insert({
        user_id: userId,
        verification_type: "COOPERATIVE",
        identifier: regNumber,
        status: data.success ? "verified" : "failed",
        response_data: data,
        timestamp: new Date().toISOString(),
      })

      return {
        success: data.success,
        data: data.success ? data.data : undefined,
        error: data.success ? undefined : data.message,
      }
    } catch (error) {
      console.error("Cooperative verification error:", error)

      await supabase.from("verification_logs").insert({
        user_id: userId,
        verification_type: "COOPERATIVE",
        identifier: regNumber,
        status: "error",
        error_message: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      })

      return { success: false, error: "Verification service temporarily unavailable" }
    }
  }

  async verifyBank(bankName: string, bankCode: string, userId: string): Promise<BankVerificationResponse> {
    try {
      await supabase.from("verification_logs").insert({
        user_id: userId,
        verification_type: "BANK",
        identifier: bankCode,
        status: "initiated",
        timestamp: new Date().toISOString(),
      })

      const response = await this.makeSecureRequest(`${this.BANK_API_BASE}/verify/bank`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_BANK_API_KEY}`,
        },
        body: JSON.stringify({
          bankName,
          bankCode,
        }),
      })

      if (!response.ok) {
        throw new Error(`Bank API error: ${response.status}`)
      }

      const data = await response.json()

      await supabase.from("verification_logs").insert({
        user_id: userId,
        verification_type: "BANK",
        identifier: bankCode,
        status: data.success ? "verified" : "failed",
        response_data: data,
        timestamp: new Date().toISOString(),
      })

      return {
        success: data.success,
        data: data.success ? data.data : undefined,
        error: data.success ? undefined : data.message,
      }
    } catch (error) {
      console.error("Bank verification error:", error)

      await supabase.from("verification_logs").insert({
        user_id: userId,
        verification_type: "BANK",
        identifier: bankCode,
        status: "error",
        error_message: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      })

      return { success: false, error: "Verification service temporarily unavailable" }
    }
  }

  async crossVerifyNINBVN(
    nin: string,
    bvn: string,
    userId: string,
  ): Promise<{ success: boolean; match: boolean; error?: string }> {
    try {
      const [ninResult, bvnResult] = await Promise.all([this.verifyNIN(nin, userId), this.verifyBVN(bvn, userId)])

      if (!ninResult.success || !bvnResult.success) {
        return {
          success: false,
          match: false,
          error: "One or both verifications failed",
        }
      }

      // Cross-verify personal details match
      const ninData = ninResult.data!
      const bvnData = bvnResult.data!

      const nameMatch =
        ninData.firstName.toLowerCase() === bvnData.firstName.toLowerCase() &&
        ninData.lastName.toLowerCase() === bvnData.lastName.toLowerCase()

      const phoneMatch = ninData.phoneNumber === bvnData.phoneNumber
      const dobMatch = ninData.dateOfBirth === bvnData.dateOfBirth

      const overallMatch = nameMatch && phoneMatch && dobMatch

      // Log cross-verification result
      await supabase.from("verification_logs").insert({
        user_id: userId,
        verification_type: "NIN_BVN_CROSS_VERIFY",
        identifier: `${nin}-${bvn}`,
        status: overallMatch ? "verified" : "failed",
        response_data: { nameMatch, phoneMatch, dobMatch, overallMatch },
        timestamp: new Date().toISOString(),
      })

      return { success: true, match: overallMatch }
    } catch (error) {
      console.error("Cross-verification error:", error)
      return {
        success: false,
        match: false,
        error: "Cross-verification service temporarily unavailable",
      }
    }
  }
}

export const verificationAPI = new VerificationAPIService()
