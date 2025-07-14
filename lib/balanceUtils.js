// Utility functions for managing user balance updates

export const updateUserBalance = (userId, pointsToAdd) => {
  if (typeof window === 'undefined') return false

  try {
    // Get current user data
    const currentUser = JSON.parse(localStorage.getItem("wasteManagementUser") || "{}")
    
    // Update points regardless of user ID (for collector scanning different users)
    const newPoints = (currentUser.points || 0) + pointsToAdd
    const updatedUser = { ...currentUser, points: newPoints }
    
    // Save to localStorage
    localStorage.setItem("wasteManagementUser", JSON.stringify(updatedUser))
    
    // Record the collection to prevent duplicates
    const today = new Date().toDateString()
    const collectionsKey = `collections_${today}`
    const existingCollections = JSON.parse(localStorage.getItem(collectionsKey) || "[]")
    
    existingCollections.push({
      userId,
      pointsAdded: pointsToAdd,
      timestamp: Date.now(),
      collectorId: currentUser.userId || 'collector'
    })
    
    localStorage.setItem(collectionsKey, JSON.stringify(existingCollections))
    
    // Trigger immediate UI updates
    window.dispatchEvent(new CustomEvent('balanceUpdate', {
      detail: { points: newPoints, user: updatedUser, pointsAdded: pointsToAdd }
    }))
    
    // Also trigger storage event for cross-tab updates
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'wasteManagementUser',
      newValue: JSON.stringify(updatedUser),
      oldValue: JSON.stringify(currentUser)
    }))
    
    console.log(`Balance updated: ${currentUser.points || 0} -> ${newPoints} (+${pointsToAdd} for user ${userId})`)
    return true
  } catch (error) {
    console.error("Error updating balance:", error)
    return false
  }
}

export const getCurrentUserBalance = () => {
  if (typeof window === 'undefined') return 0
  
  try {
    const currentUser = JSON.parse(localStorage.getItem("wasteManagementUser") || "{}")
    return currentUser.points || 0
  } catch (error) {
    console.error("Error getting balance:", error)
    return 0
  }
}

export const isUserAlreadyCollectedToday = (userId) => {
  if (typeof window === 'undefined') return false
  
  try {
    const today = new Date().toDateString()
    const collectionsKey = `collections_${today}`
    const todayCollections = JSON.parse(localStorage.getItem(collectionsKey) || "[]")
    
    return todayCollections.some(collection => collection.userId === userId)
  } catch (error) {
    console.error("Error checking collection status:", error)
    return false
  }
}

// Force refresh balance display
export const refreshBalanceDisplay = () => {
  if (typeof window === 'undefined') return
  
  try {
    const currentUser = JSON.parse(localStorage.getItem("wasteManagementUser") || "{}")
    
    window.dispatchEvent(new CustomEvent('balanceUpdate', {
      detail: { 
        points: currentUser.points || 0, 
        user: currentUser,
        forceRefresh: true 
      }
    }))
  } catch (error) {
    console.error("Error refreshing balance display:", error)
  }
}
