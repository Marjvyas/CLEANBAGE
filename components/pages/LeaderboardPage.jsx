"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Trophy,
  Medal,
  Star,
  Target,
  CheckCircle,
  Award,
  Users,
  TrendingUp,
  Zap,
  Sparkles,
  Crown,
  Activity,
  Calendar,
} from "lucide-react"

export default function LeaderboardPage({ user, setActivePage }) {
  const [societies, setSocieties] = useState([])
  const [tasks, setTasks] = useState([])
  const [userStats, setUserStats] = useState({})
  const [achievements, setAchievements] = useState([])

  useEffect(() => {
    const mockSocieties = [
      { id: 1, name: "Green Valley Society", points: 2450, rank: 1, members: 156, change: "+12", avatar: "GV" },
      { id: 2, name: "Eco Heights", points: 2380, rank: 2, members: 142, change: "+8", avatar: "EH" },
      { id: 3, name: "Sustainable Living", points: 2290, rank: 3, members: 134, change: "+15", avatar: "SL" },
      { id: 4, name: "Nature's Paradise", points: 2180, rank: 4, members: 128, change: "-2", avatar: "NP" },
      { id: 5, name: user.society, points: 2050, rank: 5, members: 119, change: "+5", avatar: "YS", isUser: true },
    ]

    const mockTasks = [
      {
        id: 1,
        title: "Organic Waste Segregation",
        description: "Properly segregate organic waste for composting",
        points: 10,
        difficulty: "Easy",
        completed: true,
        userProgress: 100,
        deadline: "2024-01-15",
        category: "Daily",
      },
      {
        id: 2,
        title: "Plastic Bottle Collection",
        description: "Collect and submit 20 plastic bottles",
        points: 25,
        difficulty: "Medium",
        completed: false,
        progress: 15,
        userProgress: 75,
        deadline: "2024-01-20",
        category: "Weekly",
      },
      {
        id: 3,
        title: "E-Waste Drive Participation",
        description: "Participate in monthly e-waste collection drive",
        points: 50,
        difficulty: "Hard",
        completed: false,
        userProgress: 0,
        deadline: "2024-01-30",
        category: "Monthly",
      },
      {
        id: 4,
        title: "Community Clean-up",
        description: "Join weekend community cleaning activity",
        points: 30,
        difficulty: "Medium",
        completed: false,
        userProgress: 25,
        deadline: "2024-01-18",
        category: "Event",
      },
    ]

    const mockUserStats = {
      currentRank: user.rank || 0,
      totalPoints: user.coins * 2,
      weeklyProgress: 85,
      tasksCompleted: 12,
      streakDays: 7,
    }

    const mockAchievements = [
      { name: "Eco Warrior", description: "Completed 50 waste collection tasks", earned: true, rarity: "gold" },
      { name: "Green Champion", description: "Earned 1000 EcoCoins", earned: true, rarity: "silver" },
      { name: "Community Leader", description: "Organized 5 community events", earned: false, rarity: "platinum" },
      { name: "Recycling Master", description: "Recycled 100kg of waste", earned: true, rarity: "gold" },
    ]

    setSocieties(mockSocieties)
    setTasks(mockTasks)
    setUserStats(mockUserStats)
    setAchievements(mockAchievements)
  }, [user.society, user.rank, user.coins])

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />
      case 3:
        return <Medal className="w-6 h-6 text-yellow-600" />
      default:
        return (
          <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-sm font-bold text-gray-600">
            {rank}
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="page-enhanced-blur p-4 space-y-6">
        {/* Hero Header */}
        <div className="text-center py-8">
          <div className="w-16 h-16 rounded-full bg-yellow-100 shadow-lg ring-2 ring-yellow-400/30 flex items-center justify-center mx-auto mb-4 hover:scale-105 transition-transform duration-300">
  <Trophy className="w-8 h-8 text-yellow-600 drop-shadow-md" />
</div>

          <h1 className="text-4xl font-bold text-gray-900 mb-2">Society Leaderboard</h1>
          <p className="text-gray-600 text-lg">Compete with communities and climb the rankings</p>
          <div className="mt-4 inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border">
            <Award className="w-4 h-4 text-yellow-600" />
            <span className="text-gray-700 font-medium">Your Rank: #{userStats.currentRank || 'N/A'}</span>
          </div>
        </div>

        {/* User Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Trophy className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="text-2xl font-bold text-yellow-600 mb-1">#{userStats.currentRank || 'N/A'}</div>
              <div className="text-gray-600 text-sm">Current Rank</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Star className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {userStats.totalPoints || 0}
              </div>
              <div className="text-gray-600 text-sm">Total Points</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-6 h-6 text-teal-600" />
              </div>
              <div className="text-2xl font-bold text-teal-600 mb-1">{userStats.weeklyProgress || 0}%</div>
              <div className="text-gray-600 text-sm">Weekly Progress</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-green-600 mb-1">{userStats.tasksCompleted || 0}</div>
              <div className="text-gray-600 text-sm">Tasks Done</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Zap className="w-6 h-6 text-orange-600" />
              </div>
              <div className="text-2xl font-bold text-orange-600 mb-1">{userStats.streakDays || 0}</div>
              <div className="text-gray-600 text-sm">Day Streak</div>
            </CardContent>
          </Card>
        </div>

        {/* Society Rankings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-600" />
              Top Societies
            </CardTitle>
            <p className="text-gray-600">See how your society ranks against others</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {societies.map((society) => (
              <div
                key={society.id}
                className={`flex items-center justify-between p-4 rounded-lg border ${
                  society.isUser ? "bg-yellow-50 border-yellow-200" : "bg-blue-50 border-blue-200"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    {getRankIcon(society.rank)}
                    <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">{society.avatar}</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      {society.name}
                      {society.isUser && <Badge className="bg-yellow-100 text-yellow-700">Your Society</Badge>}
                    </h3>
                    <p className="text-gray-600 text-sm">{society.members} members</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-xl font-bold text-gray-900">{society.points}</span>
                    <span className="text-gray-600 text-sm">pts</span>
                  </div>
                  <Badge
                    className={`text-xs ${
                      society.change.startsWith("+") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}
                  >
                    {society.change}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Available Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" />
              Available Tasks
            </CardTitle>
            <p className="text-gray-600">Complete tasks to earn points and climb the leaderboard</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tasks.map((task) => (
                <div key={task.id} className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-gray-900">{task.title}</h3>
                        {task.completed && <CheckCircle className="w-5 h-5 text-green-500" />}
                      </div>
                      <p className="text-gray-600 text-sm mb-3">{task.description}</p>

                      {/* Progress Bar */}
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                        <div
                          className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${task.userProgress}%` }}
                        ></div>
                      </div>

                      <div className="flex items-center gap-3 text-sm mb-3">
                        <span className="flex items-center gap-1 text-gray-600">
                          <Calendar className="w-4 h-4" />
                          {task.deadline}
                        </span>
                        <Badge className="bg-blue-100 text-blue-700 text-xs">{task.category}</Badge>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <div className="flex items-center space-x-1 text-emerald-600 mb-2">
                        <Star className="w-4 h-4" />
                        <span className="font-bold">{task.points}</span>
                      </div>
                      <Badge
                        className={`text-xs ${
                          task.difficulty === "Easy"
                            ? "bg-green-100 text-green-700"
                            : task.difficulty === "Medium"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                        }`}
                      >
                        {task.difficulty}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {task.completed ? (
                      <Button className="flex-1 bg-green-500 hover:bg-green-600 text-white">Completed ✓</Button>
                    ) : (
                      <Button className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white">Start Task</Button>
                    )}
                    <Button variant="outline" className="border-blue-500 text-blue-600 hover:bg-blue-50 bg-transparent">
                      Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-600" />
              Your Achievements
            </CardTitle>
            <p className="text-gray-600">Unlock badges and show off your eco-warrior status</p>
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
                    <div className="flex-1">
                      <h3 className={`font-semibold ${achievement.earned ? "text-gray-900" : "text-gray-500"}`}>
                        {achievement.name}
                      </h3>
                      <p className={`text-sm ${achievement.earned ? "text-gray-600" : "text-gray-400"}`}>
                        {achievement.description}
                      </p>
                      <Badge
                        className={`mt-1 text-xs ${
                          achievement.earned ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {achievement.rarity}
                      </Badge>
                    </div>
                    {achievement.earned && <CheckCircle className="w-5 h-5 text-green-500" />}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Community Activities */}
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Users className="w-5 h-5 text-emerald-600" />
              Community Activities
              <Sparkles className="w-5 h-5 text-blue-500" />
            </CardTitle>
            <p className="text-gray-600">Join community events and boost your society's ranking</p>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-6 bg-blue-50 rounded-lg border border-blue-200">
                <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Monthly Clean-up Drive</h4>
                <p className="text-gray-600 text-sm mb-4">Join us every first Saturday for community cleaning</p>
                <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">Join Event</Button>
              </div>
              <div className="text-center p-6 bg-green-50 rounded-lg border border-green-200">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Recycling Workshops</h4>
                <p className="text-gray-600 text-sm mb-4">Learn creative ways to reuse waste materials</p>
                <Button className="bg-blue-500 hover:bg-blue-600 text-white">Register</Button>
              </div>
              <div className="text-center p-6 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Eco-friendly Competitions</h4>
                <p className="text-gray-600 text-sm mb-4">Participate in sustainability challenges</p>
                <Button className="bg-teal-500 hover:bg-teal-600 text-white">Compete</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </div>
  )
}
