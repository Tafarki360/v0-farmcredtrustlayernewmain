import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuth } from '@/contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { FarmCredLogo } from '@/components/FarmCredLogo'
import { ContactInfo } from '@/components/ContactInfo'
import { supabase } from '@/integrations/supabase/client'

const Auth = () => {
  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()
  const [loginData, setLoginData] = useState({ email: '', password: '', userType: '' })
  const [signupData, setSignupData] = useState({ 
    email: '', 
    password: '', 
    confirmPassword: '', 
    fullName: '', 
    phone: '', 
    userType: '',
    // Farmer fields
    nin: '',
    bvn: '',
    farmLocation: '',
    farmSize: '',
    // Cooperative fields
    cooperativeName: '',
    cacNumber: '',
    cooperativeRegNumber: '',
    // Bank fields
    bankName: '',
    bankCode: ''
  })
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Comprehensive validation
    if (!loginData.email.trim()) {
      toast.error('Email is required')
      return
    }
    
    if (!loginData.password.trim()) {
      toast.error('Password is required')
      return
    }

    if (!loginData.userType.trim()) {
      toast.error('Please select your account type')
      return
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginData.email)) {
      toast.error('Please enter a valid email address')
      return
    }
    
    if (loginData.password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }
    
    setLoading(true)
    try {
      const { error } = await signIn(loginData.email, loginData.password)
      if (error) {
        toast.error(error.message)
      } else {
        toast.success('Logged in successfully!')
        // Navigate based on user type
        switch (loginData.userType) {
          case 'farmer':
            navigate('/dashboard')
            break
          case 'cooperative':
            navigate('/cooperative')
            break
          case 'bank':
            navigate('/lender')
            break
          default:
            navigate('/portals')
        }
      }
    } catch (error) {
      toast.error('An error occurred during login')
    } finally {
      setLoading(false)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Comprehensive validation
    if (!signupData.fullName.trim()) {
      toast.error('Full name is required')
      return
    }

    if (!signupData.phone.trim()) {
      toast.error('Phone number is required')
      return
    }

    if (!signupData.userType.trim()) {
      toast.error('Please select your account type')
      return
    }
    
    if (!signupData.email.trim()) {
      toast.error('Email is required')
      return
    }
    
    if (!signupData.password.trim()) {
      toast.error('Password is required')
      return
    }
    
    if (!signupData.confirmPassword.trim()) {
      toast.error('Please confirm your password')
      return
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signupData.email)) {
      toast.error('Please enter a valid email address')
      return
    }
    
    if (signupData.password.length < 8) {
      toast.error('Password must be at least 8 characters long')
      return
    }
    
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(signupData.password)) {
      toast.error('Password must contain at least one uppercase letter, one lowercase letter, and one number')
      return
    }
    
    if (signupData.password !== signupData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    // User type specific validations
    if (signupData.userType === 'farmer') {
      if (!signupData.nin.trim()) {
        toast.error('NIN is required for farmers')
        return
      }
      if (!signupData.bvn.trim()) {
        toast.error('BVN is required for farmers')
        return
      }
      if (!/^\d{11}$/.test(signupData.nin)) {
        toast.error('NIN must be 11 digits')
        return
      }
      if (!/^\d{11}$/.test(signupData.bvn)) {
        toast.error('BVN must be 11 digits')
        return
      }
    }

    if (signupData.userType === 'cooperative') {
      if (!signupData.cooperativeName.trim()) {
        toast.error('Cooperative name is required')
        return
      }
      if (!signupData.cacNumber.trim()) {
        toast.error('CAC number is required')
        return
      }
      if (!signupData.cooperativeRegNumber.trim()) {
        toast.error('Cooperative registration number is required')
        return
      }
      if (!/^RC\d{6,8}$/.test(signupData.cacNumber)) {
        toast.error('CAC number must follow format RC1234567')
        return
      }
      if (!/^COOP\/\d{4}\/\d{6}$/.test(signupData.cooperativeRegNumber)) {
        toast.error('Cooperative registration number must follow format COOP/2024/123456')
        return
      }
    }

    if (signupData.userType === 'bank') {
      if (!signupData.bankName.trim()) {
        toast.error('Bank name is required')
        return
      }
      if (!signupData.bankCode.trim()) {
        toast.error('Bank code is required')
        return
      }
    }
    
    setLoading(true)
    try {
      const { error, data } = await signUp(signupData.email, signupData.password)
      if (error) {
        toast.error(error.message)
      } else {
        // Create user profile with additional data
        if (data.user) {
          const profileData = {
            user_id: data.user.id,
            full_name: signupData.fullName,
            phone: signupData.phone,
            user_type: signupData.userType,
            nin: signupData.userType === 'farmer' ? signupData.nin : null,
            bvn: signupData.userType === 'farmer' ? signupData.bvn : null,
            farm_location: signupData.farmLocation || null,
            farm_size: signupData.farmSize || null,
            cooperative_name: signupData.userType === 'cooperative' ? signupData.cooperativeName : null,
            cac_number: signupData.userType === 'cooperative' ? signupData.cacNumber : null,
            cooperative_reg_number: signupData.userType === 'cooperative' ? signupData.cooperativeRegNumber : null,
            bank_name: signupData.userType === 'bank' ? signupData.bankName : null,
            bank_code: signupData.userType === 'bank' ? signupData.bankCode : null,
          }

          const { error: profileError } = await supabase
            .from('profiles')
            .insert([profileData])

          if (profileError) {
            console.error('Profile creation error:', profileError)
          }

          // Start verification process for farmers and cooperatives
          if (signupData.userType === 'farmer' && signupData.nin && signupData.bvn) {
            try {
              const { error: verifyError } = await supabase.functions.invoke('verify-nin-bvn', {
                body: {
                  nin: signupData.nin,
                  bvn: signupData.bvn,
                  userId: data.user.id
                }
              })
              
              if (verifyError) {
                console.error('Verification error:', verifyError)
              } else {
                toast.success('NIN and BVN verification initiated!')
              }
            } catch (verifyError) {
              console.error('Verification request failed:', verifyError)
            }
          }

          if (signupData.userType === 'cooperative') {
            try {
              const { error: verifyError } = await supabase.functions.invoke('verify-cac', {
                body: {
                  cacNumber: signupData.cacNumber,
                  cooperativeRegNumber: signupData.cooperativeRegNumber,
                  cooperativeName: signupData.cooperativeName,
                  userId: data.user.id
                }
              })
              
              if (verifyError) {
                console.error('CAC verification error:', verifyError)
              } else {
                toast.success('CAC and cooperative registration verification initiated!')
              }
            } catch (verifyError) {
              console.error('CAC verification request failed:', verifyError)
            }
          }
        }

        toast.success('Account created successfully! Please check your email to confirm your account.')
      }
    } catch (error) {
      toast.error('An error occurred during signup')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-primary/5">
      <div className="bg-background border-b border-border p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-center">
          <FarmCredLogo size="lg" />
        </div>
      </div>

      <div className="max-w-md mx-auto p-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Access FarmCred Portal</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      value={loginData.email}
                      onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      value={loginData.password}
                      onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-usertype">Account Type</Label>
                    <select
                      id="login-usertype"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={loginData.userType}
                      onChange={(e) => setLoginData({...loginData, userType: e.target.value})}
                      required
                    >
                      <option value="">Select account type</option>
                      <option value="farmer">Farmer</option>
                      <option value="cooperative">Cooperative</option>
                      <option value="bank">Financial Institution</option>
                    </select>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={loading}
                  >
                    {loading ? 'Logging in...' : 'Login'}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-fullname">Full Name</Label>
                    <Input
                      id="signup-fullname"
                      type="text"
                      value={signupData.fullName}
                      onChange={(e) => setSignupData({...signupData, fullName: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      value={signupData.email}
                      onChange={(e) => setSignupData({...signupData, email: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-phone">Phone Number</Label>
                    <Input
                      id="signup-phone"
                      type="tel"
                      placeholder="+234 8XX XXX XXXX"
                      value={signupData.phone}
                      onChange={(e) => setSignupData({...signupData, phone: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-usertype">Account Type</Label>
                    <select
                      id="signup-usertype"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={signupData.userType}
                      onChange={(e) => setSignupData({...signupData, userType: e.target.value})}
                      required
                    >
                      <option value="">Select account type</option>
                      <option value="farmer">Farmer</option>
                      <option value="cooperative">Cooperative</option>
                      <option value="bank">Financial Institution</option>
                    </select>
                  </div>

                  {/* Farmer specific fields */}
                  {signupData.userType === 'farmer' && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="signup-nin">NIN (National Identification Number)</Label>
                        <Input
                          id="signup-nin"
                          type="text"
                          placeholder="12345678901"
                          value={signupData.nin}
                          onChange={(e) => setSignupData({...signupData, nin: e.target.value})}
                          maxLength={11}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-bvn">BVN (Bank Verification Number)</Label>
                        <Input
                          id="signup-bvn"
                          type="text"
                          placeholder="12345678901"
                          value={signupData.bvn}
                          onChange={(e) => setSignupData({...signupData, bvn: e.target.value})}
                          maxLength={11}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-farmlocation">Farm Location (Optional)</Label>
                        <Input
                          id="signup-farmlocation"
                          type="text"
                          placeholder="e.g., Funtua, Katsina State"
                          value={signupData.farmLocation}
                          onChange={(e) => setSignupData({...signupData, farmLocation: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-farmsize">Farm Size (Optional)</Label>
                        <Input
                          id="signup-farmsize"
                          type="text"
                          placeholder="e.g., 2.5 hectares"
                          value={signupData.farmSize}
                          onChange={(e) => setSignupData({...signupData, farmSize: e.target.value})}
                        />
                      </div>
                    </>
                  )}

                  {/* Cooperative specific fields */}
                  {signupData.userType === 'cooperative' && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="signup-coopname">Cooperative Name</Label>
                        <Input
                          id="signup-coopname"
                          type="text"
                          placeholder="e.g., Funtua Farmers Cooperative Society"
                          value={signupData.cooperativeName}
                          onChange={(e) => setSignupData({...signupData, cooperativeName: e.target.value})}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-cac">CAC Registration Number</Label>
                        <Input
                          id="signup-cac"
                          type="text"
                          placeholder="RC1234567"
                          value={signupData.cacNumber}
                          onChange={(e) => setSignupData({...signupData, cacNumber: e.target.value})}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-coopreg">Cooperative Registration Number</Label>
                        <Input
                          id="signup-coopreg"
                          type="text"
                          placeholder="COOP/2024/123456"
                          value={signupData.cooperativeRegNumber}
                          onChange={(e) => setSignupData({...signupData, cooperativeRegNumber: e.target.value})}
                          required
                        />
                      </div>
                    </>
                  )}

                  {/* Bank specific fields */}
                  {signupData.userType === 'bank' && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="signup-bankname">Bank Name</Label>
                        <Input
                          id="signup-bankname"
                          type="text"
                          placeholder="e.g., First Bank of Nigeria"
                          value={signupData.bankName}
                          onChange={(e) => setSignupData({...signupData, bankName: e.target.value})}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-bankcode">Bank Code</Label>
                        <Input
                          id="signup-bankcode"
                          type="text"
                          placeholder="e.g., 011"
                          value={signupData.bankCode}
                          onChange={(e) => setSignupData({...signupData, bankCode: e.target.value})}
                          required
                        />
                      </div>
                    </>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      value={signupData.password}
                      onChange={(e) => setSignupData({...signupData, password: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={signupData.confirmPassword}
                      onChange={(e) => setSignupData({...signupData, confirmPassword: e.target.value})}
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={loading}
                  >
                    {loading ? 'Creating Account...' : 'Sign Up'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="text-center mt-8">
          <Card className="p-4 bg-secondary/20">
            <ContactInfo variant="card" />
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Auth
