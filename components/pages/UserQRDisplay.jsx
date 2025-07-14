"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { QrCode, Download, Share2, RefreshCw, User, MapPin, Star } from "lucide-react"
import { toast } from "sonner"
import QRCode from "qrcode"
import UserBalance from "../UserBalance"
import { useUser } from "../../context/UserContext"

export default function UserQRDisplay({ user }) {
  const [qrData, setQrData] = useState(null)
  const [qrCodeImage, setQrCodeImage] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const canvasRef = useRef(null)
  const { refreshUserData } = useUser()

  useEffect(() => {
    // Refresh user data when QR display loads
    refreshUserData()
  }, [])

  // Generate user QR code data and real QR code
  const generateUserQR = async () => {
    setIsGenerating(true)
    
    try {
      // Get the latest user data from localStorage
      const currentUserData = JSON.parse(localStorage.getItem("wasteManagementUser") || "{}")
      
      // Create user data for QR code
      const userData = {
        type: "user_identification",
        userId: user.id || currentUserData.userId || `USER_${Date.now()}`,
        userName: user.name || currentUserData.name || "User",
        society: user.society || currentUserData.society || "Community",
        email: user.email || currentUserData.email || "",
        phone: user.phone || currentUserData.phone || "",
        role: user.selectedRole || currentUserData.selectedRole || "user",
        points: currentUserData.points || user.points || 0,
        level: user.level || "Bronze",
        generatedAt: new Date().toISOString(),
        validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // Valid for 24 hours
      }
      
      // Convert user data to JSON string for QR code
      const qrDataString = JSON.stringify(userData)
      
      // Generate real QR code image
      const qrCodeDataURL = await QRCode.toDataURL(qrDataString, {
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      })
      
      setQrData(userData)
      setQrCodeImage(qrCodeDataURL)
      setIsGenerating(false)
      toast.success("Your QR code has been generated!")
    } catch (error) {
      console.error("Error generating QR code:", error)
      toast.error("Failed to generate QR code")
      setIsGenerating(false)
    }
  }

  // Auto-generate QR on component mount
  useEffect(() => {
    generateUserQR()
  }, [])

  // Create QR code download
  const downloadQR = async () => {
    if (!qrData || !qrCodeImage) return
    
    try {
      // Create a link element and trigger download
      const link = document.createElement('a')
      link.href = qrCodeImage
      link.download = `cleanbage-qr-${qrData.userId}.png`
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
    
    const shareText = `My CleanBage User QR Code\nName: ${qrData.userName}\nSociety: ${qrData.society}\nLevel: ${qrData.level}\nPoints: ${qrData.points}`
    
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
    <div className="min-h-screen p-4">
      <div className="max-w-md mx-auto space-y-6 pt-8">
        {/* Header */}
        <Card className="page-enhanced-blur">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-emerald-600 rounded-full mx-auto mb-4 flex items-center justify-center">
              <QrCode className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-emerald-800">
              Your QR Code
            </CardTitle>
            <CardDescription>
              Show this to collectors for verification
            </CardDescription>
          </CardHeader>
        </Card>

        {/* User Info */}
        <Card className="page-enhanced-blur">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-emerald-600" />
                <div>
                  <p className="font-semibold text-gray-900">{qrData.userName}</p>
                  <p className="text-sm text-gray-600">{qrData.email}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-emerald-600" />
                <div>
                  <p className="font-medium text-gray-900">{qrData.society}</p>
                  <p className="text-sm text-gray-600">Community</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-emerald-600" />
                  <UserBalance showAnimation={true} />
                </div>
                <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
                  {qrData.level} Level
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

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
                <p>User ID: {qrData.userId}</p>
                <p>Generated: {new Date(qrData.generatedAt).toLocaleString()}</p>
                <p className="text-emerald-600 font-medium">
                  Valid until: {new Date(qrData.validUntil).toLocaleString()}
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
