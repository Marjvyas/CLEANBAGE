"use client"

import React, { useState, useEffect, useMemo } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Gift,
  Star,
  Zap,
  Sparkles,
  Package,
  Award,
  ShoppingCart,
  Clock,
  Users,
  TrendingUp,
  Crown,
  Heart,
  Leaf,
} from "lucide-react"
import { useUser } from "../../context/UserContext"
import UserBalance from "../UserBalance"

export default React.memo(function RewardsPage({ user, setActivePage }) {
  const [rewards, setRewards] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [userStats, setUserStats] = useState({})
  const [specialOffers, setSpecialOffers] = useState([])
  
  // Get real-time user balance from UserContext
  const { userBalance, refreshUserData } = useUser()

  useEffect(() => {
    // Refresh user data when rewards page loads
    refreshUserData()
  }, [])

  useEffect(() => {
    const mockRewards = [
      {
        id: 1,
        name: "Bamboo Water Bottle",
        description: "Eco-friendly bamboo water bottle with steel interior",
        originalPrice: 299,
        discountedPrice: 199,
        coins: 50,
        image: "/placeholder.svg?height=100&width=100",
        category: "Eco-Products",
        inStock: true,
        rating: 4.8,
        reviews: 124,
        popularity: "trending",
        sustainability: 95,
      },
      {
        id: 2,
        name: "Organic Cotton Tote Bag",
        description: "Reusable organic cotton shopping bag",
        originalPrice: 199,
        discountedPrice: 99,
        coins: 30,
        image: "/placeholder.svg?height=100&width=100",
        category: "Eco-Products",
        inStock: true,
        rating: 4.6,
        reviews: 89,
        popularity: "popular",
        sustainability: 90,
      },
      {
        id: 3,
        name: "Solar Power Bank",
        description: "10000mAh solar-powered portable charger",
        originalPrice: 1299,
        discountedPrice: 899,
        coins: 100,
        image: "/placeholder.svg?height=100&width=100",
        category: "Electronics",
        inStock: true,
        rating: 4.9,
        reviews: 256,
        popularity: "bestseller",
        sustainability: 85,
      },
      {
        id: 4,
        name: "Compost Bin Kit",
        description: "Complete home composting solution",
        originalPrice: 799,
        discountedPrice: 499,
        coins: 80,
        image: "/placeholder.svg?height=100&width=100",
        category: "Garden",
        inStock: false,
        rating: 4.7,
        reviews: 67,
        popularity: "new",
        sustainability: 98,
      },
      {
        id: 5,
        name: "LED Plant Grow Light",
        description: "Energy-efficient LED grow light for indoor plants",
        originalPrice: 599,
        discountedPrice: 399,
        coins: 60,
        image: "/placeholder.svg?height=100&width=100",
        category: "Garden",
        inStock: true,
        rating: 4.5,
        reviews: 43,
        popularity: "trending",
        sustainability: 88,
      },
      {
        id: 6,
        name: "Recycled Paper Notebook Set",
        description: "Set of 3 notebooks made from recycled paper",
        originalPrice: 149,
        discountedPrice: 79,
        coins: 25,
        image: "/placeholder.svg?height=100&width=100",
        category: "Stationery",
        inStock: true,
        rating: 4.4,
        reviews: 156,
        popularity: "popular",
        sustainability: 92,
      },
    ]

    const mockCategories = ["All", "Eco-Products", "Electronics", "Garden", "Stationery"]

    const mockUserStats = {
      availableCoins: userBalance || 0, // Use real-time balance from UserContext
      totalEarned: (userBalance || 0) * 2, // Estimate total earned
      totalRedeemed: 245,
      itemsPurchased: 8,
      favoriteCategory: "Eco-Products",
      membershipLevel: userBalance >= 100 ? "Gold" : userBalance >= 50 ? "Silver" : "Bronze",
    }

    const mockSpecialOffers = [
      {
        id: 1,
        title: "Weekend Flash Sale",
        description: "Get 20% extra discount on all eco-products this weekend!",
        discount: 20,
        validUntil: "2024-01-15",
        category: "Eco-Products",
        type: "flash",
      },
      {
        id: 2,
        title: "Bulk Purchase Bonus",
        description: "Buy 3 or more items and get 50 bonus EcoCoins!",
        bonus: 50,
        minItems: 3,
        type: "bonus",
      },
      {
        id: 3,
        title: "New Member Special",
        description: "First-time buyers get 30% off on any item!",
        discount: 30,
        type: "newbie",
      },
    ]

    setRewards(mockRewards)
    setCategories(mockCategories)
    setUserStats(mockUserStats)
    setSpecialOffers(mockSpecialOffers)
  }, [userBalance]) // Update when balance changes

  const filteredRewards =
    selectedCategory === "All" ? rewards : rewards.filter((reward) => reward.category === selectedCategory)

  const canAfford = (coins) => userStats.availableCoins >= coins

  const getPopularityIcon = (popularity) => {
    switch (popularity) {
      case "bestseller":
        return <Crown className="w-4 h-4 text-yellow-500" />
      case "trending":
        return <TrendingUp className="w-4 h-4 text-blue-500" />
      case "popular":
        return <Heart className="w-4 h-4 text-red-500" />
      case "new":
        return <Sparkles className="w-4 h-4 text-green-500" />
      default:
        return null
    }
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
      />
    ))
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="page-enhanced-blur p-4 space-y-6">
        {/* Hero Header */}
        <div className="text-center py-8">
          <div className="w-16 h-16 rounded-full bg-green-100 shadow-lg ring-2 ring-green-400/30 flex items-center justify-center mx-auto mb-4 hover:scale-105 transition-transform duration-300">
            <Gift className="w-8 h-8 text-green-600 drop-shadow-md" />
          </div>
          
          <h1 className="text-4xl font-bold text-white mb-2">Eco Rewards Store</h1>
          <p className="text-white text-lg">Redeem your EcoCoins for sustainable products</p>

          {/* Real-time Balance Component */}
          <div className="mt-6">
            <UserBalance showAnimation={true} compact={false} />
          </div>
        </div>

        {/* User Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="text-center border-emerald-200 bg-gradient-to-br from-emerald-50 to-green-50">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                <Gift className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-emerald-600 mb-1">{userStats.availableCoins}</div>
              <div className="text-emerald-700 text-sm font-medium">Available Coins</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-blue-600 mb-1">{userStats.totalEarned}</div>
              <div className="text-gray-600 text-sm">Total Earned</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <ShoppingCart className="w-6 h-6 text-teal-600" />
              </div>
              <div className="text-2xl font-bold text-teal-600 mb-1">{userStats.itemsPurchased}</div>
              <div className="text-gray-600 text-sm">Items Bought</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Award className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="text-lg font-bold text-yellow-600 mb-1">{userStats.membershipLevel}</div>
              <div className="text-gray-600 text-sm">Membership</div>
            </CardContent>
          </Card>
        </div>

        {/* Special Offers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-600" />
              Special Offers
            </CardTitle>
            <p className="text-gray-600">Limited time deals and exclusive bonuses</p>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {specialOffers.map((offer) => (
                <div key={offer.id} className="p-4 bg-yellow-50 rounded-lg border border-yellow-200 flex flex-col h-full">
                  <div className="flex items-center gap-2 mb-3">
                    <Zap className="w-4 h-4 text-yellow-500" />
                    <Badge className="bg-yellow-100 text-yellow-700 text-xs">
                      {offer.type === "flash" ? "Flash Sale" : offer.type === "bonus" ? "Bonus" : "Special"}
                    </Badge>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">{offer.title}</h4>
                  <p className="text-gray-600 text-sm mb-4 flex-grow">{offer.description}</p>
                  {offer.validUntil && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                      <Clock className="w-4 h-4" />
                      <span>Valid until {offer.validUntil}</span>
                    </div>
                  )}
                  <div className="mt-auto">
                    <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white">Claim Offer</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Category Filter */}
        <Card>
          <CardHeader className="text-center">
            <CardTitle>Browse Categories</CardTitle>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  className={`${
                    selectedCategory === category
                      ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                      : "border-emerald-500 text-emerald-600 hover:bg-emerald-50"
                  }`}
                >
                  {category}
                </Button>
              ))}
            </div>
          </CardHeader>
        </Card>

        {/* Affordability Summary */}
        <Card className="border-emerald-200 bg-gradient-to-r from-emerald-50 to-green-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-emerald-800">Shopping Power</h3>
                  <p className="text-emerald-600 text-sm">
                    You can afford {filteredRewards.filter(reward => canAfford(reward.coins)).length} out of {filteredRewards.length} items
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-emerald-700">{userStats.availableCoins}</div>
                <div className="text-emerald-600 text-sm">Available Coins</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rewards Grid */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5 text-green-600" />
              Available Rewards
            </CardTitle>
            <p className="text-gray-600">Sustainable products for your eco-friendly lifestyle</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRewards.map((reward) => (
                <div key={reward.id} className="bg-white rounded-lg border shadow-sm overflow-hidden">
                  <div className="relative h-48">
                    <Image
                      src={reward.image || "/placeholder.svg"}
                      alt={reward.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover"
                      loading="lazy"
                    />
                    {!reward.inStock && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white font-semibold bg-red-500 px-3 py-1 rounded-full">Out of Stock</span>
                      </div>
                    )}
                    <div className="absolute top-3 left-3 flex gap-2">
                      <Badge className="bg-emerald-100 text-emerald-700 text-xs">{reward.category}</Badge>
                      {getPopularityIcon(reward.popularity) && (
                        <div className="bg-white rounded-full p-1">{getPopularityIcon(reward.popularity)}</div>
                      )}
                    </div>
                    <div className="absolute top-3 right-3">
                      <div className="bg-white rounded-full p-2 flex items-center gap-1">
                        <Leaf className="w-4 h-4 text-green-500" />
                        <span className="text-xs font-bold text-green-700">{reward.sustainability}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">{reward.name}</h3>
                    <p className="text-gray-600 text-sm mb-3">{reward.description}</p>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center gap-1">{renderStars(reward.rating)}</div>
                      <span className="text-sm text-gray-600">
                        {reward.rating} ({reward.reviews} reviews)
                      </span>
                    </div>

                    {/* Pricing */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-emerald-600">₹{reward.discountedPrice}</span>
                        <span className="text-sm text-gray-500 line-through">₹{reward.originalPrice}</span>
                      </div>
                      <div className="flex items-center space-x-1 bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
                        <Gift className="w-4 h-4" />
                        <span className="font-bold text-sm">{reward.coins}</span>
                      </div>
                    </div>

                    <Button
                      className={`w-full ${
                        canAfford(reward.coins) && reward.inStock
                          ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                      disabled={!canAfford(reward.coins) || !reward.inStock}
                    >
                      {!reward.inStock
                        ? "Out of Stock"
                        : !canAfford(reward.coins)
                          ? "Insufficient Coins"
                          : "Redeem Now"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Sustainability Impact */}
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Leaf className="w-5 h-5 text-green-600" />
              Your Environmental Impact
              <Sparkles className="w-5 h-5 text-blue-500" />
            </CardTitle>
            <p className="text-gray-600">Every purchase contributes to a greener planet</p>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-green-50 rounded-lg border border-green-200">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Leaf className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Carbon Saved</h4>
                <p className="text-2xl font-bold text-green-600 mb-1">2.5 kg CO₂</p>
                <p className="text-gray-600 text-sm">Through your purchases</p>
              </div>
              <div className="text-center p-6 bg-blue-50 rounded-lg border border-blue-200">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Plastic Avoided</h4>
                <p className="text-2xl font-bold text-blue-600 mb-1">1.2 kg</p>
                <p className="text-gray-600 text-sm">Single-use plastic saved</p>
              </div>
              <div className="text-center p-6 bg-teal-50 rounded-lg border border-teal-200">
                <div className="w-16 h-16 bg-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Communities Helped</h4>
                <p className="text-2xl font-bold text-teal-600 mb-1">5</p>
                <p className="text-gray-600 text-sm">Local eco-businesses supported</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </div>
  )
})
