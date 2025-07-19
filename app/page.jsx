"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Dashboard from "../components/Dashboard"
import VideoBackground from "../components/VideoBackground"

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const router = useRouter()

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem("wasteManagementUser")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
      setIsAuthenticated(true)
    } else {
      // Redirect to login if not authenticated
      router.push("/login")
    }
  }, [router])

  const handleLogout = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem("wasteManagementUser")
    router.push("/login")
  }

  if (!isAuthenticated) {
    return (
      <VideoBackground>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-white text-xl font-semibold">Loading...</div>
        </div>
      </VideoBackground>
    )
  }

  return (
    <VideoBackground overlay={false}>
      <Dashboard user={user} onLogout={handleLogout} />
    </VideoBackground>
  )
}
