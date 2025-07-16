"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import VideoBackground from "../../components/VideoBackground"
import FloatingElements from "../../components/FloatingElements"
import { EnhancedLoginForm } from "../../components/EnhancedLoginForm"

export default function LoginPage() {
  const router = useRouter()

  const handleLogin = (user) => {
    try {
      console.log("Handling login for user:", user)
      
      // Store user data with authentication info
      localStorage.setItem("wasteManagementUser", JSON.stringify(user))
      
      console.log("User data stored in localStorage, redirecting to home page")
      
      // Redirect to home page - UserContext will handle balance sync and notifications
      router.push("/")
    } catch (error) {
      console.error("Error during login process:", error)
      // Still redirect even if there's an error
      router.push("/")
    }
  }

  return (
    <VideoBackground>
      <FloatingElements />
      <EnhancedLoginForm onLogin={handleLogin} />
    </VideoBackground>
  )
}
