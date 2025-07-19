"use client"

import { useUser } from '../context/UserContext'
import { Badge } from './ui/badge'
import { Coins, TrendingUp } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function UserBalance({ showAnimation = false, compact = false }) {
  const { userBalance, isLoading, refreshUserData } = useUser()
  const [prevBalance, setPrevBalance] = useState(userBalance)
  const [showGainAnimation, setShowGainAnimation] = useState(false)

  useEffect(() => {
    // Refresh user data when component mounts
    refreshUserData()
  }, [])

  useEffect(() => {
    if (userBalance > prevBalance && showAnimation) {
      setShowGainAnimation(true)
      setTimeout(() => setShowGainAnimation(false), 2000)
    }
    setPrevBalance(userBalance)
  }, [userBalance, prevBalance, showAnimation])

  if (isLoading) {
    return (
      <Badge variant="secondary" className="animate-pulse">
        <Coins className="h-3 w-3 mr-1" />
        Loading...
      </Badge>
    )
  }

  const gainAmount = userBalance - prevBalance

  if (isLoading) {
    return (
      <Badge variant="secondary" className="animate-pulse">
        <Coins className="h-3 w-3 mr-1" />
        Loading...
      </Badge>
    )
  }

  if (compact) {
    return (
      <Badge 
        variant="secondary" 
        className={`bg-emerald-100 text-emerald-800 relative ${
          showGainAnimation ? 'animate-bounce' : ''
        }`}
      >
        <Coins className="h-3 w-3 mr-1" />
        {userBalance}
        {showGainAnimation && gainAmount > 0 && (
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-green-500 text-white text-xs px-2 py-1 rounded animate-fade-in-up">
            +{gainAmount}
          </div>
        )}
      </Badge>
    )
  }

  return (
    <div className={`flex items-center space-x-2 ${showGainAnimation ? 'animate-pulse' : ''}`}>
      <Badge 
        variant="secondary" 
        className="bg-emerald-100 text-emerald-800 text-sm relative"
      >
        <Coins className="h-4 w-4 mr-2" />
        {userBalance} Coins
        {showGainAnimation && gainAmount > 0 && (
          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-green-500 text-white text-xs px-3 py-1 rounded-full animate-bounce flex items-center">
            <TrendingUp className="h-3 w-3 mr-1" />
            +{gainAmount} coins earned!
          </div>
        )}
      </Badge>
    </div>
  )
}
