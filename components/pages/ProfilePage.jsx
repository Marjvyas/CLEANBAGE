"use client"

import { useState, useEffect } from "react"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { User, Wallet, History, Settings, LogOut, Award, Calendar, Recycle, TrendingUp, Star, QrCode } from "lucide-react"
import UserBalance from "../UserBalance"
import { useUser } from "../../context/UserContext"

export default function ProfilePage({ user, onLogout, onPageChange }) {
  const [activities, setActivities] = useState([])
  const [achievements, setAchievements] = useState([])
  const [userStats, setUserStats] = useState({})
  const [recentRewards, setRecentRewards] = useState([])
  const { refreshUserData } = useUser()

  useEffect(() => {
    // Refresh user data when profile loads
    refreshUserData()
    
    // Load recent rewards from localStorage
    const loadRecentRewards = () => {
      try {
        const rewardHistory = JSON.parse(localStorage.getItem("rewardHistory") || "[]")
        // Filter rewards for current user and sort by most recent
        const userRewards = rewardHistory
          .filter(reward => reward.userId === (user.id || user.userId))
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        
        console.log(`Loaded ${userRewards.length} rewards for user ${user.id || user.userId}`)
        setRecentRewards(userRewards.slice(0, 10)) // Show last 10 rewards
      } catch (error) {
        console.error("Error loading reward history:", error)
      }
    }
    
    loadRecentRewards()

    // Listen for real-time reward activity updates
    const handleRewardActivityAdded = (event) => {
      const { userId, activity } = event.detail
      if (userId === (user.id || user.userId)) {
        console.log("New reward activity detected for current user:", activity)
        setRecentRewards(prev => [activity, ...prev.slice(0, 9)]) // Add new activity at the top
        
        // Show a toast notification for the new activity
        import('sonner').then(({ toast }) => {
          toast.success(`🎉 New activity: +${activity.pointsAwarded} coins!`, {
            id: `activity-${activity.id}`,
            duration: 4000
          })
        })
      }
    }

    // Listen for storage changes (cross-tab updates)
    const handleStorageChange = (event) => {
      if (event.key === 'rewardHistory') {
        console.log("Reward history updated in localStorage, reloading...")
        loadRecentRewards()
      }
    }

    window.addEventListener('rewardActivityAdded', handleRewardActivityAdded)
    window.addEventListener('storage', handleStorageChange)

    // Reload activities every 10 seconds for real-time updates
    const activityInterval = setInterval(loadRecentRewards, 10000)

    return () => {
      window.removeEventListener('rewardActivityAdded', handleRewardActivityAdded)
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(activityInterval)
    }

    const mockActivities = [
      {
        id: 1,
        type: "Organic Waste Collection",
        points: 15,
        date: "2024-01-15",
        status: "completed",
      },
      {
        id: 2,
        type: "Plastic Recycling",
        points: 25,
        date: "2024-01-14",
        status: "completed",
      },
      {
        id: 3,
        type: "Community Clean-up",
        points: 50,
        date: "2024-01-12",
        status: "completed",
      },
      {
        id: 4,
        type: "E-waste Submission",
        points: 30,
        date: "2024-01-10",
        status: "completed",
      },
    ]

    const mockAchievements = [
      { name: "Eco Warrior", description: "Completed 50 waste collection tasks", earned: true },
      { name: "Green Champion", description: "Earned 1000 EcoCoins", earned: true },
      { name: "Community Leader", description: "Organized 5 community events", earned: false },
      { name: "Recycling Master", description: "Recycled 100kg of waste", earned: true },
    ]

    const mockUserStats = {
      currentBalance: user.coins,
      earnedThisMonth: 120,
      totalRedeemed: 45,
      totalEarned: user.coins * 3,
    }

    setActivities(mockActivities)
    setAchievements(mockAchievements)
    setUserStats(mockUserStats)
  }, [user.coins])

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="page-enhanced-blur p-4 space-y-6">
        {/* Profile Header */}
        <Card>
          <CardContent className="p-8">
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-emerald-600" />
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-black">{user.name}</h1>
                <p className="text-black">{user.email}</p>
                <p className="text-black">{user.society}</p>
                <div className="flex items-center space-x-2 mt-2">
                  {user.selectedRole === "collector" && (
                    <Badge className="bg-emerald-100 text-emerald-800">
                      Authorized Collector
                    </Badge>
                  )}
                  {user.canSwitchRoles && (
                    <Badge variant="secondary">
                      Multi-Role Access
                    </Badge>
                  )}
                  {user.collectorId && (
                    <Badge variant="outline" className="text-xs">
                      ID: {user.collectorId}
                    </Badge>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-2 mb-2">
                  <Award className="w-5 h-5 text-yellow-600" />
                  <span className="text-xl font-bold text-gray-900">Rank #{user.rank}</span>
                </div>
                <p className="text-gray-600">Society Ranking</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Wallet Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="w-5 h-5 text-emerald-600" />
              EcoCoin Wallet
              <UserBalance compact={true} />
            </CardTitle>
            <p className="text-gray-600">Track your earnings and spending</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <UserBalance />
                <div className="text-gray-600 text-sm mt-2">Current Balance</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="text-2xl font-bold text-green-600 mb-1">{recentRewards.length}</div>
                <div className="text-gray-600 text-sm">Collections This Month</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-2xl font-bold text-blue-600 mb-1">{userStats.totalRedeemed || 0}</div>
                <div className="text-gray-600 text-sm">Total Redeemed</div>
              </div>
              <div className="text-center p-4 bg-teal-50 rounded-lg border border-teal-200">
                <div className="text-2xl font-bold text-teal-600 mb-1">{userStats.totalEarned || 0}</div>
                <div className="text-gray-600 text-sm">Total Earned</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Activity History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="w-5 h-5 text-emerald-600" />
              Recent Activities
            </CardTitle>
            <p className="text-gray-600">Your latest waste management activities</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentRewards.length > 0 ? (
              recentRewards.map((reward, index) => (
                <div
                  key={`reward-${index}`}
                  className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
                      <Award className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Waste Collection Reward</h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(reward.timestamp).toLocaleDateString()}</span>
                        <span>{new Date(reward.timestamp).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1 text-emerald-600 mb-1">
                      <span className="font-bold">+{reward.pointsAwarded}</span>
                      <span className="text-sm">coins</span>
                    </div>
                    <Badge className="bg-green-100 text-green-700 text-xs">Collected</Badge>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Award className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No rewards yet. Get your QR code scanned by collectors to earn coins!</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Legacy Activities for backwards compatibility */}
        {activities.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="w-5 h-5 text-blue-600" />
                Legacy Activities
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <Recycle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{activity.type}</h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(activity.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1 text-blue-600 mb-1">
                      <span className="font-bold">+{activity.points}</span>
                      <span className="text-sm">coins</span>
                    </div>
                    <Badge className="bg-blue-100 text-blue-700 text-xs">{activity.status}</Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Achievements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-600" />
              Achievements
            </CardTitle>
            <p className="text-gray-600">Your eco-warrior badges and accomplishments</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {achievements.map((achievement, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${
                    achievement.earned ? "bg-yellow-50 border-yellow-200" : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        achievement.earned ? "bg-yellow-100" : "bg-gray-200"
                      }`}
                    >
                      <Award className={`w-6 h-6 ${achievement.earned ? "text-yellow-600" : "text-gray-500"}`} />
                    </div>
                    <div>
                      <h3 className={`font-semibold ${achievement.earned ? "text-gray-900" : "text-gray-500"}`}>
                        {achievement.name}
                      </h3>
                      <p className={`text-sm ${achievement.earned ? "text-gray-600" : "text-gray-400"}`}>
                        {achievement.description}
                      </p>
                    </div>
                    {achievement.earned && (
                      <div className="ml-auto">
                        <Star className="w-5 h-5 text-yellow-500 fill-current" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Settings & Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-gray-600" />
              Account Settings
            </CardTitle>
            <p className="text-gray-600">Manage your account and preferences</p>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="outline"
              onClick={() => onPageChange && onPageChange("user-qr")}
              className="w-full justify-start border-emerald-300 text-emerald-600 hover:bg-emerald-50 bg-transparent"
            >
              <QrCode className="w-4 h-4 mr-2" />
              Show My QR Code
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start border-emerald-300 text-emerald-600 hover:bg-emerald-50 bg-transparent"
            >
              <Settings className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start border-blue-300 text-blue-600 hover:bg-blue-50 bg-transparent"
            >
              <Wallet className="w-4 h-4 mr-2" />
              Transaction History
            </Button>
            <Button
              variant="outline"
              onClick={onLogout}
              className="w-full justify-start border-red-300 text-red-600 hover:bg-red-50 bg-transparent"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </CardContent>
        </Card>

        {/* About & Impact */}
        <Card>
          <CardHeader className="text-center">
            <CardTitle>Your Environmental Impact</CardTitle>
            <p className="text-gray-600">See how you're making a difference with CLEANBAGE</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="text-center p-6 bg-green-50 rounded-lg border border-green-200">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Our Impact</h4>
                <p className="text-green-600 font-bold text-lg mb-1">1M+ kg</p>
                <p className="text-gray-600 text-sm">Waste properly managed</p>
              </div>
              <div className="text-center p-6 bg-blue-50 rounded-lg border border-blue-200">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Community</h4>
                <p className="text-blue-600 font-bold text-lg mb-1">50,000+</p>
                <p className="text-gray-600 text-sm">Active eco-warriors</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </div>
  )
}
