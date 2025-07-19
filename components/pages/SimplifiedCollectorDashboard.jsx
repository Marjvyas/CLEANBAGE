"use client"

import { useState, useEffect, useRef } from "react"
import { Camera, QrCode, Users, Award, AlertCircle, CheckCircle, Clock, Zap } from "lucide-react"
import { Button } from "../ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Alert, AlertDescription } from "../ui/alert"
import { Badge } from "../ui/badge"
import { toast } from "sonner"
import QrScanner from "qr-scanner"
import { updateUserBalance } from "../../lib/balanceUtils"
import { useUser } from "../../context/UserContext"
import { QRManager } from "../../lib/qrManager"
import { triggerCrossUserNotification } from "../../lib/balanceUtils"

export default function SimplifiedCollectorDashboard({ user }) {
  const [isScanning, setIsScanning] = useState(false)
  const [scanResult, setScanResult] = useState("")
  const [lastScanInfo, setLastScanInfo] = useState(null)
  const [scanHistory, setScanHistory] = useState([])
  const [error, setError] = useState("")
  const videoRef = useRef(null)
  const scannerRef = useRef(null)
  const { updateUserBalance: updateBalance } = useUser()

  // Load scan history on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('collectorScanHistory')
    if (savedHistory) {
      setScanHistory(JSON.parse(savedHistory))
    }
  }, [])

  // Update relative time display every minute
  useEffect(() => {
    const interval = setInterval(() => {
      // Force re-render to update relative times
      setScanHistory(prev => [...prev])
      setLastScanInfo(prev => prev ? {...prev} : null)
    }, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [])

  const getRelativeTime = (timestamp) => {
    const now = new Date()
    const scanTime = new Date(timestamp)
    const diffInSeconds = Math.floor((now - scanTime) / 1000)
    
    if (diffInSeconds < 60) {
      return `${diffInSeconds} seconds ago`
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60)
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600)
      return `${hours} hour${hours > 1 ? 's' : ''} ago`
    } else {
      const days = Math.floor(diffInSeconds / 86400)
      return `${days} day${days > 1 ? 's' : ''} ago`
    }
  }

  const formatExactTime = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
      month: 'short',
      day: 'numeric'
    })
  }

  const startScanning = async () => {
    try {
      setError("")
      setIsScanning(true)
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment" } 
      })
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
        
        scannerRef.current = new QrScanner(
          videoRef.current,
          (result) => handleQRScanResult(result.data),
          {
            highlightScanRegion: true,
            highlightCodeOutline: true,
          }
        )
        
        await scannerRef.current.start()
      }
    } catch (err) {
      console.error("Camera access error:", err)
      setError("Unable to access camera. Please check permissions.")
      setIsScanning(false)
    }
  }

  const stopScanning = () => {
    if (scannerRef.current) {
      scannerRef.current.stop()
      scannerRef.current.destroy()
      scannerRef.current = null
    }
    
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks()
      tracks.forEach(track => track.stop())
      videoRef.current.srcObject = null
    }
    
    setIsScanning(false)
  }

  const handleQRScanResult = async (data) => {
    try {
      setScanResult(data)
      
      // Parse QR data
      const qrData = JSON.parse(data)
      const userId = qrData.userId || qrData.id
      const scanTimestamp = new Date().toISOString()
      
      if (!userId) {
        toast.error("Invalid QR code format", { id: `error-${Date.now()}` })
        return
      }

      // Check if QR is currently active (not deactivated)
      const qrStatus = QRManager.isQRActive(userId)
      
      if (!qrStatus.active) {
        const timeRemaining = QRManager.getTimeUntilReactivation(userId)
        toast.error(`QR code is deactivated. Reactivates in ${timeRemaining?.formattedTime || qrStatus.hoursRemaining + 'h'}`, { 
          id: `deactivated-${Date.now()}` 
        })
        return
      }

      // Award 3 points (removed daily limit check as QR deactivation handles this)
      const pointsAwarded = 3
      await updateUserBalance(userId, pointsAwarded)
      
      // Deactivate QR for 20 hours
      QRManager.deactivateQR(userId, user.name || 'Collector', pointsAwarded)
      
      // Create scan information
      const newScan = {
        id: Date.now(),
        userId,
        userName: qrData.userName || qrData.name || 'Unknown User',
        timestamp: scanTimestamp,
        pointsAwarded,
        qrStatus: 'deactivated_for_20h'
      }
      
      // Set last scan info for display
      setLastScanInfo(newScan)
      
      // Add to scan history
      const updatedHistory = [newScan, ...scanHistory].slice(0, 10)
      setScanHistory(updatedHistory)
      localStorage.setItem('collectorScanHistory', JSON.stringify(updatedHistory))
      
      // Show success message with deactivation info
      toast.success(`Successfully awarded ${pointsAwarded} points to ${qrData.userName || qrData.name || 'user'}! QR deactivated for 20 hours.`, {
        id: `success-${Date.now()}`
      })
      
      // Stop scanning
      stopScanning()
      
    } catch (err) {
      console.error("QR processing error:", err)
      toast.error("Invalid QR code format", { id: `invalid-${Date.now()}` })
    }
  }

  // Test function for cross-user notifications
  const testCrossUserNotification = () => {
    const testUserId = "test-user-123"
    console.log("Testing cross-user notification for test user:", testUserId)
    triggerCrossUserNotification(testUserId, 3)
    toast.success("Test notification sent to test user!")
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="page-enhanced-blur p-4 space-y-6">
          {/* Header */}
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-green-100 shadow-lg ring-2 ring-green-400/30 flex items-center justify-center mx-auto mb-4 hover:scale-105 transition-transform duration-300">
              <QrCode className="w-8 h-8 text-green-600 drop-shadow-md" />
            </div>
            
            <h1 className="text-4xl font-bold text-white mb-2">Collector Dashboard</h1>
            <p className="text-white text-lg">Scan user QR codes to award points (QR deactivates for 20h after scan)</p>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">{error}</AlertDescription>
            </Alert>
          )}

          {/* QR Scanner Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="w-5 h-5 text-green-600" />
                QR Code Scanner
              </CardTitle>
              <p className="text-gray-600">Point your camera at a user's QR code to award points</p>
            </CardHeader>
            <CardContent>
              {!isScanning ? (
                <div className="text-center space-y-6">
                  <div className="w-full max-w-md mx-auto aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center shadow-inner">
                    <div className="text-center space-y-3">
                      <Camera className="h-16 w-16 text-gray-400 mx-auto" />
                      <p className="text-gray-500 text-sm">Camera preview will appear here</p>
                    </div>
                  </div>
                  <Button
                    onClick={startScanning}
                    className="w-full max-w-md h-12 text-lg font-semibold bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg transition-all duration-300"
                  >
                    <Camera className="w-5 h-5 mr-2" />
                    Start Scanning
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative max-w-md mx-auto">
                    <video
                      ref={videoRef}
                      className="w-full aspect-square bg-black rounded-2xl object-cover shadow-lg"
                      playsInline
                      muted
                    />
                    <div className="absolute inset-0 border-2 border-green-400 rounded-2xl pointer-events-none">
                      <div className="absolute top-4 left-4 w-6 h-6 border-l-2 border-t-2 border-green-400"></div>
                      <div className="absolute top-4 right-4 w-6 h-6 border-r-2 border-t-2 border-green-400"></div>
                      <div className="absolute bottom-4 left-4 w-6 h-6 border-l-2 border-b-2 border-green-400"></div>
                      <div className="absolute bottom-4 right-4 w-6 h-6 border-r-2 border-b-2 border-green-400"></div>
                    </div>
                  </div>
                  <div className="text-center">
                    <Button
                      onClick={stopScanning}
                      variant="outline"
                      className="border-red-300 text-red-600 hover:bg-red-50"
                    >
                      Stop Scanning
                    </Button>
                  </div>
                </div>
              )}
            {lastScanInfo && (
              <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl shadow-sm space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <p className="text-sm font-semibold text-green-800">✅ Successfully Scanned</p>
                </div>
                <div className="pl-4 space-y-1">
                  <p className="font-medium text-gray-800">{lastScanInfo.userName}</p>
                  <p className="text-sm text-green-700">
                    <span className="font-medium">Scanned:</span> {getRelativeTime(lastScanInfo.timestamp)}
                  </p>
                  <p className="text-xs text-gray-600">
                    <span className="font-medium">Exact time:</span> {formatExactTime(lastScanInfo.timestamp)}
                  </p>
                  <p className="text-sm text-green-700">
                    <span className="font-medium">Points awarded:</span> +{lastScanInfo.pointsAwarded}
                  </p>
                  <p className="text-xs text-orange-600 font-medium">
                    ⏰ QR deactivated for 20 hours
                  </p>
                </div>
              </div>
            )}

            {scanResult && !lastScanInfo && (
              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl shadow-sm">
                <p className="text-sm text-blue-800 font-medium">📱 QR Code Detected: {scanResult}</p>
              </div>
            )}
          </CardContent>
        </Card>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-blue-600 mb-1">{scanHistory.filter(scan => 
                  new Date(scan.timestamp).toDateString() === new Date().toDateString()
                ).length}</div>
                <div className="text-gray-600 text-sm">Today's Scans</div>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Award className="w-6 h-6 text-emerald-600" />
                </div>
                <div className="text-2xl font-bold text-emerald-600 mb-1">{scanHistory.reduce((total, scan) => 
                  total + (scan.pointsAwarded || scan.coinsAwarded || 0), 0
                )}</div>
                <div className="text-gray-600 text-sm">Points Awarded</div>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <QrCode className="w-6 h-6 text-purple-600" />
                </div>
                <div className="text-2xl font-bold text-purple-600 mb-1">{scanHistory.length}</div>
                <div className="text-gray-600 text-sm">Total Scans</div>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-6 h-6 text-teal-600" />
                </div>
                <div className="text-2xl font-bold text-teal-600 mb-1">
                  {lastScanInfo ? getRelativeTime(lastScanInfo.timestamp) : 'None'}
                </div>
                <div className="text-gray-600 text-sm">Last Scan</div>
              </CardContent>
            </Card>
          </div>

          {/* Debug Test Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-purple-600" />
                Debug Testing
              </CardTitle>
              <p className="text-gray-600">Test cross-user notification system</p>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={testCrossUserNotification}
                className="bg-purple-500 hover:bg-purple-600 text-white"
              >
                Test Cross-User Notification
              </Button>
              <p className="text-xs text-gray-500 mt-2">
                This will send a test notification to user ID: test-user-123
              </p>
            </CardContent>
          </Card>

          {/* Recent Scans */}
          {scanHistory.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Recent Scans
                </CardTitle>
                <p className="text-gray-600">Latest QR code scans and point awards</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-64 overflow-y-auto">
                  {scanHistory.slice(0, 5).map((scan, index) => (
                    <div key={scan.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-gray-800">{scan.userName}</p>
                          {index === 0 && (
                            <Badge className="bg-green-100 text-green-600 text-xs">
                              Latest
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-blue-600 font-medium">
                          {getRelativeTime(scan.timestamp)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatExactTime(scan.timestamp)}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge className="bg-emerald-500 text-white font-semibold px-3 py-1 mb-1">
                          +{scan.pointsAwarded || scan.coinsAwarded} points
                        </Badge>
                        <p className="text-xs text-gray-400">
                          User ID: {scan.userId.slice(0, 8)}...
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
