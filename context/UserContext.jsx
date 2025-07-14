"use client"

import { createContext, useContext, useState, useEffect } from 'react'

const UserContext = createContext()

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [userBalance, setUserBalance] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  // Load user data from localStorage on mount
  useEffect(() => {
    const loadUserData = () => {
      try {
        if (typeof window !== 'undefined') {
          const storedUser = localStorage.getItem("wasteManagementUser")
          if (storedUser) {
            const userData = JSON.parse(storedUser)
            setUser(userData)
            setUserBalance(userData.points || 0)
          }
        }
      } catch (error) {
        console.error("Error loading user data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadUserData()

    // Listen for storage changes (when balance is updated from other components)
    const handleStorageChange = (e) => {
      if (e.key === "wasteManagementUser" && e.newValue) {
        try {
          const userData = JSON.parse(e.newValue)
          setUser(userData)
          setUserBalance(userData.points || 0)
        } catch (error) {
          console.error("Error parsing updated user data:", error)
        }
      }
    }

    // Listen for custom balance update events
    const handleBalanceUpdate = (e) => {
      if (e.detail && e.detail.points !== undefined) {
        setUserBalance(e.detail.points)
        setUser(prev => ({ ...prev, points: e.detail.points }))
      }
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorageChange)
      window.addEventListener('balanceUpdate', handleBalanceUpdate)
      
      return () => {
        window.removeEventListener('storage', handleStorageChange)
        window.removeEventListener('balanceUpdate', handleBalanceUpdate)
      }
    }
  }, [])

  const updateUserBalance = (newPoints) => {
    if (user && typeof window !== 'undefined') {
      const updatedUser = { ...user, points: newPoints }
      setUser(updatedUser)
      setUserBalance(newPoints)
      localStorage.setItem("wasteManagementUser", JSON.stringify(updatedUser))
      
      // Trigger custom event for immediate updates
      window.dispatchEvent(new CustomEvent('balanceUpdate', {
        detail: { points: newPoints, user: updatedUser }
      }))
      
      // Trigger storage event for other tabs/components
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'wasteManagementUser',
        newValue: JSON.stringify(updatedUser)
      }))
    }
  }

  const refreshUserData = () => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem("wasteManagementUser")
      if (storedUser) {
        const userData = JSON.parse(storedUser)
        setUser(userData)
        setUserBalance(userData.points || 0)
        
        // Trigger update event
        window.dispatchEvent(new CustomEvent('balanceUpdate', {
          detail: { points: userData.points || 0, user: userData }
        }))
      }
    }
  }

  const value = {
    user,
    userBalance,
    isLoading,
    updateUserBalance,
    refreshUserData,
    setUser
  }

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}
