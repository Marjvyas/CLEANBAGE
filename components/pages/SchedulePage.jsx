"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Calendar,
  Clock,
  MapPin,
  Recycle,
  AlertCircle,
  CheckCircle,
  Gift,
  MessageCircle,
  ThumbsUp,
  Star,
  Users,
  Award,
  Zap,
  Activity,
  Package,
  Sparkles,
} from "lucide-react"
import QuickActions from "../QuickActions"
import CollectWaste from "../schedule-sections/CollectWaste"
import SchedulePickup from "../schedule-sections/SchedulePickup"
import ReportDumping from "../schedule-sections/ReportDumping"
export default function SchedulePage({ user, onPageChange }) {
  const [schedules, setSchedules] = useState([])
  const [updates, setUpdates] = useState([])
  const [feedbacks, setFeedbacks] = useState([])
  const [communityStats, setCommunityStats] = useState({})
  const [selectedAction, setSelectedAction] = useState(null)
  const [recentRewards, setRecentRewards] = useState([])

  useEffect(() => {
    // Load recent rewards from localStorage
    const loadRecentRewards = () => {
      try {
        const rewardHistory = JSON.parse(localStorage.getItem("rewardHistory") || "[]")
        // Filter rewards for current user, remove duplicates, and sort by most recent
        const userRewards = rewardHistory
          .filter(reward => reward.userId === (user.id || user.userId))
          .reduce((unique, reward) => {
            // Remove duplicates based on timestamp and pointsAwarded
            const isDuplicate = unique.some(existing => 
              Math.abs(new Date(existing.timestamp) - new Date(reward.timestamp)) < 5000 && 
              existing.pointsAwarded === reward.pointsAwarded
            )
            if (!isDuplicate) {
              unique.push(reward)
            }
            return unique
          }, [])
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        
        console.log(`Loaded ${userRewards.length} recent activities for user ${user.id || user.userId}`)
        setRecentRewards(userRewards.slice(0, 5))
      } catch (error) {
        console.error("Error loading reward history:", error)
      }
    }
    
    loadRecentRewards()

    // Listen for storage changes
    const handleStorageChange = (event) => {
      if (event.key === 'rewardHistory') {
        loadRecentRewards()
      }
    }

    window.addEventListener('storage', handleStorageChange)

    // Reload every 15 seconds
    const interval = setInterval(loadRecentRewards, 15000)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(interval)
    }
  }, [user.id, user.userId])

  const formatTimeAgo = (timestamp) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInSeconds = Math.floor((now - time) / 1000)
    
    if (diffInSeconds < 60) return "Just now"
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    return `${Math.floor(diffInSeconds / 86400)}d ago`
  }

  useEffect(() => {
    // Mock data setup
    const mockSchedules = [
      {
        id: 1,
        type: "Organic Waste",
        date: "2024-01-08",
        time: "08:00 AM",
        location: user.society,
        status: "scheduled",
        coins: 25,
        weight: "2.5 kg",
      },
      {
        id: 2,
        type: "Recyclable Waste",
        date: "2024-01-09",
        time: "10:00 AM",
        location: user.society,
        status: "ready",
        coins: 30,
        weight: "1.8 kg",
      },
      {
        id: 3,
        type: "Electronic Waste",
        date: "2024-01-10",
        time: "02:00 PM",
        location: user.society,
        status: "pending",
        coins: 50,
        weight: "0.5 kg",
      },
      {
        id: 4,
        type: "Bulk Waste",
        date: "2024-01-11",
        time: "11:00 AM",
        location: user.society,
        status: "scheduled",
        coins: 40,
        weight: "5.0 kg",
      },
    ]

    const mockUpdates = [
      {
        id: 1,
        title: "Waste Collection Completed",
        message: `Hey ${user.name}, your organic waste (2.5kg) was successfully collected. You earned 25 coins!`,
        time: "2 hours ago",
        type: "success",
        coins: 25,
      },
      {
        id: 2,
        title: "Segregation Score Updated",
        message: `Great job ${user.name}! Your segregation score improved to 73. Keep up the excellent work!`,
        time: "4 hours ago",
        type: "achievement",
        scoreChange: "+5",
      },
      {
        id: 3,
        title: "Pickup Request Approved",
        message: `Your electronic waste pickup request has been approved for tomorrow at 2:00 PM`,
        time: "6 hours ago",
        type: "info",
      },
      {
        id: 4,
        title: "Weekly Goal Achieved",
        message: `Congratulations ${user.name}! You've completed your weekly waste segregation goal. Bonus: 50 coins!`,
        time: "1 day ago",
        type: "reward",
        coins: 50,
      },
    ]

    const mockFeedbacks = [
      {
        id: 1,
        userName: "Priya Sharma",
        userSociety: "Green Valley Society",
        message:
          "Great service! The waste collection team was very punctual and professional. Keep up the good work! 👍",
        time: "3 hours ago",
        likes: 12,
        rating: 5,
      },
      {
        id: 2,
        userName: "Amit Kumar",
        userSociety: "Eco Heights",
        message:
          "I love how the app tracks our segregation score. It motivates me to be more conscious about waste disposal. The rewards system is amazing!",
        time: "5 hours ago",
        likes: 8,
        rating: 5,
      },
    ]

    const mockCommunityStats = {
      totalUsers: 15000,
      wasteCollected: 2500,
      societiesServed: 150,
      coinsDistributed: 500000,
    }

    setSchedules(mockSchedules)
    setUpdates(mockUpdates)
    setFeedbacks(mockFeedbacks)
    setCommunityStats(mockCommunityStats)
  }, [user.society, user.name])

  const renderActionContent = () => {
    switch (selectedAction) {
      case "collect":
        return <CollectWaste user={user} />
      case "schedule":
        return <SchedulePickup user={user} />
      case "report":
        return <ReportDumping user={user} />
      default:
        return (
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <QuickActions
              onActionSelect={setSelectedAction}
              onPageChange={onPageChange}
            />
          </div>
        )
    }
  }

  const quickActions = [
    {
      id: "schedule-pickup",
      title: "Schedule Pickup",
      description: "Request waste collection",
      icon: <Calendar className="w-6 h-6 text-white" />,
      action: () => onPageChange("requests"), // Changed from "request" to "requests"
    },
    {
      id: "track-recycling",
      title: "Track Recycling",
      description: "Monitor your progress",
      icon: <Recycle className="w-6 h-6 text-white" />,
      action: () => onPageChange("profile"),
    },
    {
      id: "view-rewards",
      title: "View Rewards",
      description: "Redeem your coins",
      icon: <Gift className="w-6 h-6 text-white" />,
      action: () => onPageChange("rewards"),
    },
    {
      id: "report-issue",
      title: "Report Issue",
      description: "Get help quickly",
      icon: <AlertCircle className="w-6 h-6 text-white" />,
      action: () => onPageChange("requests"),
    },
  ]

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="page-enhanced-blur p-4 space-y-6">
          {/* Hero Header */}
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-gradient-to-br from-emerald-200 to-emerald-100 shadow-lg ring-2 ring-emerald-400/30 hover:scale-105 transition-transform duration-300">
              <Recycle className="w-8 h-8 text-emerald-600 drop-shadow-md" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              CLEANBAGE Dashboard
            </h1>
            <p className="text-gray-600 text-lg">
              Your personalized waste management hub
            </p>
            <div className="mt-4 inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span className="text-gray-700 font-medium">
                {user.society}
              </span>
            </div>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <Zap className="w-5 h-5 text-emerald-600" />
                Quick Actions
                <Sparkles className="w-5 h-5 text-blue-500" />
              </CardTitle>
              <p className="text-gray-600">
                Fast access to essential features
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {quickActions.map((action) => (
                  <button
                    key={action.id}
                    onClick={action.action}
                    className="flex flex-col items-center p-4 bg-gradient-to-br from-emerald-500 to-teal-500 text-white rounded-xl hover:scale-105 transition-transform shadow-lg"
                  >
                    {action.icon}
                    <span className="font-semibold mt-2">{action.title}</span>
                    <span className="text-xs opacity-90">
                      {action.description}
                    </span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Activity Updates */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-600" />
                Your Activity Updates
              </CardTitle>
              <p className="text-gray-600">
                Track your waste management activities and achievements
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Real-time rewards from waste collection */}
              {recentRewards.map((reward) => (
                <div
                  key={`reward-${reward.id}`}
                  className="flex items-start gap-4 p-4 bg-emerald-50 rounded-lg border border-emerald-200"
                >
                  <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-gray-900">
                        Waste Collection Completed
                      </h4>
                      <Badge className="bg-emerald-100 text-emerald-700">
                        +{reward.pointsAwarded} coins
                      </Badge>
                    </div>
                    <p className="text-gray-700 mb-2">
                      Your waste was successfully collected and you earned {reward.pointsAwarded} coins!
                    </p>
                    <p className="text-sm text-gray-500">{formatTimeAgo(reward.timestamp)}</p>
                  </div>
                </div>
              ))}
              
              {/* Static mock updates */}
              {updates.map((update) => (
                <div
                  key={`update-${update.id}`}
                  className="flex items-start gap-4 p-4 bg-green-50 rounded-lg border border-green-200"
                >
                  <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-gray-900">
                        {update.title}
                      </h4>
                      <div className="flex gap-2">
                        {update.coins && (
                          <Badge className="bg-emerald-100 text-emerald-700">
                            +{update.coins} coins
                          </Badge>
                        )}
                        {update.scoreChange && (
                          <Badge className="bg-blue-100 text-blue-700">
                            {update.scoreChange} score
                          </Badge>
                        )}
                      </div>
                    </div>
                    <p className="text-gray-700 mb-2">{update.message}</p>
                    <p className="text-sm text-gray-500">{update.time}</p>
                  </div>
                </div>
              ))}

              {/* Empty state when no activities */}
              {recentRewards.length === 0 && updates.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Activity className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No recent activities</p>
                  <p className="text-sm">Start collecting waste to see your progress!</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Collections */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-600" />
                Your Upcoming Collections
              </CardTitle>
              <p className="text-gray-600">
                Personalized collection schedule based on your activities
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {schedules.map((schedule) => (
                  <div
                    key={schedule.id}
                    className="p-4 bg-blue-50 rounded-lg border border-blue-200"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
                          <Recycle className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="font-semibold text-gray-900">
                          {schedule.type}
                        </h3>
                      </div>
                      <Badge
                        className={`${
                          schedule.status === "scheduled"
                            ? "bg-green-100 text-green-700"
                            : schedule.status === "ready"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {schedule.status}
                      </Badge>
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-gray-700">
                        <Calendar className="w-4 h-4 text-emerald-600" />
                        <span>{schedule.date}</span>
                        <Clock className="w-4 h-4 ml-2 text-emerald-600" />
                        <span>{schedule.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <MapPin className="w-4 h-4 text-emerald-600" />
                        <span>{schedule.location}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm mb-4">
                      <span className="flex items-center gap-1 bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
                        <Gift className="w-3 h-3" />
                        {schedule.coins} coins
                      </span>
                      <span className="flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                        <Package className="w-3 h-3" />
                        {schedule.weight}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white">
                        {schedule.status === "scheduled"
                          ? "Mark as Ready"
                          : schedule.status === "ready"
                          ? "Track Collection"
                          : "View Details"}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => onPageChange("requests")}
                        className="border-emerald-500 text-emerald-600 hover:bg-emerald-50"
                      >
                        Modify
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-emerald-600" />
                </div>
                <div className="text-2xl font-bold text-emerald-600 mb-1">
                  {communityStats.totalUsers?.toLocaleString()}
                </div>
                <div className="text-gray-600 text-sm">Active Users</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Recycle className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {communityStats.wasteCollected}
                </div>
                <div className="text-gray-600 text-sm">Tons Collected</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Award className="w-6 h-6 text-teal-600" />
                </div>
                <div className="text-2xl font-bold text-teal-600 mb-1">
                  {communityStats.societiesServed}
                </div>
                <div className="text-gray-600 text-sm">Societies Served</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Gift className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="text-2xl font-bold text-yellow-600 mb-1">
                  {communityStats.coinsDistributed?.toLocaleString()}
                </div>
                <div className="text-gray-600 text-sm">Coins Distributed</div>
              </CardContent>
            </Card>
          </div>

          {/* Community Feedbacks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-emerald-600" />
                Community Feedbacks
              </CardTitle>
              <p className="text-gray-600">
                What our users are saying about the service
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {feedbacks.map((feedback) => (
                <div
                  key={feedback.id}
                  className="p-4 bg-green-50 rounded-lg border border-green-200"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-semibold">
                        {feedback.userName.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {feedback.userName}
                          </h4>
                          <p className="text-gray-600 text-sm">
                            {feedback.userSociety}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }, (_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < feedback.rating
                                  ? "text-yellow-400 fill-current"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-700 mb-3">{feedback.message}</p>
                      <div className="flex items-center gap-4 text-gray-500 text-sm">
                        <button className="flex items-center gap-1 hover:text-emerald-600">
                          <ThumbsUp className="w-4 h-4" />
                          <span>{feedback.likes}</span>
                        </button>
                        <span>{feedback.time}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* About Us + Community Activities */}
          {/* Community Activities */}
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-emerald-600 mb-4">
              Community Activities
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-4 bg-green-50 p-4 rounded-lg shadow hover:shadow-md transition-all">
                <Zap className="w-6 h-6 text-emerald-500 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900">
                    Monthly Clean-Up Drives
                  </h4>
                  <p className="text-gray-700 text-sm">
                    Societies come together every month to clean public spaces
                    and spread awareness.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-green-50 p-4 rounded-lg shadow hover:shadow-md transition-all">
                <Gift className="w-6 h-6 text-yellow-500 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900">
                    Plastic Reward Challenges
                  </h4>
                  <p className="text-gray-700 text-sm">
                    Citizens earn coins by collecting and submitting recyclable
                    plastic waste.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-green-50 p-4 rounded-lg shadow hover:shadow-md transition-all">
                <MessageCircle className="w-6 h-6 text-blue-500 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900">
                    Sustainability Workshops
                  </h4>
                  <p className="text-gray-700 text-sm">
                    Learn composting, zero-waste living, and segregation best
                    practices.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 bg-green-50 p-4 rounded-lg shadow hover:shadow-md transition-all">
                <Award className="w-6 h-6 text-purple-500 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900">
                    Society Leaderboards
                  </h4>
                  <p className="text-gray-700 text-sm">
                    Compete with other societies for rewards based on eco-friendly
                    habits.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="mt-8 p-6 bg-emerald-50 border border-emerald-200 rounded-xl shadow-sm">
            <h2 className="text-2xl font-bold text-emerald-700 mb-2">
              Contact Us
            </h2>
            <p className="text-gray-700">
              📧 Email:{" "}
              <a
                href="mailto:cleanbage.jamnagar@gmail.com"
                className="text-emerald-600 underline"
              >
                cleanbage.jamnagar@gmail.com
              </a>
              <br />
              📞 Phone: +91 98765 43210
              <br />
              🏢 Address: CLEANBAGE Initiative, Jamnagar Municipal Office,
              Gujarat, India
            </p>
          </div>
        </div>
      </div>
      {/* <div className="container mx-auto">
        {selectedAction && (
          <button
            onClick={() => setSelectedAction(null)}
            className="m-4 px-4 py-2 text-sm text-teal-600"
          >
            ← Back to Quick Actions
          </button>
        )}
        {renderActionContent()}
      </div> */}
    </div>
  )
}
