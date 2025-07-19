"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Award, Calendar, Clock, TrendingUp } from "lucide-react"
import { toast } from "sonner"

export default function RecentActivities({ user, compact = false }) {
  const [recentRewards, setRecentRewards] = useState([])

  useEffect(() => {
    // Load recent rewards from localStorage
    const loadRecentRewards = () => {
      try {
        const rewardHistory = JSON.parse(localStorage.getItem("rewardHistory") || "[]")
        // Filter rewards for current user and sort by most recent
        const userRewards = rewardHistory
          .filter(reward => reward.userId === (user.id || user.userId))
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        
        console.log(`Loaded ${userRewards.length} recent activities for user ${user.id || user.userId}`)
        setRecentRewards(userRewards.slice(0, compact ? 3 : 5))
      } catch (error) {
        console.error("Error loading reward history:", error)
      }
    }
    
    loadRecentRewards()

    // Listen for real-time reward activity updates
    const handleRewardActivityAdded = (event) => {
      const { userId, activity } = event.detail
      if (userId === (user.id || user.userId)) {
        console.log("New reward activity detected:", activity)
        setRecentRewards(prev => [activity, ...prev.slice(0, compact ? 2 : 4)])
        
        // Show toast notification for new activity
        toast.success(`🎉 +${activity.pointsAwarded} coins earned!`, {
          id: `activity-${activity.id}`,
          duration: 4000,
          description: "Waste collection reward received"
        })
      }
    }

    // Listen for storage changes
    const handleStorageChange = (event) => {
      if (event.key === 'rewardHistory') {
        loadRecentRewards()
      }
    }

    window.addEventListener('rewardActivityAdded', handleRewardActivityAdded)
    window.addEventListener('storage', handleStorageChange)

    // Reload every 15 seconds
    const interval = setInterval(loadRecentRewards, 15000)

    return () => {
      window.removeEventListener('rewardActivityAdded', handleRewardActivityAdded)
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(interval)
    }
  }, [user.id, user.userId, compact])

  const formatTimeAgo = (timestamp) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInSeconds = Math.floor((now - time) / 1000)
    
    if (diffInSeconds < 60) return "Just now"
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    return `${Math.floor(diffInSeconds / 86400)}d ago`
  }

  if (compact) {
    return (
      <Card className="shadow-lg border-0 bg-gradient-to-r from-emerald-50 to-green-50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-emerald-600" />
            Recent Activities
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentRewards.length > 0 ? (
            <div className="space-y-2">
              {recentRewards.map((reward, index) => (
                <div
                  key={reward.id}
                  className="flex items-center justify-between p-3 bg-white rounded-lg border border-emerald-100 shadow-sm"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                      <Award className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-sm text-gray-900">Waste Collection</p>
                      <p className="text-xs text-gray-500">{formatTimeAgo(reward.timestamp)}</p>
                    </div>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-700 text-xs font-semibold">
                    +{reward.pointsAwarded}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">No recent activities</p>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg flex items-center justify-center">
            <TrendingUp className="h-4 w-4 text-white" />
          </div>
          Recent Activities
        </CardTitle>
        <p className="text-gray-600 text-sm">Your latest waste collection rewards</p>
      </CardHeader>
      <CardContent>
        {recentRewards.length > 0 ? (
          <div className="space-y-3">
            {recentRewards.map((reward, index) => (
              <div
                key={reward.id}
                className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-200 shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
                    <Award className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Waste Collection Reward</h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>{formatTimeAgo(reward.timestamp)}</span>
                      <span className="text-xs">•</span>
                      <span>{new Date(reward.timestamp).toLocaleTimeString()}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1 text-emerald-600 mb-1">
                    <span className="font-bold text-lg">+{reward.pointsAwarded}</span>
                    <span className="text-sm">coins</span>
                  </div>
                  <Badge className="bg-green-100 text-green-700 text-xs">Completed</Badge>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Award className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No recent activities</p>
            <p className="text-sm">Start collecting waste to earn rewards!</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
