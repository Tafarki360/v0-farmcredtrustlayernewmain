import { supabase } from "@/integrations/supabase/client"

export interface CooperativeIDData {
  cooperativeId: string
  cooperativeName: string
  state: string
  lga: string
  ward: string
  registrationNumber: string
  cacNumber: string
  memberCount: number
  establishedYear: number
}

export interface FarmerCooperativeLink {
  farmerId: string
  cooperativeId: string
  membershipId: string
  joinDate: string
  status: "active" | "inactive" | "suspended"
  email: string
}

class CooperativeIDService {
  private generateCooperativeID(state: string, lga: string, ward: string): string {
    // Generate unique cooperative ID format: ST-LGA-WARD-YYYYMMDD-XXX
    const stateCode = this.getStateCode(state)
    const lgaCode = this.getLGACode(lga)
    const wardCode = this.getWardCode(ward)
    const dateCode = new Date().toISOString().slice(0, 10).replace(/-/g, "")
    const randomSuffix = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0")

    return `${stateCode}-${lgaCode}-${wardCode}-${dateCode}-${randomSuffix}`
  }

  private generateMembershipID(cooperativeId: string, memberCount: number): string {
    // Generate unique membership ID format: COOP-ID-MEMBER-NUMBER
    const memberNumber = (memberCount + 1).toString().padStart(4, "0")
    return `${cooperativeId}-M${memberNumber}`
  }

  private getStateCode(state: string): string {
    const stateCodes: { [key: string]: string } = {
      Abia: "AB",
      Adamawa: "AD",
      "Akwa Ibom": "AK",
      Anambra: "AN",
      Bauchi: "BA",
      Bayelsa: "BY",
      Benue: "BN",
      Borno: "BO",
      "Cross River": "CR",
      Delta: "DT",
      Ebonyi: "EB",
      Edo: "ED",
      Ekiti: "EK",
      Enugu: "EN",
      FCT: "FC",
      Gombe: "GO",
      Imo: "IM",
      Jigawa: "JI",
      Kaduna: "KD",
      Kano: "KN",
      Katsina: "KT",
      Kebbi: "KB",
      Kogi: "KG",
      Kwara: "KW",
      Lagos: "LA",
      Nasarawa: "NA",
      Niger: "NI",
      Ogun: "OG",
      Ondo: "ON",
      Osun: "OS",
      Oyo: "OY",
      Plateau: "PL",
      Rivers: "RI",
      Sokoto: "SO",
      Taraba: "TA",
      Yobe: "YO",
      Zamfara: "ZA",
    }
    return stateCodes[state] || "XX"
  }

  private getLGACode(lga: string): string {
    // Generate 3-letter code from LGA name
    return lga.substring(0, 3).toUpperCase()
  }

  private getWardCode(ward: string): string {
    // Generate 2-letter code from ward name
    return ward.substring(0, 2).toUpperCase()
  }

  async registerCooperative(cooperativeData: {
    cooperativeName: string
    state: string
    lga: string
    ward: string
    registrationNumber: string
    cacNumber: string
    establishedYear: number
    executiveCommittee: {
      chairman: string
      secretary: string
      treasurer: string
      publicRelationsOfficer?: string
    }
    address: string
    userId: string
  }): Promise<{ success: boolean; cooperativeId?: string; error?: string }> {
    try {
      // Generate unique cooperative ID
      const cooperativeId = this.generateCooperativeID(cooperativeData.state, cooperativeData.lga, cooperativeData.ward)

      // Check if cooperative already exists
      const { data: existingCoop } = await supabase
        .from("cooperatives")
        .select("id")
        .eq("registration_number", cooperativeData.registrationNumber)
        .single()

      if (existingCoop) {
        return { success: false, error: "Cooperative with this registration number already exists" }
      }

      // Insert cooperative record
      const { error: insertError } = await supabase.from("cooperatives").insert({
        cooperative_id: cooperativeId,
        cooperative_name: cooperativeData.cooperativeName,
        state: cooperativeData.state,
        lga: cooperativeData.lga,
        ward: cooperativeData.ward,
        registration_number: cooperativeData.registrationNumber,
        cac_number: cooperativeData.cacNumber,
        established_year: cooperativeData.establishedYear,
        executive_committee: cooperativeData.executiveCommittee,
        address: cooperativeData.address,
        member_count: 0,
        status: "active",
        created_by: cooperativeData.userId,
        created_at: new Date().toISOString(),
      })

      if (insertError) {
        console.error("Cooperative registration error:", insertError)
        return { success: false, error: "Failed to register cooperative" }
      }

      return { success: true, cooperativeId }
    } catch (error) {
      console.error("Cooperative registration error:", error)
      return { success: false, error: "Registration service temporarily unavailable" }
    }
  }

  async linkFarmerToCooperative(
    farmerEmail: string,
    cooperativeId: string,
    farmerId: string,
  ): Promise<{ success: boolean; membershipId?: string; error?: string }> {
    try {
      // Get cooperative details
      const { data: cooperative, error: coopError } = await supabase
        .from("cooperatives")
        .select("*")
        .eq("cooperative_id", cooperativeId)
        .single()

      if (coopError || !cooperative) {
        return { success: false, error: "Cooperative not found" }
      }

      // Check if farmer is already a member
      const { data: existingMember } = await supabase
        .from("cooperative_members")
        .select("membership_id")
        .eq("farmer_id", farmerId)
        .eq("cooperative_id", cooperativeId)
        .single()

      if (existingMember) {
        return { success: true, membershipId: existingMember.membership_id }
      }

      // Generate membership ID
      const membershipId = this.generateMembershipID(cooperativeId, cooperative.member_count)

      // Add farmer to cooperative
      const { error: memberError } = await supabase.from("cooperative_members").insert({
        farmer_id: farmerId,
        cooperative_id: cooperativeId,
        membership_id: membershipId,
        email: farmerEmail,
        join_date: new Date().toISOString(),
        status: "active",
      })

      if (memberError) {
        console.error("Member linking error:", memberError)
        return { success: false, error: "Failed to link farmer to cooperative" }
      }

      // Update cooperative member count
      await supabase
        .from("cooperatives")
        .update({
          member_count: cooperative.member_count + 1,
          updated_at: new Date().toISOString(),
        })
        .eq("cooperative_id", cooperativeId)

      return { success: true, membershipId }
    } catch (error) {
      console.error("Farmer linking error:", error)
      return { success: false, error: "Linking service temporarily unavailable" }
    }
  }

  async getFarmerCooperativeInfo(farmerEmail: string): Promise<{
    success: boolean
    cooperativeInfo?: {
      cooperativeId: string
      cooperativeName: string
      membershipId: string
      joinDate: string
      status: string
    }
    error?: string
  }> {
    try {
      const { data: memberInfo, error } = await supabase
        .from("cooperative_members")
        .select(`
          membership_id,
          join_date,
          status,
          cooperatives (
            cooperative_id,
            cooperative_name
          )
        `)
        .eq("email", farmerEmail)
        .eq("status", "active")
        .single()

      if (error || !memberInfo) {
        return { success: false, error: "No active cooperative membership found" }
      }

      return {
        success: true,
        cooperativeInfo: {
          cooperativeId: memberInfo.cooperatives.cooperative_id,
          cooperativeName: memberInfo.cooperatives.cooperative_name,
          membershipId: memberInfo.membership_id,
          joinDate: memberInfo.join_date,
          status: memberInfo.status,
        },
      }
    } catch (error) {
      console.error("Cooperative info retrieval error:", error)
      return { success: false, error: "Service temporarily unavailable" }
    }
  }

  async getCooperativesByLocation(
    state: string,
    lga?: string,
    ward?: string,
  ): Promise<{
    success: boolean
    cooperatives?: CooperativeIDData[]
    error?: string
  }> {
    try {
      let query = supabase.from("cooperatives").select("*").eq("state", state).eq("status", "active")

      if (lga) {
        query = query.eq("lga", lga)
      }

      if (ward) {
        query = query.eq("ward", ward)
      }

      const { data: cooperatives, error } = await query

      if (error) {
        console.error("Cooperative retrieval error:", error)
        return { success: false, error: "Failed to retrieve cooperatives" }
      }

      return {
        success: true,
        cooperatives: cooperatives.map((coop) => ({
          cooperativeId: coop.cooperative_id,
          cooperativeName: coop.cooperative_name,
          state: coop.state,
          lga: coop.lga,
          ward: coop.ward,
          registrationNumber: coop.registration_number,
          cacNumber: coop.cac_number,
          memberCount: coop.member_count,
          establishedYear: coop.established_year,
        })),
      }
    } catch (error) {
      console.error("Cooperative retrieval error:", error)
      return { success: false, error: "Service temporarily unavailable" }
    }
  }
}

export const cooperativeIDService = new CooperativeIDService()
