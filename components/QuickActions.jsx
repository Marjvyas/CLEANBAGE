"use client"

import { Calendar, Recycle, AlertTriangle, QrCode } from "lucide-react"

export default function QuickActions({ onActionSelect, onPageChange }) {
  const handleButtonClick = (actionId) => {
    if (actionId === "schedule") {
      onPageChange("requests") // Ensure this matches the page name in Dashboard
    } else if (actionId === "qr-generator") {
      onPageChange("qr-generator")
    } else {
      onActionSelect(actionId)
    }
  }

  const actions = [
    {
      id: "collect",
      title: "Collect Waste",
      description: "Start collecting waste in your area",
      icon: <Recycle className="w-6 h-6" />
    },
    {
      id: "qr-generator",
      title: "Generate QR Code",
      description: "Create QR codes for your waste bags",
      icon: <QrCode className="w-6 h-6" />
    },
    {
      id: "schedule",
      title: "Schedule Pickup",
      description: "Schedule a waste pickup time",
      icon: <Calendar className="w-6 h-6" />
    },
    {
      id: "report",
      title: "Report Dumping",
      description: "Report illegal waste dumping",
      icon: <AlertTriangle className="w-6 h-6" />
    }
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {actions.map((action) => (
        <button
          key={action.id}
          onClick={() => handleButtonClick(action.id)}
          className="action-card-blur flex flex-col items-center p-6 rounded-xl shadow-md hover:shadow-lg transition-all"
        >
          <div className="p-3 bg-emerald-500 rounded-full mb-3">
            {action.icon}
          </div>
          <h3 className="font-semibold text-lg mb-1">{action.title}</h3>
          <p className="text-gray-600 text-sm text-center">{action.description}</p>
        </button>
      ))}
    </div>
  )
}

