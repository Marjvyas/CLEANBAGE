"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { FileText, Truck, Wrench, Users, Phone, Mail, Clock } from "lucide-react"

export default function RequestPage({ user, setActivePage }) {
  const [selectedService, setSelectedService] = useState("")
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: "",
    society: user.society,
    serviceType: "",
    description: "",
    urgency: "medium",
  })
  const [recentRequests, setRecentRequests] = useState([])

  useEffect(() => {
    const mockRecentRequests = [
      {
        id: 1,
        type: "Bulk Waste Collection",
        status: "completed",
        date: "2024-01-05",
        description: "Large furniture disposal request",
      },
      {
        id: 2,
        type: "Equipment Maintenance",
        status: "in-progress",
        date: "2024-01-07",
        description: "Broken waste bin replacement",
      },
      {
        id: 3,
        type: "Community Event Support",
        status: "pending",
        date: "2024-01-08",
        description: "Waste management for society event",
      },
    ]
    setRecentRequests(mockRecentRequests)
  }, [])

  const services = [
    {
      id: "bulk-collection",
      name: "Bulk Waste Collection",
      description: "Request pickup for large quantities of waste",
      icon: Truck,
      color: "bg-blue-500",
    },
    {
      id: "maintenance",
      name: "Equipment Maintenance",
      description: "Report issues with waste bins or equipment",
      icon: Wrench,
      color: "bg-emerald-500",
    },
    {
      id: "community-event",
      name: "Community Event Support",
      description: "Request waste management for events",
      icon: Users,
      color: "bg-teal-500",
    },
    {
      id: "consultation",
      name: "Waste Management Consultation",
      description: "Get expert advice on waste reduction",
      icon: FileText,
      color: "bg-green-500",
    },
  ]

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    alert("Request submitted successfully!")
    setFormData({
      ...formData,
      description: "",
      serviceType: "",
    })
    setSelectedService("")
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="page-enhanced-blur p-4">
        {/* Hero Header */}
        <div className="text-center py-8">
          <div className="w-16 h-16 rounded-full bg-blue-100 shadow-lg ring-2 ring-blue-400/30 flex items-center justify-center mx-auto mb-4 hover:scale-105 transition-transform duration-300">
  <FileText className="w-8 h-8 text-blue-600 drop-shadow-md" />
</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Service Requests</h1>
          <p className="text-gray-600 text-lg">Request various waste management services from our community</p>
          <div className="mt-4 inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border">
            <Clock className="w-4 h-4 text-blue-600" />
            <span className="text-gray-700 font-medium">24/7 Support Available</span>
          </div>
        </div>

        {/* Recent Requests */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Your Recent Requests
            </CardTitle>
            <p className="text-gray-600">Track the status of your submitted requests</p>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentRequests.map((request) => (
              <div
                key={request.id}
                className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{request.type}</h4>
                    <p className="text-gray-600 text-sm">{request.description}</p>
                    <p className="text-gray-500 text-xs">{request.date}</p>
                  </div>
                </div>
                <Badge
                  className={`${
                    request.status === "completed"
                      ? "bg-green-100 text-green-700"
                      : request.status === "in-progress"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {request.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Service Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Select Service Type
            </CardTitle>
            <p className="text-gray-600">Choose the type of service you need</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {services.map((service) => {
                const Icon = service.icon
                return (
                  <button
                    key={service.id}
                    onClick={() => {
                      setSelectedService(service.id)
                      setFormData({ ...formData, serviceType: service.name })
                    }}
                    className={`p-4 rounded-lg border-2 transition-all duration-300 text-left ${
                      selectedService === service.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-blue-300 hover:bg-blue-25"
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`w-12 h-12 rounded-lg ${service.color} flex items-center justify-center`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">{service.name}</h3>
                        <p className="text-sm text-gray-600">{service.description}</p>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Request Form */}
        {selectedService && (
          <Card>
            <CardHeader>
              <CardTitle className="text-blue-600">Request Details</CardTitle>
              <p className="text-gray-600">Fill in the details for your service request</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="society">Society</Label>
                    <Input id="society" name="society" value={formData.society} onChange={handleInputChange} required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="urgency">Urgency Level</Label>
                  <select
                    id="urgency"
                    name="urgency"
                    value={formData.urgency}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="low">Low - Within a week</option>
                    <option value="medium">Medium - Within 2-3 days</option>
                    <option value="high">High - Within 24 hours</option>
                    <option value="urgent">Urgent - Immediate attention</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Detailed Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Please provide detailed information about your request..."
                    rows={4}
                    required
                  />
                </div>

                <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                  Submit Request
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Contact Information */}
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Phone className="w-5 h-5 text-blue-600" />
              Contact Our Support Team
              <Mail className="w-5 h-5 text-emerald-600" />
            </CardTitle>
            <p className="text-gray-600">We're here to help you 24/7</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Phone Support</p>
                  <p className="text-blue-600 font-medium">+91 98765 43210</p>
                  <p className="text-gray-600 text-sm">Mon-Sat, 9 AM - 6 PM</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Email Support</p>
                  <p className="text-emerald-600 font-medium">support@cleanbage.com</p>
                  <p className="text-gray-600 text-sm">24/7 Support</p>
                </div>
              </div>
            </div>
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-2">Operating Hours</h4>
              <div className="space-y-1 text-sm text-gray-600">
                <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                <p>Saturday: 9:00 AM - 2:00 PM</p>
                <p>Emergency Support: 24/7</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </div>
  )
}
