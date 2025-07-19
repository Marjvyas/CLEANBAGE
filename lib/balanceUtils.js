// Utility functions for managing user balance updates

export const updateUserBalance = (userId, pointsToAdd) => {
  if (typeof window === 'undefined') return false

  try {
    // Get current logged-in user
    const currentUser = JSON.parse(localStorage.getItem("wasteManagementUser") || "{}")
    const currentUserId = currentUser.id || currentUser.userId
    
    console.log(`updateUserBalance called:`)
    console.log(`- Scanned user ID: ${userId}`)
    console.log(`- Current logged-in user ID: ${currentUserId}`)
    console.log(`- Points to add: ${pointsToAdd}`)
    console.log(`- Are they the same user? ${currentUserId === userId}`)
    
    // Update the specific user's balance in the global balance system
    const newGlobalBalance = updateGlobalUserBalance(userId, pointsToAdd)
    console.log(`- Updated global balance for ${userId}: ${newGlobalBalance}`)
    
    // If the scanned user is the currently logged-in user, update their localStorage too
    if (currentUserId === userId) {
      console.log(`Updating current user's localStorage balance`)
      const newPoints = (currentUser.points || 0) + pointsToAdd
      const updatedUser = { ...currentUser, points: newPoints }
      
      // Save to localStorage
      localStorage.setItem("wasteManagementUser", JSON.stringify(updatedUser))
      
      // Trigger immediate UI updates for current user
      window.dispatchEvent(new CustomEvent('balanceUpdate', {
        detail: { points: newPoints, user: updatedUser, pointsAdded: pointsToAdd }
      }))
      
      // Show notification to current user
      showBalanceNotification(pointsToAdd)
      
      // Also trigger storage event for cross-tab updates
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'wasteManagementUser',
        newValue: JSON.stringify(updatedUser),
        oldValue: JSON.stringify(currentUser)
      }))
    } else {
      // Show notification for different user (if they're logged in elsewhere)
      console.log(`Triggering cross-user notification for user ${userId}`)
      triggerCrossUserNotification(userId, pointsToAdd)
    }
    
    // Record the collection to prevent duplicates
    const today = new Date().toDateString()
    const collectionsKey = `collections_${today}`
    const existingCollections = JSON.parse(localStorage.getItem(collectionsKey) || "[]")
    
    existingCollections.push({
      userId,
      pointsAdded: pointsToAdd,
      timestamp: Date.now(),
      collectorId: currentUserId || 'collector'
    })
    
    localStorage.setItem(collectionsKey, JSON.stringify(existingCollections))
    
    return true
  } catch (error) {
    console.error("Error updating user balance:", error)
    return false
  }
}

// Update global user balance across all users
export const updateGlobalUserBalance = (userId, pointsToAdd) => {
  try {
    // Get all user balances
    const allBalances = JSON.parse(localStorage.getItem('globalUserBalances') || '{}')
    
    // Update specific user's balance
    const currentBalance = allBalances[userId] || 0
    const newBalance = currentBalance + pointsToAdd
    allBalances[userId] = newBalance
    
    // Save updated balances
    localStorage.setItem('globalUserBalances', JSON.stringify(allBalances))
    
    // Record the transaction
    recordBalanceTransaction(userId, pointsToAdd, newBalance)
    
    return newBalance
  } catch (error) {
    console.error("Error updating global user balance:", error)
    return 0
  }
}

// Get a specific user's balance from global storage
export const getUserBalance = (userId) => {
  try {
    const allBalances = JSON.parse(localStorage.getItem('globalUserBalances') || '{}')
    return allBalances[userId] || 0
  } catch (error) {
    console.error("Error getting user balance:", error)
    return 0
  }
}

// Record balance transaction for history
export const recordBalanceTransaction = (userId, pointsAdded, newBalance) => {
  try {
    const transactionsKey = `transactions_${userId}`
    const existingTransactions = JSON.parse(localStorage.getItem(transactionsKey) || '[]')
    
    const transaction = {
      id: Date.now(),
      userId,
      pointsAdded,
      newBalance,
      timestamp: new Date().toISOString(),
      type: 'scan_reward'
    }
    
    existingTransactions.unshift(transaction) // Add to beginning
    
    // Keep only last 50 transactions
    const limitedTransactions = existingTransactions.slice(0, 50)
    localStorage.setItem(transactionsKey, JSON.stringify(limitedTransactions))
    
    // Also record in global reward history for profile page
    recordRewardActivity(userId, pointsAdded, transaction.timestamp)
    
    return transaction
  } catch (error) {
    console.error("Error recording transaction:", error)
    return null
  }
}

// Record reward activity for profile page display
export const recordRewardActivity = (userId, pointsAdded, timestamp) => {
  try {
    const rewardHistoryKey = 'rewardHistory'
    const existingHistory = JSON.parse(localStorage.getItem(rewardHistoryKey) || '[]')
    
    const rewardActivity = {
      id: Date.now(),
      userId,
      pointsAwarded: pointsAdded,
      timestamp: timestamp || new Date().toISOString(),
      type: 'waste_collection',
      description: 'QR Code Scanned - Waste Collection Reward',
      status: 'completed'
    }
    
    existingHistory.unshift(rewardActivity) // Add to beginning
    
    // Keep only last 100 activities
    const limitedHistory = existingHistory.slice(0, 100)
    localStorage.setItem(rewardHistoryKey, JSON.stringify(limitedHistory))
    
    console.log(`Recorded reward activity for user ${userId}:`, rewardActivity)
    
    // Trigger event for real-time updates
    window.dispatchEvent(new CustomEvent('rewardActivityAdded', {
      detail: { userId, activity: rewardActivity }
    }))
    
    return rewardActivity
  } catch (error) {
    console.error("Error recording reward activity:", error)
    return null
  }
}

// Show notification to current user
export const showBalanceNotification = (pointsAdded) => {
  // Import toast dynamically to avoid SSR issues
  import('sonner').then(({ toast }) => {
    toast.success(`🎉 You received ${pointsAdded} points!`, {
      id: `balance-notification-${Date.now()}`,
      duration: 5000
    })
  }).catch(() => {
    // Fallback if toast is not available
    console.log(`User received ${pointsAdded} points!`)
  })
  
  // Also dispatch custom event for any listening components
  window.dispatchEvent(new CustomEvent('userBalanceNotification', {
    detail: { pointsAdded, message: `You received ${pointsAdded} points!` }
  }))
}

// Trigger notification for different user (cross-user notification)
export const triggerCrossUserNotification = (userId, pointsAdded) => {
  try {
    console.log(`Creating cross-user notification for user ${userId}: +${pointsAdded} points`)
    
    // Store pending notification for the user
    const pendingNotificationsKey = `pendingNotifications_${userId}`
    const existingNotifications = JSON.parse(localStorage.getItem(pendingNotificationsKey) || '[]')
    
    const notification = {
      id: Date.now(),
      type: 'balance_update',
      pointsAdded,
      timestamp: new Date().toISOString(),
      message: `You received ${pointsAdded} points from waste collection!`
    }
    
    existingNotifications.push(notification)
    localStorage.setItem(pendingNotificationsKey, JSON.stringify(existingNotifications))
    
    console.log(`Notification stored for user ${userId}:`, notification)
    console.log(`All pending notifications for user ${userId}:`, existingNotifications)
    
    // NOTE: Don't call recordRewardActivity here as it's already called in updateGlobalUserBalance -> recordBalanceTransaction
    // This prevents duplicate notifications in the recent activities
    
    // Trigger storage event for cross-tab communication
    window.dispatchEvent(new StorageEvent('storage', {
      key: pendingNotificationsKey,
      newValue: JSON.stringify(existingNotifications)
    }))
    
    console.log(`Storage event dispatched for user ${userId}`)
  } catch (error) {
    console.error("Error creating cross-user notification:", error)
  }
}

export const getCurrentUserBalance = () => {
  if (typeof window === 'undefined') return 0
  
  try {
    const currentUser = JSON.parse(localStorage.getItem("wasteManagementUser") || "{}")
    return currentUser.points || 0
  } catch (error) {
    console.error("Error getting current user balance:", error)
    return 0
  }
}

// Force balance sync for user (call this on login)
export const forceBalanceSync = (userId) => {
  try {
    console.log(`Forcing balance sync for user: ${userId}`)
    
    // Get global balance
    const globalBalance = getUserBalance(userId)
    console.log(`Global balance for user ${userId}: ${globalBalance}`)
    
    // Get current user data
    const currentUser = JSON.parse(localStorage.getItem("wasteManagementUser") || "{}")
    const currentUserId = currentUser.id || currentUser.userId
    
    if (currentUserId === userId) {
      // Update current user's localStorage with global balance
      const updatedUser = { ...currentUser, points: globalBalance }
      localStorage.setItem("wasteManagementUser", JSON.stringify(updatedUser))
      console.log(`Updated local balance for user ${userId} to ${globalBalance}`)
      
      // Trigger balance update event
      window.dispatchEvent(new CustomEvent('balanceUpdate', {
        detail: { points: globalBalance, user: updatedUser, pointsAdded: 0 }
      }))
    }
    
    // Check for pending notifications
    const pendingNotificationsKey = `pendingNotifications_${userId}`
    const notifications = JSON.parse(localStorage.getItem(pendingNotificationsKey) || '[]')
    
    if (notifications.length > 0) {
      console.log(`Found ${notifications.length} pending notifications for user ${userId}`)
      
      // Import toast dynamically
      import('sonner').then(({ toast }) => {
        notifications.forEach(notification => {
          console.log(`Showing login notification: ${notification.message}`)
          toast.success(notification.message, {
            id: `login-notification-${notification.id}`,
            duration: 5000
          })
        })
      })
      
      // Clear notifications
      localStorage.removeItem(pendingNotificationsKey)
    }
    
    return globalBalance
  } catch (error) {
    console.error("Error forcing balance sync:", error)
    return 0
  }
}

// Get recent activities for a user
export const getRecentActivities = (userId, limit = 10) => {
  try {
    const rewardHistory = JSON.parse(localStorage.getItem('rewardHistory') || '[]')
    return rewardHistory
      .filter(activity => activity.userId === userId)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, limit)
  } catch (error) {
    console.error("Error getting recent activities:", error)
    return []
  }
}

// Add a test activity (for debugging)
export const addTestActivity = (userId) => {
  try {
    const testActivity = {
      id: Date.now(),
      userId,
      pointsAwarded: 3,
      timestamp: new Date().toISOString(),
      type: 'waste_collection',
      description: 'Test QR Code Scan - Waste Collection Reward',
      status: 'completed'
    }
    
    recordRewardActivity(userId, 3, testActivity.timestamp)
    console.log("Test activity added:", testActivity)
    return testActivity
  } catch (error) {
    console.error("Error adding test activity:", error)
    return null
  }
}
