"use client"

import React, { useEffect } from "react"
import { useScrollToTop } from "../../hooks/useScrollToTop"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  Star,
  Clock,
  CheckCircle,
  Trophy,
  Sparkles,
  Award,
  Heart,
} from "lucide-react"

export default function CommunityActivityPage({ activity, onBack }) {
  // Scroll to top when component mounts
  useScrollToTop()

  if (!activity) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Activity Not Found</h2>
          <p className="text-gray-600 mb-4">The requested activity could not be found.</p>
          <Button onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  const communityActivities = {
    cleanup: {
      id: 'cleanup',
      title: 'Monthly Clean-up Drive',
      description: 'Join us every first Saturday for community cleaning',
      fullDescription: 'Participate in our monthly community clean-up drive and make a real impact on your neighborhood. This event brings together residents to clean public spaces, parks, and streets while building stronger community bonds.',
      icon: Users,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      buttonColor: 'bg-emerald-500 hover:bg-emerald-600',
      gradientFrom: 'from-emerald-400',
      gradientTo: 'to-blue-500',
      details: {
        date: 'First Saturday of every month',
        time: '8:00 AM - 12:00 PM',
        location: 'Community Center Parking Lot',
        participants: 45,
        tools: 'Provided (gloves, bags, tools)',
        rewards: '50 EcoCoins + Achievement Badge',
        nextEvent: 'February 3, 2024',
        difficulty: 'Easy',
        duration: '4 hours',
        meetingPoint: 'Main entrance of Community Center'
      }
    },
    workshop: {
      id: 'workshop',
      title: 'Recycling Workshops',
      description: 'Learn creative ways to reuse waste materials',
      fullDescription: 'Discover innovative techniques to transform waste materials into useful items. Learn from experts and contribute to a circular economy through creative recycling and upcycling projects.',
      icon: Award,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200', 
      buttonColor: 'bg-blue-500 hover:bg-blue-600',
      gradientFrom: 'from-green-400',
      gradientTo: 'to-teal-500',
      details: {
        date: 'Every Wednesday',
        time: '6:00 PM - 8:00 PM',
        location: 'Community Hall',
        participants: 28,
        materials: 'Paper, plastic, glass',
        instructor: 'Expert crafters',
        rewards: '30 EcoCoins per session',
        nextSession: 'January 31, 2024',
        difficulty: 'Medium',
        duration: '2 hours',
        skillLevel: 'Beginner to Advanced'
      }
    },
    competition: {
      id: 'competition',
      title: 'Eco-friendly Competitions',
      description: 'Participate in sustainability challenges',
      fullDescription: 'Test your environmental knowledge and sustainable living skills in friendly competitions. Win prizes while learning about eco-friendly practices and connecting with like-minded community members.',
      icon: Trophy,
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      buttonColor: 'bg-teal-500 hover:bg-teal-600',
      gradientFrom: 'from-yellow-400',
      gradientTo: 'to-orange-500',
      details: {
        date: 'Monthly competitions',
        time: 'Various times',
        location: 'Online & Community Center',
        participants: 67,
        categories: 'Trivia, Photo Contest, Innovation',
        prizes: 'Eco-friendly products',
        rewards: '100+ EcoCoins for winners',
        nextCompetition: 'February 15, 2024',
        difficulty: 'Various levels',
        duration: '1-3 hours',
        registrationDeadline: 'February 10, 2024'
      }
    }
  }

  const activityData = communityActivities[activity]
  const IconComponent = activityData.icon

  const handleJoin = () => {
    alert(`🎉 Successfully registered for ${activityData.title}! Check your notifications for updates and confirmation details.`)
    onBack()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={onBack}
            className="flex items-center gap-2 hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Leaderboard
          </Button>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>Community Activities</span>
          </div>
        </div>

        {/* Hero Section */}
        <div className={`bg-gradient-to-r ${activityData.gradientFrom} ${activityData.gradientTo} rounded-2xl p-8 text-white relative overflow-hidden`}>
          <div className="absolute top-4 right-4 opacity-20">
            <IconComponent className="w-32 h-32" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <IconComponent className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-2">{activityData.title}</h1>
                <p className="text-xl opacity-90">{activityData.description}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="w-5 h-5" />
                  <span className="font-semibold">Next Event</span>
                </div>
                <p className="text-sm opacity-90">
                  {activityData.details.nextEvent || activityData.details.nextSession || activityData.details.nextCompetition}
                </p>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-1">
                  <Users className="w-5 h-5" />
                  <span className="font-semibold">Participants</span>
                </div>
                <p className="text-sm opacity-90">{activityData.details.participants} people joined</p>
              </div>
              <div className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-1">
                  <Star className="w-5 h-5" />
                  <span className="font-semibold">Rewards</span>
                </div>
                <p className="text-sm opacity-90">{activityData.details.rewards}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Left Column - Details */}
          <div className="md:col-span-2 space-y-6">
            {/* About Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-600" />
                  About This Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 text-lg leading-relaxed mb-4">
                  {activityData.fullDescription}
                </p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span className="text-gray-600">Duration: </span>
                    <span className="font-medium">{activityData.details.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-yellow-600" />
                    <span className="text-gray-600">Difficulty: </span>
                    <span className="font-medium">{activityData.details.difficulty}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Schedule & Location */}
            <Card>
              <CardHeader>
                <CardTitle>Schedule & Location</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Date & Time</p>
                      <p className="text-gray-600">{activityData.details.date}</p>
                      <p className="text-gray-600 font-medium">{activityData.details.time}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Location</p>
                      <p className="text-gray-600">{activityData.details.location}</p>
                      {activityData.details.meetingPoint && (
                        <p className="text-sm text-gray-500 mt-1">Meet at: {activityData.details.meetingPoint}</p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Additional Info */}
            <Card>
              <CardHeader>
                <CardTitle>What to Expect</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  {activityData.details.tools && (
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-teal-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">Tools & Materials</p>
                        <p className="text-gray-600 text-sm">{activityData.details.tools}</p>
                      </div>
                    </div>
                  )}
                  {activityData.details.materials && (
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-teal-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">Materials</p>
                        <p className="text-gray-600 text-sm">{activityData.details.materials}</p>
                      </div>
                    </div>
                  )}
                  {activityData.details.instructor && (
                    <div className="flex items-start gap-3">
                      <Users className="w-5 h-5 text-purple-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">Instructor</p>
                        <p className="text-gray-600 text-sm">{activityData.details.instructor}</p>
                      </div>
                    </div>
                  )}
                  {activityData.details.categories && (
                    <div className="flex items-start gap-3">
                      <Trophy className="w-5 h-5 text-orange-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">Categories</p>
                        <p className="text-gray-600 text-sm">{activityData.details.categories}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Action & Stats */}
          <div className="space-y-6">
            {/* Join Action */}
            <Card>
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-full flex items-center justify-center mx-auto">
                    <Heart className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Ready to Join?</h3>
                    <p className="text-gray-600 text-sm mb-4">
                      Be part of making a positive impact in our community
                    </p>
                  </div>
                  <Button 
                    size="lg"
                    className={`w-full ${activityData.buttonColor} text-white font-semibold py-3 rounded-xl hover:scale-105 transition-all duration-200`}
                    onClick={handleJoin}
                  >
                    <Star className="w-5 h-5 mr-2" />
                    {activity === 'cleanup' ? 'Join Clean-up Drive' : 
                     activity === 'workshop' ? 'Register for Workshop' : 
                     'Enter Competition'}
                  </Button>
                  <p className="text-xs text-gray-500">
                    Free to join • Earn rewards • Make friends
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Activity Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Participants</span>
                  <span className="font-bold text-purple-600">{activityData.details.participants}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Difficulty Level</span>
                  <span className="font-bold text-blue-600">{activityData.details.difficulty}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-bold text-green-600">{activityData.details.duration}</span>
                </div>
                {activityData.details.registrationDeadline && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Deadline</span>
                    <span className="font-bold text-red-600 text-sm">{activityData.details.registrationDeadline}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Benefits */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Benefits</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-gray-700">Earn EcoCoins</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-gray-700">Get achievement badges</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-gray-700">Meet like-minded people</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-gray-700">Make environmental impact</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-gray-700">Learn new skills</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
