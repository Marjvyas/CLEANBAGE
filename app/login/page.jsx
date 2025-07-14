"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import VideoBackground from "../../components/VideoBackground"
import FloatingElements from "../../components/FloatingElements"
import { EnhancedLoginForm } from "../../components/EnhancedLoginForm"

export default function LoginPage() {
  const router = useRouter()

  const handleLogin = (user) => {
    // Store user data with authentication info
    localStorage.setItem("wasteManagementUser", JSON.stringify(user))
    router.push("/")
  }

  return (
    <VideoBackground>
      <FloatingElements />
      <EnhancedLoginForm onLogin={handleLogin} />
    </VideoBackground>
  )
}
