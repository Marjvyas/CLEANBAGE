"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { QrCode, Download, Printer, Plus } from "lucide-react"
import { toast } from "sonner"
import QRCode from "qrcode"

export default function QRCodeGenerator({ user }) {
  const [selectedWasteType, setSelectedWasteType] = useState("")
  const [bagWeight, setBagWeight] = useState("")
  const [generatedQRs, setGeneratedQRs] = useState([])

  const wasteTypes = [
    { value: "organic", label: "Organic Waste", color: "bg-green-500", points: 50 },
    { value: "plastic", label: "Plastic Waste", color: "bg-blue-500", points: 60 },
    { value: "paper", label: "Paper Waste", color: "bg-yellow-500", points: 40 },
    { value: "glass", label: "Glass Waste", color: "bg-purple-500", points: 70 },
    { value: "metal", label: "Metal Waste", color: "bg-gray-500", points: 80 },
    { value: "electronic", label: "E-Waste", color: "bg-red-500", points: 100 }
  ]

  const generateQRCode = async () => {
    if (!selectedWasteType || !bagWeight) {
      toast.error("Please select waste type and enter bag weight")
      return
    }

    try {
      const wasteType = wasteTypes.find(type => type.value === selectedWasteType)
      const qrData = {
        type: "waste_bag",
        id: `BAG${Date.now()}`,
        userId: user.id || "USER001",
        userName: user.name || "John Doe",
        wasteType: wasteType.label,
        weight: parseFloat(bagWeight),
        points: Math.floor(wasteType.points * (parseFloat(bagWeight) / 5)), // 5kg = base points
        generatedAt: new Date().toISOString(),
        status: "pending" // pending, scanned, expired
      }

      // Generate real QR code
      const qrCodeDataURL = await QRCode.toDataURL(JSON.stringify(qrData), {
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      })

      const qrWithImage = {
        ...qrData,
        qrCodeImage: qrCodeDataURL
      }

      setGeneratedQRs(prev => [qrWithImage, ...prev])
      setSelectedWasteType("")
      setBagWeight("")
      toast.success(`QR code generated for ${wasteType.label}!`)
    } catch (error) {
      console.error("Error generating QR code:", error)
      toast.error("Failed to generate QR code")
    }
  }

  const downloadQR = (qrId) => {
    // In a real app, this would generate and download the actual QR code
    toast.success("QR code downloaded! Print and attach to your waste bag.")
  }

  const printQR = (qrId) => {
    // In a real app, this would open the print dialog
    toast.success("Print dialog opened!")
  }

  // Simple QR code visualization (in real app, use react-qr-code)
  const QRCodeDisplay = ({ data }) => (
    <div className="w-24 h-24 bg-black flex items-center justify-center text-white text-xs p-2 rounded">
      <div className="text-center">
        <QrCode size={16} />
        <div className="text-[6px] mt-1">QR CODE</div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <QrCode className="h-8 w-8 text-emerald-600" />
              <CardTitle className="text-2xl font-bold text-emerald-800">
                QR Code Generator
              </CardTitle>
            </div>
            <CardDescription className="text-lg">
              Generate QR codes for your waste bags
            </CardDescription>
          </CardHeader>
        </Card>

        {/* QR Code Generation Form */}
        <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <CardTitle>Generate New QR Code</CardTitle>
            <CardDescription>
              Create a QR code for your segregated waste bag
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="wasteType">Waste Type</Label>
              <Select value={selectedWasteType} onValueChange={setSelectedWasteType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select waste type" />
                </SelectTrigger>
                <SelectContent>
                  {wasteTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${type.color}`}></div>
                        <span>{type.label}</span>
                        <Badge variant="secondary" className="ml-2">
                          {type.points} pts/5kg
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bagWeight">Bag Weight (kg)</Label>
              <Input
                id="bagWeight"
                type="number"
                placeholder="Enter bag weight"
                value={bagWeight}
                onChange={(e) => setBagWeight(e.target.value)}
                step="0.1"
                min="0.1"
              />
            </div>

            {selectedWasteType && bagWeight && (
              <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-emerald-700">Estimated Points:</span>
                  <span className="font-bold text-emerald-800">
                    {Math.floor(wasteTypes.find(t => t.value === selectedWasteType)?.points * (parseFloat(bagWeight) / 5) || 0)} points
                  </span>
                </div>
              </div>
            )}

            <Button 
              onClick={generateQRCode}
              className="w-full bg-emerald-600 hover:bg-emerald-700"
              disabled={!selectedWasteType || !bagWeight}
            >
              <Plus className="h-4 w-4 mr-2" />
              Generate QR Code
            </Button>
          </CardContent>
        </Card>

        {/* Generated QR Codes */}
        {generatedQRs.length > 0 && (
          <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
            <CardHeader>
              <CardTitle>Your QR Codes ({generatedQRs.length})</CardTitle>
              <CardDescription>
                Download and print these QR codes to attach to your waste bags
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {generatedQRs.map((qr) => (
                <div key={qr.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                  <QRCodeDisplay data={qr} />
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">{qr.wasteType}</h4>
                      <Badge 
                        variant={qr.status === "pending" ? "secondary" : qr.status === "scanned" ? "default" : "destructive"}
                      >
                        {qr.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                      <div>Weight: {qr.weight} kg</div>
                      <div>Points: {qr.points}</div>
                      <div>ID: {qr.id}</div>
                      <div>Generated: {new Date(qr.generatedAt).toLocaleDateString()}</div>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => downloadQR(qr.id)}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => printQR(qr.id)}
                    >
                      <Printer className="h-4 w-4 mr-1" />
                      Print
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-800">How to Use QR Codes</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-blue-700 space-y-2">
            <ol className="list-decimal list-inside space-y-1">
              <li>Generate QR codes for each waste bag by selecting type and weight</li>
              <li>Download and print the QR codes</li>
              <li>Attach the printed QR codes securely to your waste bags</li>
              <li>Ensure waste is properly segregated according to type</li>
              <li>Place bags for collection at scheduled time</li>
              <li>Collector will verify segregation and scan QR codes</li>
              <li>Points will be automatically added to your account</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
