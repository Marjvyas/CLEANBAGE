"use client"

import { useState } from "react"
import SchedulePage from "./pages/SchedulePage"
import LeaderboardPage from "./pages/LeaderboardPage"
import RewardsPage from "./pages/RewardsPage"
import RequestPage from "./pages/RequestPage"
import ProfilePage from "./pages/ProfilePage"
import BottomNavigation from "./BottomNavigation"

export default function Dashboard({ user, onLogout }) {
  const [currentPage, setCurrentPage] = useState("schedule")

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
        return <ProfilePage user={user} onLogout={onLogout} />
      default:
        return <SchedulePage user={user} onPageChange={setCurrentPage} />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <div className="pb-20">{renderPage()}</div>
      <BottomNavigation currentPage={currentPage} onPageChange={setCurrentPage} />
    </div>
  )
}
