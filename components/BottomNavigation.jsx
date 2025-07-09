"use client"

import { Home, Trophy, Gift, FileText, User } from "lucide-react"

export default function BottomNavigation({ currentPage, onPageChange }) {
  const navItems = [
    { id: "schedule", icon: Home, label: "Home" },
    { id: "leaderboard", icon: Trophy, label: "Leaderboard" },
    { id: "rewards", icon: Gift, label: "Rewards" },
    { id: "requests", icon: FileText, label: "Requests" },
    { id: "profile", icon: User, label: "Profile" },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-emerald-200 px-4 py-2">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = currentPage === item.id

          return (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              className={`flex flex-col items-center p-2 rounded-lg transition-all duration-300 ${
                isActive
                  ? "text-emerald-600 bg-emerald-100 transform scale-110"
                  : "text-gray-500 hover:text-emerald-600"
              }`}
            >
              <Icon size={20} />
              <span className="text-xs mt-1 font-medium">{item.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
