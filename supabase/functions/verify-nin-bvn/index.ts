import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface VerificationRequest {
  nin?: string;
  bvn?: string;
  userId: string;
}

// Mock NIN verification API (replace with actual API)
async function verifyNIN(nin: string): Promise<{ valid: boolean; data?: any; error?: string }> {
  console.log(`Verifying NIN: ${nin}`);
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Mock validation - check if NIN is 11 digits
  if (!/^\d{11}$/.test(nin)) {
    return { valid: false, error: "NIN must be 11 digits" };
  }
  
  // Mock successful verification
  return {
    valid: true,
    data: {
      firstName: "Verification",
      lastName: "Successful", 
      dateOfBirth: "1990-01-01",
      gender: "M"
    }
  };
}

// Mock BVN verification API (replace with actual API)
async function verifyBVN(bvn: string): Promise<{ valid: boolean; data?: any; error?: string }> {
  console.log(`Verifying BVN: ${bvn}`);
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Mock validation - check if BVN is 11 digits
  if (!/^\d{11}$/.test(bvn)) {
    return { valid: false, error: "BVN must be 11 digits" };
  }
  
  // Mock successful verification
  return {
    valid: true,
    data: {
      firstName: "Bank",
      lastName: "Verified",
      phoneNumber: "+2347069301804"
    }
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { nin, bvn, userId }: VerificationRequest = await req.json();

    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'User ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const results: any = {};

    // Verify NIN if provided
    if (nin) {
      const ninResult = await verifyNIN(nin);
      results.nin = ninResult;
      
      if (ninResult.valid) {
        // Update user profile with verified NIN
        const { error } = await supabase
          .from('profiles')
          .update({ 
            nin: nin,
            nin_verified: true 
          })
          .eq('user_id', userId);

        if (error) {
          console.error('Error updating NIN verification:', error);
        }
      }
    }

    // Verify BVN if provided
    if (bvn) {
      const bvnResult = await verifyBVN(bvn);
      results.bvn = bvnResult;
      
      if (bvnResult.valid) {
        // Update user profile with verified BVN
        const { error } = await supabase
          .from('profiles')
          .update({ 
            bvn: bvn,
            bvn_verified: true 
          })
          .eq('user_id', userId);

        if (error) {
          console.error('Error updating BVN verification:', error);
        }
      }
    }

    console.log('Verification results:', results);

    return new Response(
      JSON.stringify({ success: true, results }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in verify-nin-bvn function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
