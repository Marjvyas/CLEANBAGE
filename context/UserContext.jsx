"use client"

import { createContext, useContext, useState, useEffect } from 'react'
import { getUserBalance, showBalanceNotification } from '../lib/balanceUtils'
import { toast } from 'sonner'

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
            console.log("Loading user data:", userData)
            setUser(userData)
            
            const userId = userData.id || userData.userId
            console.log("Checking global balance for user:", userId)
            
            // Sync with global balance system
            const globalBalance = getUserBalance(userId)
            const currentBalance = userData.points || 0
            
            console.log(`User ${userId} - Current balance: ${currentBalance}, Global balance: ${globalBalance}`)
            
            // Always use the global balance as the source of truth
            if (globalBalance !== currentBalance) {
              console.log(`Updating user ${userId} balance from ${currentBalance} to ${globalBalance}`)
              const updatedUser = { ...userData, points: globalBalance }
              setUser(updatedUser)
              setUserBalance(globalBalance)
              localStorage.setItem("wasteManagementUser", JSON.stringify(updatedUser))
            } else {
              setUserBalance(globalBalance)
            }
            
            // Check for pending notifications immediately
            console.log("Checking for pending notifications on login...")
            checkPendingNotifications(userId)
          }
        }
      } catch (error) {
        console.error("Error loading user data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadUserData()

    // Check for pending notifications every 5 seconds for more responsive updates
    const notificationInterval = setInterval(() => {
      if (user) {
        checkPendingNotifications(user.id || user.userId)
        // Also sync balance
        const globalBalance = getUserBalance(user.id || user.userId)
        if (globalBalance > userBalance) {
          console.log(`Balance update detected for user ${user.id || user.userId}: ${userBalance} -> ${globalBalance}`)
          refreshUserData()
        }
      }
    }, 5000)

    return () => clearInterval(notificationInterval)
  }, [])

  // Check for pending notifications for this user
  const checkPendingNotifications = (userId) => {
    if (!userId) return
    
    try {
      const pendingNotificationsKey = `pendingNotifications_${userId}`
      const notifications = JSON.parse(localStorage.getItem(pendingNotificationsKey) || '[]')
      
      console.log(`Checking notifications for user ${userId}:`, notifications)
      
      if (notifications.length > 0) {
        console.log(`Found ${notifications.length} pending notifications for user ${userId}`)
        
        // Show all pending notifications with a small delay to ensure UI is ready
        setTimeout(() => {
          notifications.forEach((notification, index) => {
            setTimeout(() => {
              console.log(`Showing notification: ${notification.message}`)
              toast.success(notification.message, {
                id: `notification-${notification.id}`,
                duration: 6000
              })
            }, index * 1000) // Stagger notifications by 1 second each
          })
        }, 500) // Initial delay of 500ms
        
        // Clear pending notifications
        localStorage.removeItem(pendingNotificationsKey)
        
        // Refresh user balance after showing notifications
        setTimeout(() => {
          refreshUserData()
        }, 2000)
      }
    } catch (error) {
      console.error("Error checking pending notifications:", error)
    }
  }

  // Listen for storage changes (when balance is updated from other components)
  useEffect(() => {
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
      
      // Also check for pending notifications when storage changes
      if (e.key && e.key.startsWith('pendingNotifications_') && user) {
        checkPendingNotifications(user.id || user.userId)
      }
    }

    // Listen for custom balance update events
    const handleBalanceUpdate = (e) => {
      if (e.detail && e.detail.points !== undefined) {
        setUserBalance(e.detail.points)
        setUser(prev => ({ ...prev, points: e.detail.points }))
      }
    }

    // Listen for user balance notifications
    const handleBalanceNotification = (e) => {
      if (e.detail && e.detail.pointsAdded) {
        toast.success(e.detail.message, {
          id: `balance-notification-${Date.now()}`,
          duration: 5000
        })
      }
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorageChange)
      window.addEventListener('balanceUpdate', handleBalanceUpdate)
      window.addEventListener('userBalanceNotification', handleBalanceNotification)
      
      return () => {
        window.removeEventListener('storage', handleStorageChange)
        window.removeEventListener('balanceUpdate', handleBalanceUpdate)
        window.removeEventListener('userBalanceNotification', handleBalanceNotification)
      }
    }
  }, [user])

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
        
        // Sync with global balance system
        const globalBalance = getUserBalance(userData.id || userData.userId)
        const currentBalance = userData.points || 0
        
        // If global balance is higher, update local balance
        if (globalBalance > currentBalance) {
          const updatedUser = { ...userData, points: globalBalance }
          setUser(updatedUser)
          setUserBalance(globalBalance)
          localStorage.setItem("wasteManagementUser", JSON.stringify(updatedUser))
          
          // Trigger update event
          window.dispatchEvent(new CustomEvent('balanceUpdate', {
            detail: { points: globalBalance, user: updatedUser }
          }))
        } else {
          setUser(userData)
          setUserBalance(userData.points || 0)
          
          // Trigger update event
          window.dispatchEvent(new CustomEvent('balanceUpdate', {
            detail: { points: userData.points || 0, user: userData }
          }))
        }
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
