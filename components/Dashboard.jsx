"use client"

import { useState } from "react"
import SchedulePage from "./pages/SchedulePage"
import LeaderboardPage from "./pages/LeaderboardPage"
import RewardsPage from "./pages/RewardsPage"
import RequestPage from "./pages/RequestPage"
import ProfilePage from "./pages/ProfilePage"
import SimplifiedCollectorDashboard from "./pages/SimplifiedCollectorDashboard"
import QRCodeGenerator from "./pages/QRCodeGenerator"
import UserQRDisplay from "./pages/UserQRDisplay"
import BottomNavigation from "./BottomNavigation"
import UserBalance from "./UserBalance"

export default function Dashboard({ user, onLogout }) {
  const [currentPage, setCurrentPage] = useState(() => {
    // Set default page based on user role
    return user.selectedRole === "collector" ? "collector-dashboard" : "schedule"
  })
  
  const userRole = user.selectedRole || "user"

  const renderPage = () => {
    switch (currentPage) {
      case "schedule":
        return <SchedulePage user={user} onPageChange={setCurrentPage} />
      case "leaderboard":
        return <LeaderboardPage user={user} />
      case "rewards":
        return <RewardsPage user={user} />
      case "requests":
        return <RequestPage user={user} />
      case "profile":
        return <ProfilePage user={user} onLogout={onLogout} onPageChange={setCurrentPage} />
      case "user-qr":
        return <UserQRDisplay user={user} />
      case "collector-dashboard":
        return <SimplifiedCollectorDashboard user={user} />
      case "qr-generator":
        return <QRCodeGenerator user={user} />
      default:
        return <SchedulePage user={user} onPageChange={setCurrentPage} />
    }
  }

  return (
    <div className="min-h-screen">
      {/* Global User Balance - Show only for regular users, not collectors */}
      {userRole !== "collector" && (
        <div className="fixed top-4 right-4 z-50">
          <UserBalance showAnimation={true} />
        </div>
      )}
      
      <div className="pb-20">{renderPage()}</div>
      <BottomNavigation 
        currentPage={currentPage} 
        onPageChange={setCurrentPage} 
        userRole={userRole}
      />
    </div>
  )
}
