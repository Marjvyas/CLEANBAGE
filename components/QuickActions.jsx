"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Zap, Camera, MapPin, Gift, Users, Phone } from "lucide-react"

export default function QuickActions() {
  const actions = [
    { icon: Camera, label: "Scan Waste", color: "bg-gradient-to-br from-blue-400 to-cyan-400" },
    { icon: MapPin, label: "Find Bins", color: "bg-gradient-to-br from-green-400 to-emerald-400" },
    { icon: Gift, label: "Rewards", color: "bg-gradient-to-br from-teal-400 to-cyan-400" },
    { icon: Users, label: "Community", color: "bg-gradient-to-br from-emerald-400 to-green-400" },
    { icon: Phone, label: "Support", color: "bg-gradient-to-br from-blue-400 to-teal-400" },
  ]

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardContent className="p-4">
        <div className="flex items-center space-x-2 mb-4">
          <Zap className="w-5 h-5 text-emerald-600" />
          <h3 className="font-semibold text-emerald-700">Quick Actions</h3>
        </div>
        <div className="grid grid-cols-5 gap-3">
          {actions.map((action, index) => {
            const Icon = action.icon
            return (
              <button
                key={index}
                className={`flex flex-col items-center p-3 rounded-xl ${action.color} hover:scale-105 transition-all duration-300 shadow-md`}
              >
                <Icon className="w-6 h-6 text-white mb-2" />
                <span className="text-xs text-white font-medium text-center">{action.label}</span>
              </button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
