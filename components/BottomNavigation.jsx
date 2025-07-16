"use client"

import { Home, Trophy, Gift, FileText, User, Truck, QrCode } from "lucide-react"

export default function BottomNavigation({ currentPage, onPageChange, userRole = "user" }) {
  const userNavItems = [
    { id: "schedule", icon: Home, label: "Home" },
    { id: "leaderboard", icon: Trophy, label: "Leaderboard" },
    { id: "rewards", icon: Gift, label: "Rewards" },
    { id: "requests", icon: FileText, label: "Requests" },
    { id: "profile", icon: User, label: "Profile" },
  ]

  const collectorNavItems = [
    { id: "collector-dashboard", icon: Truck, label: "Collector" },
    { id: "schedule", icon: Home, label: "Home" },
    { id: "profile", icon: User, label: "Profile" },
  ]

  const navItems = userRole === "collector" ? collectorNavItems : userNavItems

  return (
    <nav 
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 10000,
        backgroundColor: 'white',
        borderTop: '1px solid #e5e7eb',
        padding: '8px 16px',
        boxShadow: '0 -2px 10px rgba(0,0,0,0.1)'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', maxWidth: '600px', margin: '0 auto' }}>
        {/* Round black button with 'N' */}
        <button 
          style={{
            width: '40px',
            height: '40px',
            backgroundColor: 'black',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          <span style={{ color: 'white', fontSize: '14px', fontWeight: 'bold' }}>N</span>
        </button>
        
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = currentPage === item.id

          return (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '4px 8px',
                border: 'none',
                backgroundColor: isActive ? '#ecfdf5' : 'transparent',
                color: isActive ? '#059669' : '#6b7280',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <Icon size={18} />
              <span style={{ fontSize: '12px', marginTop: '2px' }}>{item.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
