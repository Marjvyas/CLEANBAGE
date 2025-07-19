"use client"

import { Home, Trophy, Gift, FileText, User, Truck, QrCode } from "lucide-react"

export default function BottomNavigation({ currentPage, onPageChange, userRole = "user" }) {
  const userNavItems = [
    { id: "schedule", icon: Home, label: "Home" },
    { id: "leaderboard", icon: Trophy, label: "Board" },
    { id: "rewards", icon: Gift, label: "Rewards" },
    { id: "requests", icon: FileText, label: "Requests" },
    { id: "profile", icon: User, label: "Profile" },
  ]

  const collectorNavItems = [
    { id: "collector-dashboard", icon: Truck, label: "Dashboard" },
    { id: "schedule", icon: Home, label: "Home" },
    { id: "profile", icon: User, label: "Profile" },
  ]

  const navItems = userRole === "collector" ? collectorNavItems : userNavItems

  return (
    <nav 
      className="nav-white-blur"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 10000,
        padding: '12px 16px'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', maxWidth: '600px', margin: '0 auto' }}>
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
                padding: '8px 12px',
                border: 'none',
                backgroundColor: isActive ? 'rgba(255, 255, 255, 0.25)' : 'transparent',
                color: 'white',
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                backdropFilter: isActive ? 'blur(10px)' : 'none',
                border: isActive ? '1px solid rgba(255, 255, 255, 0.3)' : '1px solid transparent'
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                  e.target.style.transform = 'translateY(-2px)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.transform = 'translateY(0)';
                }
              }}
            >
              <Icon size={20} />
              <span style={{ fontSize: '12px', marginTop: '4px', fontWeight: '500' }}>{item.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
