"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { QrCode, Download, Share2, RefreshCw, User, MapPin, Star, Clock, CheckCircle, AlertTriangle } from "lucide-react"
import { toast } from "sonner"
import QRCode from "qrcode"
import UserBalance from "../UserBalance"
import { useUser } from "../../context/UserContext"
import { QRManager } from "../../lib/qrManager"

export default function UserQRDisplay({ user }) {
  const [qrData, setQrData] = useState(null)
  const [qrCodeImage, setQrCodeImage] = useState("")
  const [qrStatus, setQrStatus] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [timeUntilReactivation, setTimeUntilReactivation] = useState(null)
  const canvasRef = useRef(null)
  const { refreshUserData } = useUser()

  useEffect(() => {
    // Refresh user data when QR display loads
    refreshUserData()
  }, [])

  // Generate user's unique QR code (never changes)
  const generateUserQR = async () => {
    setIsGenerating(true)
    
    try {
      // Get the latest user data from localStorage
      const currentUserData = JSON.parse(localStorage.getItem("wasteManagementUser") || "{}")
      
      // Generate unique QR data for this user (this never changes)
      const uniqueQRData = QRManager.generateUniqueUserQR({
        id: user.id || currentUserData.id || `USER_${Date.now()}`,
        name: user.name || currentUserData.name || "User",
        email: user.email || currentUserData.email || "",
        society: user.society || currentUserData.society || "Community",
        phone: user.phone || currentUserData.phone || "",
        createdAt: currentUserData.createdAt || new Date().toISOString()
      })
      
      // Convert QR data to JSON string for QR code
      const qrDataString = JSON.stringify(uniqueQRData)
      
      // Generate real QR code image
      const qrCodeDataURL = await QRCode.toDataURL(qrDataString, {
        width: 300,
        margin: 3,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        errorCorrectionLevel: 'M'
      })
      
      setQrData(uniqueQRData)
      setQrCodeImage(qrCodeDataURL)
      
      // Get QR status
      updateQRStatus()
      
      setIsGenerating(false)
      toast.success("Your unique QR code is ready!")
    } catch (error) {
      console.error("Error generating QR code:", error)
      toast.error("Failed to generate QR code")
      setIsGenerating(false)
    }
  }

  // Update QR status information
  const updateQRStatus = () => {
    if (!user.id) return
    
    const status = QRManager.getQRStatus(user.id)
    setQrStatus(status)
    
    const timeRemaining = QRManager.getTimeUntilReactivation(user.id)
    setTimeUntilReactivation(timeRemaining)
  }

  // Auto-generate QR on component mount and set up status updates
  useEffect(() => {
    generateUserQR()
    
    // Update QR status every minute
    const statusInterval = setInterval(updateQRStatus, 60000)
    
    return () => clearInterval(statusInterval)
  }, [])

  // Create QR code download
  const downloadQR = async () => {
    if (!qrData || !qrCodeImage) return
    
    try {
      // Create a link element and trigger download
      const link = document.createElement('a')
      link.href = qrCodeImage
      link.download = `cleanbage-qr-${qrData.qrId}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      toast.success("QR code image downloaded!")
    } catch (error) {
      console.error("Download error:", error)
      toast.error("Failed to download QR code")
    }
  }

  const shareQR = () => {
    if (!qrData) return
    
    const shareText = `My CleanBage Unique QR Code\nName: ${qrData.userName}\nSociety: ${qrData.society}\nQR ID: ${qrData.qrId}`
    
    if (navigator.share) {
      navigator.share({
        title: 'CleanBage User QR Code',
        text: shareText
      }).then(() => {
        toast.success("QR code shared successfully!")
      }).catch(() => {
        // Fallback to clipboard
        navigator.clipboard.writeText(shareText)
        toast.success("QR code info copied to clipboard!")
      })
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(shareText)
      toast.success("QR code info copied to clipboard!")
    }
  }

  if (!qrData) {
    return (
      <div className="min-h-screen p-4">
        <div className="max-w-md mx-auto pt-8">
          <Card className="page-enhanced-blur">
            <CardContent className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Generating your QR code...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-2 sm:p-4 lg:p-6">
      <div className="max-w-md mx-auto space-y-4 sm:space-y-6 pt-4 sm:pt-8">
        {/* Header */}
        <Card className="page-enhanced-blur">
          <CardHeader className="text-center p-4 sm:p-6">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-emerald-600 rounded-full mx-auto mb-3 sm:mb-4 flex items-center justify-center">
              <QrCode className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
            </div>
            <CardTitle className="text-xl sm:text-2xl font-bold text-emerald-800">
              Your QR Code
            </CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Show this to collectors for verification
            </CardDescription>
          </CardHeader>
        </Card>

        {/* User Info - Responsive */}
        <Card className="page-enhanced-blur">
          <CardContent className="p-4 sm:p-6">
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <User className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600" />
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                    {qrData.userName}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600 truncate">
                    {qrData.userEmail}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 sm:space-x-3">
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600" />
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-gray-900 text-sm sm:text-base truncate">
                    {qrData.society}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600">Community</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Star className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600" />
                  <div className="scale-75 sm:scale-100 origin-left">
                    <UserBalance showAnimation={true} />
                  </div>
                </div>
                <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 text-xs sm:text-sm">
                  Unique QR
                </Badge>
              </div>
              
              {/* Debug Test Section - Remove in production */}
              <div className="pt-4 border-t border-gray-200 space-y-2">
                <Button 
                  onClick={() => {
                    const userId = user.id || user.userId
                    console.log("Manually checking notifications for user:", userId)
                    
                    // Check localStorage for pending notifications
                    const pendingNotificationsKey = `pendingNotifications_${userId}`
                    const notifications = JSON.parse(localStorage.getItem(pendingNotificationsKey) || '[]')
                    
                    if (notifications.length > 0) {
                      console.log("Found pending notifications:", notifications)
                      notifications.forEach(notification => {
                        toast.success(notification.message, {
                          id: `notification-${notification.id}`,
                          duration: 5000
                        })
                      })
                      localStorage.removeItem(pendingNotificationsKey)
                      setTimeout(() => refreshUserData(), 1000)
                    } else {
                      toast.info("No pending notifications found")
                    }
                  }}
                  variant="outline"
                  size="sm"
                  className="w-full text-purple-600 border-purple-200 hover:bg-purple-50"
                >
                  Check for Notifications
                </Button>
                
                <Button 
                  onClick={() => {
                    const userId = user.id || user.userId
                    console.log("Forcing balance sync for user:", userId)
                    
                    // Import forceBalanceSync function
                    import('../../lib/balanceUtils').then(({ forceBalanceSync }) => {
                      const newBalance = forceBalanceSync(userId)
                      toast.success(`Balance synced! Current balance: ${newBalance}`)
                      setTimeout(() => refreshUserData(), 1000)
                    })
                  }}
                  variant="outline"
                  size="sm"
                  className="w-full text-blue-600 border-blue-200 hover:bg-blue-50"
                >
                  Force Balance Sync
                </Button>
                
                <Button 
                  onClick={() => {
                    const userId = user.id || user.userId
                    console.log("Adding test activity for user:", userId)
                    
                    // Import addTestActivity function
                    import('../../lib/balanceUtils').then(({ addTestActivity }) => {
                      const testActivity = addTestActivity(userId)
                      if (testActivity) {
                        toast.success(`Test activity added! +3 coins`)
                        setTimeout(() => refreshUserData(), 1000)
                      }
                    })
                  }}
                  variant="outline"
                  size="sm"
                  className="w-full text-green-600 border-green-200 hover:bg-green-50"
                >
                  Add Test Activity
                </Button>
                
                <p className="text-xs text-gray-500 mt-1 text-center">
                  Debug: Check for pending balance updates and notifications
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* QR Status */}
        {qrStatus && (
          <Card className={`border-2 ${qrStatus.active ? 'border-green-200 bg-green-50' : 'border-orange-200 bg-orange-50'}`}>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                {qrStatus.active ? (
                  <CheckCircle className="h-6 w-6 text-green-600" />
                ) : (
                  <Clock className="h-6 w-6 text-orange-600" />
                )}
                <div className="flex-1">
                  <p className={`font-semibold ${qrStatus.active ? 'text-green-800' : 'text-orange-800'}`}>
                    {qrStatus.active ? 'QR Code Active' : 'QR Code Deactivated'}
                  </p>
                  <p className={`text-sm ${qrStatus.active ? 'text-green-600' : 'text-orange-600'}`}>
                    {qrStatus.active 
                      ? 'Ready to be scanned by collectors' 
                      : `Reactivates ${timeUntilReactivation ? `in ${timeUntilReactivation.formattedTime}` : 'soon'}`
                    }
                  </p>
                </div>
              </div>
              
              {qrStatus.scanHistory.totalScans > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Total Scans</p>
                      <p className="font-semibold">{qrStatus.scanHistory.totalScans}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Last Points</p>
                      <p className="font-semibold">+{qrStatus.scanHistory.lastPointsAwarded}</p>
                    </div>
                  </div>
                  {qrStatus.scanHistory.lastScannedAt && (
                    <p className="text-xs text-gray-500 mt-2">
                      Last scanned: {new Date(qrStatus.scanHistory.lastScannedAt).toLocaleString()}
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* QR Code Display */}
        <Card className="page-enhanced-blur">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              {/* QR Code Image */}
              <div className="bg-white p-6 rounded-lg shadow-inner mx-auto inline-block">
                {qrCodeImage ? (
                  <img 
                    src={qrCodeImage} 
                    alt="User QR Code" 
                    className="w-64 h-64 mx-auto"
                    style={{ imageRendering: 'pixelated' }}
                  />
                ) : (
                  <div className="w-64 h-64 mx-auto flex items-center justify-center bg-gray-100 rounded">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
                  </div>
                )}
              </div>
              
              {/* QR Info */}
              <div className="text-sm text-gray-600 space-y-1">
                <p>QR ID: {qrData.qrId}</p>
                <p>User ID: {qrData.userId}</p>
                <p>Created: {new Date(qrData.createdAt).toLocaleString()}</p>
                <p className="text-emerald-600 font-medium">
                  ✅ This QR never expires - it's your permanent identifier
                </p>
                <p className="text-orange-600 font-medium text-xs">
                  ⏰ Deactivates for 20 hours after each scan
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Card className="page-enhanced-blur">
          <CardContent className="p-6">
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  onClick={downloadQR} 
                  variant="outline" 
                  className="w-full"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button 
                  onClick={shareQR} 
                  variant="outline" 
                  className="w-full"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
              
              <Button 
                onClick={generateUserQR} 
                disabled={isGenerating}
                className="w-full bg-emerald-600 hover:bg-emerald-700"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
                Regenerate QR Code
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="page-enhanced-blur">
          <CardContent className="p-6">
            <h3 className="font-semibold text-gray-900 mb-3">How to use your QR Code:</h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• Show this QR code to collectors when they arrive</li>
              <li>• Collectors can scan it to verify your identity</li>
              <li>• Your points and level will be visible to them</li>
              <li>• QR code expires in 24 hours for security</li>
              <li>• Generate a new one daily or as needed</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
