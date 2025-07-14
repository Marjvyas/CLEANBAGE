"use client"

import { useState, useEffect, useRef } from "react"
import { Camera, QrCode, Users, Award, AlertCircle, CheckCircle, Clock } from "lucide-react"
import { Button } from "../ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Alert, AlertDescription } from "../ui/alert"
import { Badge } from "../ui/badge"
import { toast } from "sonner"
import QrScanner from "qr-scanner"
import { updateUserBalance } from "../../lib/balanceUtils"
import { useUser } from "../../context/UserContext"

export default function SimplifiedCollectorDashboard({ user }) {
  const [isScanning, setIsScanning] = useState(false)
  const [scanResult, setScanResult] = useState("")
  const [lastScanInfo, setLastScanInfo] = useState(null)
  const [scanHistory, setScanHistory] = useState([])
  const [error, setError] = useState("")
  const [scanCooldown, setScanCooldown] = useState(0)
  const videoRef = useRef(null)
  const scannerRef = useRef(null)
  const { updateUserBalance: updateBalance } = useUser()

  // Load scan history on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('collectorScanHistory')
    if (savedHistory) {
      setScanHistory(JSON.parse(savedHistory))
    }

    // Check for active cooldown
    const cooldownEnd = localStorage.getItem('scanCooldownEnd')
    if (cooldownEnd) {
      const remaining = parseInt(cooldownEnd) - Date.now()
      if (remaining > 0) {
        setScanCooldown(Math.ceil(remaining / 1000))
      }
    }
  }, [])

  // Cooldown timer effect
  useEffect(() => {
    let interval
    if (scanCooldown > 0) {
      interval = setInterval(() => {
        setScanCooldown(prev => {
          if (prev <= 1) {
            localStorage.removeItem('scanCooldownEnd')
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [scanCooldown])

  // Update relative time display every minute
  useEffect(() => {
    const interval = setInterval(() => {
      // Force re-render to update relative times
      setScanHistory(prev => [...prev])
      setLastScanInfo(prev => prev ? {...prev} : null)
    }, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [])

  const formatCooldownTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

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
    if (scanCooldown > 0) {
      toast.error(`Please wait ${formatCooldownTime(scanCooldown)} before scanning again`)
      return
    }

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

      // Check if user already collected today
      const today = new Date().toDateString()
      const collectionKey = `collection_${userId}_${today}`
      const hasCollectedToday = localStorage.getItem(collectionKey)
      
      if (hasCollectedToday) {
        toast.error("This user has already collected their daily reward", { 
          id: `duplicate-${Date.now()}` 
        })
        return
      }

      // Award 3 coins
      const coinsAwarded = 3
      await updateUserBalance(userId, coinsAwarded)
      
      // Mark as collected for today
      localStorage.setItem(collectionKey, 'true')
      
      // Create scan information
      const newScan = {
        id: Date.now(),
        userId,
        userName: qrData.name || 'Unknown User',
        timestamp: scanTimestamp,
        coinsAwarded
      }
      
      // Set last scan info for display
      setLastScanInfo(newScan)
      
      // Add to scan history
      const updatedHistory = [newScan, ...scanHistory].slice(0, 10)
      setScanHistory(updatedHistory)
      localStorage.setItem('collectorScanHistory', JSON.stringify(updatedHistory))
      
      // Start 5-minute cooldown
      const cooldownEndTime = Date.now() + (5 * 60 * 1000) // 5 minutes
      localStorage.setItem('scanCooldownEnd', cooldownEndTime.toString())
      setScanCooldown(300) // 5 minutes in seconds
      
      // Show success message
      toast.success(`Successfully awarded ${coinsAwarded} coins to ${qrData.name || 'user'}!`, {
        id: `success-${Date.now()}`
      })
      
      // Stop scanning
      stopScanning()
      
    } catch (err) {
      console.error("QR processing error:", err)
      toast.error("Invalid QR code format", { id: `invalid-${Date.now()}` })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 p-4 pb-20">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-3 pt-4">
          <div className="w-16 h-16 mx-auto bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
            <QrCode className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Collector Dashboard
          </h1>
          <p className="text-gray-600 text-sm">Scan user QR codes to award daily rewards</p>
        </div>

        {/* Cooldown Alert */}
        {scanCooldown > 0 && (
          <Alert className="border-amber-200 bg-amber-50 shadow-sm">
            <Clock className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800 font-medium">
              Scanner cooldown: {formatCooldownTime(scanCooldown)} remaining
            </AlertDescription>
          </Alert>
        )}

        {/* QR Scanner Card */}
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <QrCode className="h-4 w-4 text-white" />
              </div>
              QR Code Scanner
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">{error}</AlertDescription>
              </Alert>
            )}

            {!isScanning ? (
              <div className="text-center space-y-4">
                <div className="w-full aspect-square max-w-sm mx-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center shadow-inner">
                  <div className="text-center space-y-3">
                    <Camera className="h-16 w-16 text-gray-400 mx-auto" />
                    <p className="text-gray-500 text-sm">Camera preview will appear here</p>
                  </div>
                </div>
                <Button
                  onClick={startScanning}
                  disabled={scanCooldown > 0}
                  className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                  {scanCooldown > 0 ? `Cooldown: ${formatCooldownTime(scanCooldown)}` : "Start Scanning"}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative">
                  <video
                    ref={videoRef}
                    className="w-full aspect-square max-w-sm mx-auto bg-black rounded-2xl object-cover shadow-lg"
                    playsInline
                    muted
                  />
                  <div className="absolute inset-0 border-2 border-blue-500 rounded-2xl pointer-events-none">
                    <div className="absolute top-4 left-4 w-8 h-8 border-t-4 border-l-4 border-blue-500 rounded-tl-lg"></div>
                    <div className="absolute top-4 right-4 w-8 h-8 border-t-4 border-r-4 border-blue-500 rounded-tr-lg"></div>
                    <div className="absolute bottom-4 left-4 w-8 h-8 border-b-4 border-l-4 border-blue-500 rounded-bl-lg"></div>
                    <div className="absolute bottom-4 right-4 w-8 h-8 border-b-4 border-r-4 border-blue-500 rounded-br-lg"></div>
                  </div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-32 h-32 border-2 border-blue-500 rounded-lg opacity-50"></div>
                  </div>
                </div>
                <Button 
                  onClick={stopScanning} 
                  variant="outline" 
                  className="w-full h-12 text-lg font-semibold border-2 hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-all duration-300"
                >
                  Stop Scanning
                </Button>
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
                    <span className="font-medium">Coins awarded:</span> +{lastScanInfo.coinsAwarded}
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
        <div className="grid grid-cols-2 gap-4">
          <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="text-center space-y-2">
                <Users className="h-8 w-8 mx-auto text-blue-100" />
                <p className="text-blue-100 text-sm font-medium">Today's Scans</p>
                <p className="text-3xl font-bold">{scanHistory.filter(scan => 
                  new Date(scan.timestamp).toDateString() === new Date().toDateString()
                ).length}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-gradient-to-br from-yellow-500 to-orange-500 text-white">
            <CardContent className="p-6">
              <div className="text-center space-y-2">
                <Award className="h-8 w-8 mx-auto text-yellow-100" />
                <p className="text-yellow-100 text-sm font-medium">Coins Awarded</p>
                <p className="text-3xl font-bold">{scanHistory.reduce((total, scan) => 
                  total + (scan.coinsAwarded || 0), 0
                )}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Scans */}
        {scanHistory.length > 0 && (
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-4 w-4 text-white" />
                </div>
                Recent Scans
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {scanHistory.slice(0, 5).map((scan, index) => (
                  <div key={scan.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-gray-800">{scan.userName}</p>
                        {index === 0 && (
                          <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full font-medium">
                            Latest
                          </span>
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
                      <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold px-3 py-1 mb-1">
                        +{scan.coinsAwarded} coins
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
  )
}
