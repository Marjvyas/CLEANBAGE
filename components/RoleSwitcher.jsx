"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { User, Truck } from "lucide-react"

export default function RoleSwitcher({ user, onRoleChange }) {
  const [isCollector, setIsCollector] = useState(user.role === "collector")

  const handleRoleToggle = (checked) => {
    setIsCollector(checked)
    const newRole = checked ? "collector" : "user"
    onRoleChange(newRole)
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          {isCollector ? <Truck className="h-5 w-5" /> : <User className="h-5 w-5" />}
          <span>Role Switcher (Demo)</span>
        </CardTitle>
        <CardDescription>
          Switch between User and Collector views
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <Label htmlFor="role-switch">User</Label>
          </div>
          
          <Switch
            id="role-switch"
            checked={isCollector}
            onCheckedChange={handleRoleToggle}
          />
          
          <div className="flex items-center space-x-2">
            <Label htmlFor="role-switch">Collector</Label>
            <Truck className="h-4 w-4" />
          </div>
        </div>
        
        <div className="text-center">
          <Badge variant={isCollector ? "default" : "secondary"} className="text-sm">
            Current Role: {isCollector ? "Waste Collector" : "Regular User"}
          </Badge>
        </div>
        
        <div className="text-xs text-gray-600 text-center">
          {isCollector 
            ? "As a collector, you can verify waste segregation and scan QR codes"
            : "As a user, you can generate QR codes for your waste bags"
          }
        </div>
      </CardContent>
    </Card>
  )
}
