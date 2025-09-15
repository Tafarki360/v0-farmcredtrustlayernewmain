import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface FarmLocationRequest {
  farmLocation: string;
  coordinates?: { lat: number; lng: number };
  farmSize: string;
  userId: string;
  agentId?: string;
}

// Mock certified agent verification
async function requestAgentVerification(location: string, coordinates: any, agentId?: string): Promise<{ 
  valid: boolean; 
  agentAssigned?: string; 
  verificationId?: string; 
  error?: string 
}> {
  console.log(`Requesting agent verification for location: ${location}`);
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Mock assigning a certified agent
  const availableAgents = [
    "Agent-001-Katsina",
    "Agent-002-Lagos", 
    "Agent-003-Kaduna",
    "Agent-004-Kano",
    "Agent-005-Ogun"
  ];
  
  const assignedAgent = agentId || availableAgents[Math.floor(Math.random() * availableAgents.length)];
  const verificationId = `FARM-VERIFY-${Date.now()}`;
  
  return {
    valid: true,
    agentAssigned: assignedAgent,
    verificationId: verificationId
  };
}

// Mock GPS coordinates validation
function validateCoordinates(coordinates: { lat: number; lng: number }): boolean {
  // Check if coordinates are within Nigeria's approximate bounds
  const nigeriaBounds = {
    north: 13.9,
    south: 4.3,
    west: 2.7,
    east: 14.7
  };
  
  return (
    coordinates.lat >= nigeriaBounds.south &&
    coordinates.lat <= nigeriaBounds.north &&
    coordinates.lng >= nigeriaBounds.west &&
    coordinates.lng <= nigeriaBounds.east
  );
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { farmLocation, coordinates, farmSize, userId, agentId }: FarmLocationRequest = await req.json();

    if (!userId || !farmLocation) {
      return new Response(
        JSON.stringify({ error: 'User ID and farm location are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let coordinatesValid = false;
    let gpsError = null;

    // Validate GPS coordinates if provided
    if (coordinates) {
      coordinatesValid = validateCoordinates(coordinates);
      if (!coordinatesValid) {
        gpsError = "GPS coordinates appear to be outside Nigeria";
      }
    }

    // Request agent verification
    const agentResult = await requestAgentVerification(farmLocation, coordinates, agentId);

    // Update user profile with farm location data
    const updateData: any = {
      farm_location: farmLocation,
      farm_size: farmSize,
      farm_location_verified: false // Will be updated when agent completes verification
    };

    const { error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('user_id', userId);

    if (error) {
      console.error('Error updating farm location:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to update farm location' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const results = {
      farmLocation: farmLocation,
      farmSize: farmSize,
      coordinates: coordinates,
      coordinatesValid: coordinatesValid,
      gpsError: gpsError,
      agentVerification: agentResult,
      status: "Pending agent verification"
    };

    console.log('Farm location verification results:', results);

    return new Response(
      JSON.stringify({ success: true, results }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in verify-farm-location function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
