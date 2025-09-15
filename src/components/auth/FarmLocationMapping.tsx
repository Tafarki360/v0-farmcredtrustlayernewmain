import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { MapPin, Camera, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface FarmLocationMappingProps {
  onVerificationComplete: (data: any) => void;
  userId: string;
}

export const FarmLocationMapping: React.FC<FarmLocationMappingProps> = ({ 
  onVerificationComplete, 
  userId 
}) => {
  const [location, setLocation] = useState('');
  const [farmSize, setFarmSize] = useState('');
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'success' | 'error'>('pending');
  const { toast } = useToast();

  const getCurrentLocation = () => {
    setIsGettingLocation(true);
    
    if (!navigator.geolocation) {
      toast({
        title: "Location Error",
        description: "Geolocation is not supported by this browser.",
        variant: "destructive"
      });
      setIsGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setCoordinates(coords);
        setIsGettingLocation(false);
        
        toast({
          title: "Location Captured",
          description: `GPS coordinates: ${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)}`,
        });
      },
      (error) => {
        console.error('Geolocation error:', error);
        toast({
          title: "Location Error",
          description: "Could not get your current location. Please enter location manually.",
          variant: "destructive"
        });
        setIsGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  const handleSubmit = async () => {
    if (!location.trim() || !farmSize.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide both farm location and size.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('verify-farm-location', {
        body: {
          farmLocation: location,
          coordinates: coordinates,
          farmSize: farmSize,
          userId: userId
        }
      });

      if (error) {
        throw error;
      }

      if (data.success) {
        setVerificationStatus('success');
        toast({
          title: "Farm Location Submitted",
          description: `Agent ${data.results.agentVerification.agentAssigned} will verify your farm location.`,
        });
        
        onVerificationComplete({
          farmLocation: location,
          farmSize: farmSize,
          coordinates: coordinates,
          agentAssigned: data.results.agentVerification.agentAssigned,
          verificationId: data.results.agentVerification.verificationId
        });
      } else {
        throw new Error('Verification failed');
      }
    } catch (error) {
      console.error('Farm location verification error:', error);
      setVerificationStatus('error');
      toast({
        title: "Verification Failed",
        description: "Failed to submit farm location for verification.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="text-primary" size={20} />
          <h3 className="text-lg font-semibold">Farm Location Mapping</h3>
        </div>

        <div className="space-y-3">
          <div>
            <Label htmlFor="location">Farm Location *</Label>
            <Input
              id="location"
              placeholder="e.g., Funtua, Katsina State"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div>
            <Label htmlFor="farmSize">Farm Size *</Label>
            <Input
              id="farmSize"
              placeholder="e.g., 2.5 hectares"
              value={farmSize}
              onChange={(e) => setFarmSize(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label>GPS Coordinates (Optional)</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={getCurrentLocation}
                disabled={isGettingLocation || isLoading}
                className="flex-1"
              >
                {isGettingLocation ? (
                  <Loader2 size={16} className="mr-2 animate-spin" />
                ) : (
                  <MapPin size={16} className="mr-2" />
                )}
                {isGettingLocation ? 'Getting Location...' : 'Get GPS Location'}
              </Button>
            </div>
            
            {coordinates && (
              <div className="text-sm text-muted-foreground bg-secondary/50 p-2 rounded">
                <strong>Coordinates:</strong> {coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}
              </div>
            )}
          </div>

          <div className="bg-info/10 p-3 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle size={16} className="text-info mt-0.5" />
              <div className="text-sm text-info">
                <strong>Certified Agent Verification:</strong> Your farm location will be verified by a certified agent within 5-7 business days.
              </div>
            </div>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={isLoading || !location.trim() || !farmSize.trim()}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="mr-2 animate-spin" />
                Submitting for Verification...
              </>
            ) : (
              <>
                <CheckCircle size={16} className="mr-2" />
                Submit for Agent Verification
              </>
            )}
          </Button>

          {verificationStatus === 'success' && (
            <div className="bg-success/10 p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-success" />
                <span className="text-sm text-success font-medium">
                  Farm location submitted successfully! Agent verification pending.
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
