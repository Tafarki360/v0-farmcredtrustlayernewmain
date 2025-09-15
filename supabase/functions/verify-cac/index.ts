import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CACVerificationRequest {
  cacNumber: string;
  cooperativeRegNumber: string;
  cooperativeName: string;
  userId: string;
}

// Mock CAC verification API (replace with actual CAC API)
async function verifyCACNumber(cacNumber: string): Promise<{ valid: boolean; data?: any; error?: string }> {
  console.log(`Verifying CAC Number: ${cacNumber}`);
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Mock validation - check if CAC number follows pattern (e.g., RC1234567)
  if (!/^RC\d{6,8}$/.test(cacNumber)) {
    return { valid: false, error: "CAC number must follow format RC1234567" };
  }
  
  // Mock successful verification
  return {
    valid: true,
    data: {
      companyName: "Sample Cooperative Society",
      registrationDate: "2020-01-15",
      status: "Active",
      address: "Lagos, Nigeria",
      natureOfBusiness: "Agricultural Cooperative"
    }
  };
}

// Mock Cooperative Registration verification
async function verifyCooperativeRegistration(regNumber: string, cooperativeName: string): Promise<{ valid: boolean; data?: any; error?: string }> {
  console.log(`Verifying Cooperative Registration: ${regNumber}`);
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1800));
  
  // Mock validation - check if registration number follows pattern
  if (!/^COOP\/\d{4}\/\d{6}$/.test(regNumber)) {
    return { valid: false, error: "Cooperative registration number must follow format COOP/2024/123456" };
  }
  
  // Mock successful verification
  return {
    valid: true,
    data: {
      cooperativeName: cooperativeName,
      registrationDate: "2021-03-10",
      status: "Active",
      memberCount: 150,
      state: "Lagos",
      type: "Primary Cooperative Society"
    }
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { cacNumber, cooperativeRegNumber, cooperativeName, userId }: CACVerificationRequest = await req.json();

    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'User ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!cacNumber || !cooperativeRegNumber || !cooperativeName) {
      return new Response(
        JSON.stringify({ error: 'CAC number, cooperative registration number, and name are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify CAC number
    const cacResult = await verifyCACNumber(cacNumber);
    
    // Verify cooperative registration
    const coopResult = await verifyCooperativeRegistration(cooperativeRegNumber, cooperativeName);

    const allValid = cacResult.valid && coopResult.valid;

    if (allValid) {
      // Update user profile with verified data
      const { error } = await supabase
        .from('profiles')
        .update({ 
          cac_number: cacNumber,
          cooperative_reg_number: cooperativeRegNumber,
          cooperative_name: cooperativeName,
          cac_verified: cacResult.valid,
          cooperative_verified: coopResult.valid
        })
        .eq('user_id', userId);

      if (error) {
        console.error('Error updating cooperative verification:', error);
        return new Response(
          JSON.stringify({ error: 'Failed to update verification status' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    const results = {
      cac: cacResult,
      cooperative: coopResult,
      allValid: allValid
    };

    console.log('CAC verification results:', results);

    return new Response(
      JSON.stringify({ success: true, results }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in verify-cac function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
