import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden shadow-2xl login-green-blur border-emerald-500/30">
        <CardContent className="grid p-0 md:grid-cols-2">
          {/* Form Section */}
          <form className="p-8 md:p-10 green-blur-card backdrop-blur-sm">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to CLEANBAGE</h1>
                <p className="text-balance text-gray-700 text-lg">
                  Login to your CLEANBAGE account
                </p>
                <div className="mt-4 p-4 bg-white/80 rounded-lg border border-emerald-300 shadow-sm">
                  <p className="text-sm text-black font-bold mb-1">Demo User:</p>
                  <p className="text-sm font-semibold text-black">John Doe</p>
                  <p className="text-xs text-black font-medium">user@cleanbage.com</p>
                  <p className="text-xs text-black">Green Valley Society</p>
                </div>
              </div>
              
              {/* Email Field */}
              <div className="grid gap-3">
                <Label htmlFor="email" className="text-sm font-semibold text-gray-800">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="john.doe@cleanbage.com" 
                  required 
                  className="h-12 text-base border-gray-300 focus:border-emerald-500 focus:ring-emerald-500/20 bg-white/95 backdrop-blur-sm text-gray-800 placeholder:text-gray-500"
                />
              </div>
              
              {/* Password Field */}
              <div className="grid gap-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-semibold text-gray-800">Password</Label>
                  <a 
                    href="#" 
                    className="text-sm underline-offset-2 hover:underline text-emerald-600 hover:text-emerald-700 font-medium"
                  >
                    Forgot password?
                  </a>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  required 
                  className="h-12 text-base border-gray-300 focus:border-emerald-500 focus:ring-emerald-500/20 bg-white/95 backdrop-blur-sm text-gray-800 placeholder:text-gray-500"
                />
              </div>
              
              {/* Login Button */}
              <Button type="submit" className="w-full h-12 font-semibold bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                Login
              </Button>
              
              {/* Divider */}
              <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-gray-200">
                <span className="relative z-10 bg-white/90 px-3 text-gray-600 font-medium">
                  Or continue with
                </span>
              </div>
              
              {/* Social Login Buttons - Responsive: single column on mobile, 3 columns on larger screens */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Button variant="outline" className="w-full h-12 border-gray-300 bg-white/90 hover:bg-white/95 backdrop-blur-sm transition-all duration-300 hover:scale-105 text-gray-800">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5">
                    <path
                      d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
                      fill="currentColor"
                    />
                  </svg>
                  <span className="ml-2 sm:sr-only text-gray-800">Apple</span>
                </Button>
                <Button variant="outline" className="w-full h-12 border-gray-300 bg-white/90 hover:bg-white/95 backdrop-blur-sm transition-all duration-300 hover:scale-105 text-gray-800">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  <span className="ml-2 sm:sr-only text-gray-800">Google</span>
                </Button>
                <Button variant="outline" className="w-full h-12 border-gray-300 bg-white/90 hover:bg-white/95 backdrop-blur-sm transition-all duration-300 hover:scale-105 text-gray-800">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5">
                    <path
                      d="M6.915 4.03c-1.968 0-3.683 1.28-4.871 3.113C.704 9.208 0 11.883 0 14.449c0 .706.07 1.369.21 1.973a6.624 6.624 0 0 0 .265.86 5.297 5.297 0 0 0 .371.761c.696 1.159 1.818 1.927 3.593 1.927 1.497 0 2.633-.671 3.965-2.444.76-1.012 1.144-1.626 2.663-4.32l.756-1.339.186-.325c.061.1.121.196.183.3l2.152 3.595c.724 1.21 1.665 2.556 2.47 3.314 1.046.987 1.992 1.22 3.06 1.22 1.075 0 1.876-.355 2.455-.843a3.743 3.743 0 0 0 .81-.973c.542-.939.861-2.127.861-3.745 0-2.72-.681-5.357-2.084-7.45-1.282-1.912-2.957-2.93-4.716-2.93-1.047 0-2.088.467-3.053 1.308-.652.57-1.257 1.29-1.82 2.05-.69-.875-1.335-1.547-1.958-2.056-1.182-.966-2.315-1.303-3.454-1.303zm10.16 2.053c1.147 0 2.188.758 2.992 1.999 1.132 1.748 1.647 4.195 1.647 6.4 0 1.548-.368 2.9-1.839 2.9-.58 0-1.027-.23-1.664-1.004-.496-.601-1.343-1.878-2.832-4.358l-.617-1.028a44.908 44.908 0 0 0-1.255-1.98c.07-.109.141-.224.211-.327 1.12-1.667 2.118-2.602 3.358-2.602zm-10.201.553c1.265 0 2.058.791 2.675 1.446.307.327.737.871 1.234 1.579l-1.02 1.566c-.757 1.163-1.882 3.017-2.837 4.338-1.191 1.649-1.81 1.817-2.486 1.817-.524 0-1.038-.237-1.383-.794-.263-.426-.464-1.13-.464-2.046 0-2.221.63-4.535 1.66-6.088.454-.687.964-1.226 1.533-1.533a2.264 2.264 0 0 1 1.088-.285z"
                      fill="currentColor"
                    />
                  </svg>
                  <span className="ml-2 sm:sr-only text-gray-800">Meta</span>
                </Button>
              </div>
              
              {/* Sign Up Link */}
              <div className="text-center text-sm">
                <span className="text-gray-600">Don&apos;t have an account?{" "}</span>
                <a href="#" className="underline underline-offset-4 font-semibold hover:text-emerald-600 text-emerald-700 transition-colors">
                  Sign up
                </a>
              </div>
            </div>
          </form>
          
          {/* Image Section - Hidden on small screens, shown on medium and large */}
          <div className="relative hidden md:block bg-gradient-to-br from-emerald-50 to-blue-50">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 to-blue-400/20"></div>
            <img
              src="/placeholder.svg"
              alt="CLEANBAGE App Preview"
              className="absolute inset-0 h-full w-full object-cover opacity-80"
            />
          </div>
        </CardContent>
      </Card>
      
      {/* Terms and Privacy */}
      <div className="text-balance text-center text-xs text-gray-600 [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-emerald-600">
        By clicking continue, you agree to our{" "}
        <a href="#" className="font-medium text-emerald-700">Terms of Service</a> and{" "}
        <a href="#" className="font-medium text-emerald-700">Privacy Policy</a>.
      </div>
    </div>
  )
}
