"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog"
import { Separator } from "../ui/separator"
import { CheckCircle, XCircle, Camera, Scan, Award, Recycle, Truck, AlertTriangle } from "lucide-react"
import { toast } from "sonner"

export default function CollectorDashboard({ user }) {
  const [currentStep, setCurrentStep] = useState("verification") // verification, scanning, completed
  const [segregationStatus, setSegregationStatus] = useState(null) // null, approved, rejected
  const [scannedBags, setScannedBags] = useState([])
  const [isScanning, setIsScanning] = useState(false)
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  
  // Mock data for demonstration
  const [currentCollection, setCurrentCollection] = useState({
    userId: "USER001",
    userName: "John Doe",
    address: "123 Green Street, Eco District",
    expectedBags: 3,
    pointsPerBag: 50,
    collectionTime: new Date().toLocaleTimeString()
  })

  const wasteCategories = [
    { name: "Organic", color: "bg-green-500", approved: null },
    { name: "Plastic", color: "bg-blue-500", approved: null },
    { name: "Paper", color: "bg-yellow-500", approved: null },
    { name: "Glass", color: "bg-purple-500", approved: null }
  ]

  const [categories, setCategories] = useState(wasteCategories)

  const handleSegregationCheck = (categoryIndex, isApproved) => {
    const updatedCategories = [...categories]
    updatedCategories[categoryIndex].approved = isApproved
    setCategories(updatedCategories)
    
    // Check if all categories are verified
    const allVerified = updatedCategories.every(cat => cat.approved !== null)
    const allApproved = updatedCategories.every(cat => cat.approved === true)
    
    if (allVerified) {
      setSegregationStatus(allApproved ? "approved" : "rejected")
      if (allApproved) {
        toast.success("Waste segregation approved! You can now scan QR codes.")
      } else {
        toast.error("Waste segregation rejected. Please ask user to re-segregate.")
      }
    }
  }

  const initializeCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment" } 
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (error) {
      toast.error("Failed to access camera")
      console.error("Camera error:", error)
    }
  }

  const startQRScanning = () => {
    if (segregationStatus !== "approved") {
      toast.error("Please verify waste segregation first")
      return
    }
    setCurrentStep("scanning")
    setIsScanning(true)
    initializeCamera()
  }

  const simulateQRScan = () => {
    // Simulate QR code scanning
    const mockQRData = {
      bagId: `BAG${Date.now()}`,
      userId: currentCollection.userId,
      wasteType: categories[scannedBags.length % categories.length].name,
      timestamp: new Date().toISOString(),
      points: currentCollection.pointsPerBag
    }
    
    setScannedBags(prev => [...prev, mockQRData])
    toast.success(`Bag scanned! ${mockQRData.points} points added to user account`)
    
    if (scannedBags.length + 1 >= currentCollection.expectedBags) {
      setCurrentStep("completed")
      setIsScanning(false)
      toast.success("Collection completed successfully!")
    }
  }

  const resetCollection = () => {
    setCurrentStep("verification")
    setSegregationStatus(null)
    setScannedBags([])
    setIsScanning(false)
    setCategories(wasteCategories.map(cat => ({ ...cat, approved: null })))
    
    // Simulate new collection
    setCurrentCollection({
      userId: `USER${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      userName: `User ${Math.floor(Math.random() * 100)}`,
      address: `${Math.floor(Math.random() * 999)} Green Street, Eco District`,
      expectedBags: Math.floor(Math.random() * 5) + 1,
      pointsPerBag: 50,
      collectionTime: new Date().toLocaleTimeString()
    })
  }

  const totalPointsAwarded = scannedBags.reduce((sum, bag) => sum + bag.points, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Truck className="h-8 w-8 text-emerald-600" />
              <CardTitle className="text-2xl font-bold text-emerald-800">
                Collector Dashboard
              </CardTitle>
            </div>
            <CardDescription className="text-lg">
              Welcome back, {user.name}
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Current Collection Info */}
        <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Recycle className="h-5 w-5" />
              <span>Current Collection</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">User</p>
                <p className="font-semibold">{currentCollection.userName}</p>
                <p className="text-sm text-gray-500">{currentCollection.userId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Time</p>
                <p className="font-semibold">{currentCollection.collectionTime}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600">Address</p>
              <p className="font-semibold">{currentCollection.address}</p>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Expected Bags: {currentCollection.expectedBags}</span>
              <span className="text-sm text-gray-600">Points per Bag: {currentCollection.pointsPerBag}</span>
            </div>
          </CardContent>
        </Card>

        {/* Step 1: Waste Segregation Verification */}
        {currentStep === "verification" && (
          <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5" />
                <span>Step 1: Verify Waste Segregation</span>
              </CardTitle>
              <CardDescription>
                Check if waste is properly segregated into different categories
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {categories.map((category, index) => (
                <div key={category.name} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full ${category.color}`}></div>
                    <span className="font-medium">{category.name} Waste</span>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant={category.approved === true ? "default" : "outline"}
                      className={category.approved === true ? "bg-green-500 hover:bg-green-600" : ""}
                      onClick={() => handleSegregationCheck(index, true)}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Good
                    </Button>
                    <Button
                      size="sm"
                      variant={category.approved === false ? "destructive" : "outline"}
                      onClick={() => handleSegregationCheck(index, false)}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Poor
                    </Button>
                  </div>
                </div>
              ))}
              
              {segregationStatus && (
                <div className="mt-4 p-4 rounded-lg border">
                  {segregationStatus === "approved" ? (
                    <div className="flex items-center space-x-2 text-green-700">
                      <CheckCircle className="h-5 w-5" />
                      <span className="font-semibold">Segregation Approved!</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2 text-red-700">
                      <AlertTriangle className="h-5 w-5" />
                      <span className="font-semibold">Segregation Rejected - Please re-segregate</span>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Step 2: QR Code Scanning */}
        {(currentStep === "scanning" || segregationStatus === "approved") && (
          <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Scan className="h-5 w-5" />
                <span>Step 2: Scan QR Codes</span>
              </CardTitle>
              <CardDescription>
                Scan QR codes on waste bags to award points
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!isScanning ? (
                <Button 
                  onClick={startQRScanning}
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                  disabled={segregationStatus !== "approved"}
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Start QR Scanning
                </Button>
              ) : (
                <div className="space-y-4">
                  <div className="relative bg-black rounded-lg overflow-hidden">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full h-64 object-cover"
                    />
                    <canvas ref={canvasRef} className="hidden" />
                    <div className="absolute inset-0 border-2 border-emerald-400 rounded-lg pointer-events-none">
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-emerald-400 rounded-lg"></div>
                    </div>
                  </div>
                  
                  {/* Simulate QR scan button */}
                  <Button 
                    onClick={simulateQRScan}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    <Scan className="h-4 w-4 mr-2" />
                    Simulate QR Scan
                  </Button>
                </div>
              )}

              {/* Scanned Bags List */}
              {scannedBags.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-semibold">Scanned Bags ({scannedBags.length}/{currentCollection.expectedBags})</h4>
                  {scannedBags.map((bag, index) => (
                    <div key={bag.bagId} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                      <div>
                        <p className="font-medium">{bag.wasteType} Bag</p>
                        <p className="text-sm text-gray-600">ID: {bag.bagId}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Award className="h-4 w-4 text-yellow-500" />
                        <span className="font-semibold text-green-600">+{bag.points} pts</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Step 3: Collection Completed */}
        {currentStep === "completed" && (
          <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-green-500">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-2">
                <CheckCircle className="h-12 w-12 text-green-500" />
              </div>
              <CardTitle className="text-green-700">Collection Completed!</CardTitle>
              <CardDescription>
                All bags have been successfully scanned and points awarded
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold">Total Points Awarded:</span>
                  <span className="text-2xl font-bold text-green-600">{totalPointsAwarded}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Bags Collected:</span>
                  <span>{scannedBags.length}</span>
                </div>
              </div>
              
              <Separator />
              
              <Button 
                onClick={resetCollection}
                className="w-full bg-emerald-600 hover:bg-emerald-700"
              >
                <Truck className="h-4 w-4 mr-2" />
                Start Next Collection
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
