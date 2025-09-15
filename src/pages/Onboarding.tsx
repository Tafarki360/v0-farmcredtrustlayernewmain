import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FarmCredLogo } from "@/components/FarmCredLogo";
import { TrustBadge } from "@/components/TrustBadge";

import { useToast } from "@/hooks/use-toast";
import { 
  Phone, 
  CreditCard, 
  Shield, 
  MapPin, 
  Camera, 
  CheckCircle,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle
} from "lucide-react";

const OnboardingSteps = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSignIn, setIsSignIn] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [signInData, setSignInData] = useState({
    email: "",
    password: "",
    userType: ""
  });

  const [registrationData, setRegistrationData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    phone: "",
    userType: "",
    bankName: "",
    bankCode: "",
    cooperativeName: "",
    cooperativeId: "",
    nin: "",
    bvn: "",
    farmLocation: "",
    farmSize: ""
  });

  const userTypes = [
    { value: "farmer", label: "Farmer" },
    { value: "cooperative", label: "Cooperative" },
    { value: "bank", label: "Financial Institution" }
  ];

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 8;
  };

  const validateSignIn = () => {
    const newErrors: Record<string, string> = {};

    if (!signInData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(signInData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!signInData.password.trim()) {
      newErrors.password = "Password is required";
    }

    if (!signInData.userType) {
      newErrors.userType = "Please select your account type";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateRegistration = () => {
    const newErrors: Record<string, string> = {};

    if (!registrationData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!registrationData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(registrationData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!registrationData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (!validatePassword(registrationData.password)) {
      newErrors.password = "Password must be at least 8 characters long";
    }

    if (!registrationData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (registrationData.password !== registrationData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!registrationData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }

    if (!registrationData.userType) {
      newErrors.userType = "Please select your account type";
    }

    // Type-specific validations
    if (registrationData.userType === "bank") {
      if (!registrationData.bankName.trim()) {
        newErrors.bankName = "Bank name is required";
      }
      if (!registrationData.bankCode.trim()) {
        newErrors.bankCode = "Bank code is required";
      }
    }

    if (registrationData.userType === "cooperative") {
      if (!registrationData.cooperativeName.trim()) {
        newErrors.cooperativeName = "Cooperative name is required";
      }
      if (!registrationData.cooperativeId.trim()) {
        newErrors.cooperativeId = "Cooperative ID is required";
      }
    }

    if (registrationData.userType === "farmer") {
      if (!registrationData.nin.trim()) {
        newErrors.nin = "NIN is required";
      }
      if (!registrationData.bvn.trim()) {
        newErrors.bvn = "BVN is required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignIn = async () => {
    if (!validateSignIn()) return;

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Sign In Successful!",
        description: "Welcome back to FarmCred.",
      });

      // Navigate based on user type
      switch (signInData.userType) {
        case "farmer":
          navigate("/dashboard");
          break;
        case "cooperative":
          navigate("/cooperative");
          break;
        case "bank":
          navigate("/lender");
          break;
        default:
          navigate("/portals");
      }
    } catch (error) {
      toast({
        title: "Sign In Failed",
        description: "Please check your credentials and try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegistration = async () => {
    if (!validateRegistration()) return;

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Registration Successful!",
        description: "Please check your email for verification instructions.",
      });

      // Switch to sign in mode
      setIsSignIn(true);
      setSignInData({
        email: registrationData.email,
        password: "",
        userType: registrationData.userType
      });
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "Please try again or contact support.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartCamera = () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user"
        } 
      })
        .then(() => {
          toast({
            title: "Camera Ready!",
            description: "Camera access granted for identity verification.",
          });
        })
        .catch((error) => {
          toast({
            title: "Camera Access Required",
            description: "Please allow camera access for identity verification.",
            variant: "destructive"
          });
        });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-primary/5 p-4">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8 pt-8">
          <FarmCredLogo size="lg" className="justify-center mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">
            {isSignIn ? "Sign In to FarmCred" : "Create FarmCred Account"}
          </h1>
          <p className="text-muted-foreground">
            {isSignIn ? "Access your secure dashboard" : "Join Nigeria's trusted agricultural platform"}
          </p>
        </div>

        <Card className="p-6 shadow-medium">
          {isSignIn ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={signInData.email}
                  onChange={(e) => {
                    setSignInData(prev => ({ ...prev, email: e.target.value }));
                    if (errors.email) setErrors(prev => ({ ...prev, email: "" }));
                  }}
                  className={errors.email ? "border-destructive" : ""}
                />
                {errors.email && (
                  <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="password">Password *</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={signInData.password}
                    onChange={(e) => {
                      setSignInData(prev => ({ ...prev, password: e.target.value }));
                      if (errors.password) setErrors(prev => ({ ...prev, password: "" }));
                    }}
                    className={errors.password ? "border-destructive pr-10" : "pr-10"}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.password}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="userType">Account Type *</Label>
                <Select 
                  value={signInData.userType} 
                  onValueChange={(value) => {
                    setSignInData(prev => ({ ...prev, userType: value }));
                    if (errors.userType) setErrors(prev => ({ ...prev, userType: "" }));
                  }}
                >
                  <SelectTrigger className={errors.userType ? "border-destructive" : ""}>
                    <SelectValue placeholder="Select your account type" />
                  </SelectTrigger>
                  <SelectContent>
                    {userTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.userType && (
                  <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.userType}
                  </p>
                )}
              </div>

              <Button 
                onClick={handleSignIn}
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Signing In..." : "Sign In"}
                {!isLoading && <ArrowRight size={16} className="ml-2" />}
              </Button>

              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <button
                    onClick={() => setIsSignIn(false)}
                    className="text-primary hover:underline font-medium"
                  >
                    Create Account
                  </button>
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  placeholder="Enter your full name"
                  value={registrationData.fullName}
                  onChange={(e) => {
                    setRegistrationData(prev => ({ ...prev, fullName: e.target.value }));
                    if (errors.fullName) setErrors(prev => ({ ...prev, fullName: "" }));
                  }}
                  className={errors.fullName ? "border-destructive" : ""}
                />
                {errors.fullName && (
                  <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.fullName}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="regEmail">Email Address *</Label>
                <Input
                  id="regEmail"
                  type="email"
                  placeholder="your.email@example.com"
                  value={registrationData.email}
                  onChange={(e) => {
                    setRegistrationData(prev => ({ ...prev, email: e.target.value }));
                    if (errors.email) setErrors(prev => ({ ...prev, email: "" }));
                  }}
                  className={errors.email ? "border-destructive" : ""}
                />
                {errors.email && (
                  <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="regPassword">Password *</Label>
                <div className="relative">
                  <Input
                    id="regPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    value={registrationData.password}
                    onChange={(e) => {
                      setRegistrationData(prev => ({ ...prev, password: e.target.value }));
                      if (errors.password) setErrors(prev => ({ ...prev, password: "" }));
                    }}
                    className={errors.password ? "border-destructive pr-10" : "pr-10"}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.password}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirm Password *</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={registrationData.confirmPassword}
                  onChange={(e) => {
                    setRegistrationData(prev => ({ ...prev, confirmPassword: e.target.value }));
                    if (errors.confirmPassword) setErrors(prev => ({ ...prev, confirmPassword: "" }));
                  }}
                  className={errors.confirmPassword ? "border-destructive" : ""}
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+234 8XX XXX XXXX"
                  value={registrationData.phone}
                  onChange={(e) => {
                    setRegistrationData(prev => ({ ...prev, phone: e.target.value }));
                    if (errors.phone) setErrors(prev => ({ ...prev, phone: "" }));
                  }}
                  className={errors.phone ? "border-destructive" : ""}
                />
                {errors.phone && (
                  <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.phone}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="regUserType">Account Type *</Label>
                <Select 
                  value={registrationData.userType} 
                  onValueChange={(value) => {
                    setRegistrationData(prev => ({ ...prev, userType: value }));
                    if (errors.userType) setErrors(prev => ({ ...prev, userType: "" }));
                  }}
                >
                  <SelectTrigger className={errors.userType ? "border-destructive" : ""}>
                    <SelectValue placeholder="Select your account type" />
                  </SelectTrigger>
                  <SelectContent>
                    {userTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.userType && (
                  <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.userType}
                  </p>
                )}
              </div>

              {/* Type-specific fields */}
              {registrationData.userType === "bank" && (
                <>
                  <div>
                    <Label htmlFor="bankName">Bank Name *</Label>
                    <Input
                      id="bankName"
                      placeholder="e.g., First Bank of Nigeria"
                      value={registrationData.bankName}
                      onChange={(e) => {
                        setRegistrationData(prev => ({ ...prev, bankName: e.target.value }));
                        if (errors.bankName) setErrors(prev => ({ ...prev, bankName: "" }));
                      }}
                      className={errors.bankName ? "border-destructive" : ""}
                    />
                    {errors.bankName && (
                      <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                        <AlertCircle size={14} />
                        {errors.bankName}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="bankCode">Bank Code *</Label>
                    <Input
                      id="bankCode"
                      placeholder="e.g., 011"
                      value={registrationData.bankCode}
                      onChange={(e) => {
                        setRegistrationData(prev => ({ ...prev, bankCode: e.target.value }));
                        if (errors.bankCode) setErrors(prev => ({ ...prev, bankCode: "" }));
                      }}
                      className={errors.bankCode ? "border-destructive" : ""}
                    />
                    {errors.bankCode && (
                      <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                        <AlertCircle size={14} />
                        {errors.bankCode}
                      </p>
                    )}
                  </div>
                </>
              )}

              {registrationData.userType === "cooperative" && (
                <>
                  <div>
                    <Label htmlFor="cooperativeName">Cooperative Name *</Label>
                    <Input
                      id="cooperativeName"
                      placeholder="Enter cooperative name"
                      value={registrationData.cooperativeName}
                      onChange={(e) => {
                        setRegistrationData(prev => ({ ...prev, cooperativeName: e.target.value }));
                        if (errors.cooperativeName) setErrors(prev => ({ ...prev, cooperativeName: "" }));
                      }}
                      className={errors.cooperativeName ? "border-destructive" : ""}
                    />
                    {errors.cooperativeName && (
                      <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                        <AlertCircle size={14} />
                        {errors.cooperativeName}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="cooperativeId">Cooperative Registration ID *</Label>
                    <Input
                      id="cooperativeId"
                      placeholder="Enter registration ID"
                      value={registrationData.cooperativeId}
                      onChange={(e) => {
                        setRegistrationData(prev => ({ ...prev, cooperativeId: e.target.value }));
                        if (errors.cooperativeId) setErrors(prev => ({ ...prev, cooperativeId: "" }));
                      }}
                      className={errors.cooperativeId ? "border-destructive" : ""}
                    />
                    {errors.cooperativeId && (
                      <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                        <AlertCircle size={14} />
                        {errors.cooperativeId}
                      </p>
                    )}
                  </div>
                </>
              )}

              {registrationData.userType === "farmer" && (
                <>
                  <div>
                    <Label htmlFor="nin">National Identity Number (NIN) *</Label>
                    <Input
                      id="nin"
                      placeholder="Enter your 11-digit NIN"
                      value={registrationData.nin}
                      onChange={(e) => {
                        setRegistrationData(prev => ({ ...prev, nin: e.target.value }));
                        if (errors.nin) setErrors(prev => ({ ...prev, nin: "" }));
                      }}
                      className={errors.nin ? "border-destructive" : ""}
                    />
                    {errors.nin && (
                      <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                        <AlertCircle size={14} />
                        {errors.nin}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="bvn">Bank Verification Number (BVN) *</Label>
                    <Input
                      id="bvn"
                      placeholder="Enter your 11-digit BVN"
                      value={registrationData.bvn}
                      onChange={(e) => {
                        setRegistrationData(prev => ({ ...prev, bvn: e.target.value }));
                        if (errors.bvn) setErrors(prev => ({ ...prev, bvn: "" }));
                      }}
                      className={errors.bvn ? "border-destructive" : ""}
                    />
                    {errors.bvn && (
                      <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                        <AlertCircle size={14} />
                        {errors.bvn}
                      </p>
                    )}
                  </div>

                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={handleStartCamera}
                    type="button"
                  >
                    <Camera size={16} className="mr-2" />
                    Verify Identity with Camera
                  </Button>
                </>
              )}

              <div className="flex items-center gap-2 p-4 bg-primary/5 rounded-lg">
                <Shield size={20} className="text-primary" />
                <p className="text-sm text-muted-foreground">
                  Your data is encrypted and secured with bank-grade security
                </p>
              </div>

              <Button 
                onClick={handleRegistration}
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : "Create Account"}
                {!isLoading && <ArrowRight size={16} className="ml-2" />}
              </Button>

              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <button
                    onClick={() => setIsSignIn(true)}
                    className="text-primary hover:underline font-medium"
                  >
                    Sign In
                  </button>
                </p>
              </div>
            </div>
          )}
        </Card>

        <div className="mt-6 text-center">
          <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
            <TrustBadge type="security" label="256-bit SSL" />
            <TrustBadge type="verified" label="CBN Compliant" />
            <TrustBadge type="rating" label="ISO 27001" />
          </div>
        </div>

      </div>
    </div>
  );
};

export default OnboardingSteps;
