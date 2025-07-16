"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Badge } from "./ui/badge"
import { Alert, AlertDescription } from "./ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { User, Truck, Shield, AlertTriangle, UserPlus, LogIn } from "lucide-react"
import { AuthService } from "../lib/auth"
import { toast } from "sonner"

export function EnhancedLoginForm({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  
  // Login form state
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
    role: "user"
  })
  
  // Signup form state
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    society: "",
    phone: "",
    role: "user"
  })

  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const user = await AuthService.authenticateUser(loginData)
      toast.success(`Welcome back, ${user.name}!`)
      onLogin(user)
    } catch (err) {
      setError(err.message)
      toast.error(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Validate passwords match
      if (signupData.password !== signupData.confirmPassword) {
        throw new Error("Passwords do not match")
      }

      // Validate email and password
      AuthService.validateEmail(signupData.email)
      AuthService.validatePassword(signupData.password)

      const user = await AuthService.registerUser(signupData)
      toast.success(`Welcome to CleanBage, ${user.name}!`)
      onLogin(user)
    } catch (err) {
      setError(err.message)
      toast.error(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const fillDemoCredentials = (demo) => {
    setLoginData({
      email: demo.email,
      password: demo.password,
      role: demo.role === "both" ? "user" : demo.role
    })
    setIsLogin(true)
  }

  const demoCredentials = [
    {
      type: "Regular User",
      email: "user@cleanbage.com",
      password: "user123",
      role: "user",
      icon: <User className="h-4 w-4" />,
      badge: "User"
    },
    {
      type: "Authorized Collector",
      email: "collector@cleanbage.com",
      password: "collector123",
      role: "collector",
      icon: <Truck className="h-4 w-4" />,
      badge: "Collector"
    },
    {
      type: "Multi-Role User",
      email: "both@cleanbage.com",
      password: "both123",
      role: "both",
      icon: <Shield className="h-4 w-4" />,
      badge: "Both Roles"
    },
    {
      type: "Unauthorized User",
      email: "unauthorized@cleanbage.com",
      password: "unauth123",
      role: "collector",
      icon: <AlertTriangle className="h-4 w-4" />,
      badge: "Unauthorized",
      isUnauthorized: true
    }
  ]

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <Card className="page-enhanced-blur">
          <CardHeader className="text-center">
            <div className="w-20 h-20 bg-white rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg ring-4 ring-emerald-500/20 logo-float">
              <img 
                src="/images/cleanbage-logo.png" 
                alt="CleanBage Logo" 
                className="w-16 h-16 object-contain"
              />
            </div>
            <CardTitle className="text-2xl font-bold text-emerald-800">
              Welcome to CleanBage
            </CardTitle>
            <CardDescription>
              Smart Waste Management for Your Community
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Login/Signup Tabs */}
        <Card className="page-enhanced-blur">
          <CardContent className="p-6">
            <Tabs value={isLogin ? "login" : "signup"} onValueChange={(value) => setIsLogin(value === "login")}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login" className="flex items-center space-x-2">
                  <LogIn className="h-4 w-4" />
                  <span>Sign In</span>
                </TabsTrigger>
                <TabsTrigger value="signup" className="flex items-center space-x-2">
                  <UserPlus className="h-4 w-4" />
                  <span>Sign Up</span>
                </TabsTrigger>
              </TabsList>

              {/* Login Tab */}
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="Enter your email"
                      value={loginData.email}
                      onChange={(e) => setLoginData(prev => ({...prev, email: e.target.value}))}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="Enter your password"
                      value={loginData.password}
                      onChange={(e) => setLoginData(prev => ({...prev, password: e.target.value}))}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-role">Sign in as</Label>
                    <Select value={loginData.role} onValueChange={(value) => setLoginData(prev => ({...prev, role: value}))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4" />
                            <span>Regular User</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="collector">
                          <div className="flex items-center space-x-2">
                            <Truck className="h-4 w-4" />
                            <span>Waste Collector</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {loginData.role === "collector" && (
                    <Alert className="border-amber-200 bg-amber-50">
                      <Shield className="h-4 w-4" />
                      <AlertDescription className="text-amber-800">
                        <strong>Collector Access:</strong> Only community-authorized collectors can access collector features. Unauthorized access attempts will be denied.
                      </AlertDescription>
                    </Alert>
                  )}

                  {error && (
                    <Alert variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button 
                    type="submit" 
                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              </TabsContent>

              {/* Signup Tab */}
              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Full Name</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="Enter your full name"
                      value={signupData.name}
                      onChange={(e) => setSignupData(prev => ({...prev, name: e.target.value}))}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="Enter your email"
                      value={signupData.email}
                      onChange={(e) => setSignupData(prev => ({...prev, email: e.target.value}))}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-society">Society/Community Name</Label>
                    <Input
                      id="signup-society"
                      type="text"
                      placeholder="Enter your society name"
                      value={signupData.society}
                      onChange={(e) => setSignupData(prev => ({...prev, society: e.target.value}))}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-phone">Phone Number</Label>
                    <Input
                      id="signup-phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      value={signupData.phone}
                      onChange={(e) => setSignupData(prev => ({...prev, phone: e.target.value}))}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="Create a password (min. 6 characters)"
                      value={signupData.password}
                      onChange={(e) => setSignupData(prev => ({...prev, password: e.target.value}))}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-confirm-password">Confirm Password</Label>
                    <Input
                      id="signup-confirm-password"
                      type="password"
                      placeholder="Confirm your password"
                      value={signupData.confirmPassword}
                      onChange={(e) => setSignupData(prev => ({...prev, confirmPassword: e.target.value}))}
                      required
                    />
                  </div>

                  <Alert className="border-blue-200 bg-blue-50">
                    <User className="h-4 w-4" />
                    <AlertDescription className="text-blue-800">
                      <strong>New Registration:</strong> All new accounts are created as regular users. To become a collector, contact your community administrator for authorization.
                    </AlertDescription>
                  </Alert>

                  {error && (
                    <Alert variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button 
                    type="submit" 
                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Demo Credentials (only show for login) */}
        {isLogin && (
          <Card className="page-enhanced-blur">
            <CardHeader>
              <CardTitle className="text-sm font-medium">Demo Accounts</CardTitle>
              <CardDescription className="text-xs">
                Click to auto-fill credentials for testing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {demoCredentials.map((demo, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className={`w-full justify-between text-xs ${
                    demo.isUnauthorized ? 'border-red-200 hover:bg-red-50' : ''
                  }`}
                  onClick={() => fillDemoCredentials(demo)}
                >
                  <div className="flex items-center space-x-2">
                    {demo.icon}
                    <span>{demo.type}</span>
                  </div>
                  <Badge 
                    variant={demo.isUnauthorized ? "destructive" : "secondary"}
                    className="text-xs"
                  >
                    {demo.badge}
                  </Badge>
                </Button>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Security Information */}
        <Card className="bg-blue-50/90 border-blue-200 backdrop-blur-sm">
          <CardContent className="p-4">
            <h4 className="font-medium text-blue-800 mb-2">Security & Authorization</h4>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• <strong>Role Verification:</strong> User credentials cannot access collector features</li>
              <li>• <strong>Collector Authorization:</strong> Only community-verified collectors can access collector dashboard</li>
              <li>• <strong>Secure Registration:</strong> New accounts require community verification</li>
              <li>• <strong>Data Protection:</strong> All communications are encrypted and secure</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
