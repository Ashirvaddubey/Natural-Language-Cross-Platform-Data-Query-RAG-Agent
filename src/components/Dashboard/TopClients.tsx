"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { dashboardAPI } from "../../services/api"
import { Trophy, Crown, Medal, Star, Loader2, TrendingUp } from "lucide-react"

interface Client {
  id: string
  name: string
  portfolioValue: number
  riskAppetite: string
}

const TopClients: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTopClients = async () => {
      try {
        const data = await dashboardAPI.getTopClients()
        setClients(data)
      } catch (error) {
        console.error("Failed to fetch top clients:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTopClients()
  }, [])

  const formatCrores = (amount: number) => {
    return `₹${(amount / 10000000).toFixed(2)} Cr`
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Crown className="h-4 w-4 text-yellow-500" />
      case 1:
        return <Trophy className="h-4 w-4 text-gray-400" />
      case 2:
        return <Medal className="h-4 w-4 text-amber-600" />
      default:
        return <Star className="h-4 w-4 text-blue-500" />
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'low':
        return 'text-green-600 bg-green-100'
      case 'medium':
        return 'text-yellow-600 bg-yellow-100'
      case 'high':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="h-full">
      {loading ? (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
            <span className="text-sm text-gray-500">Loading top performers...</span>
          </div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4 p-3 rounded-lg bg-gray-50/50">
              <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
              </div>
              <div className="h-6 bg-gray-200 rounded w-16 animate-pulse"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Top Performers</h3>
              <p className="text-sm text-gray-600">Highest portfolio value clients</p>
            </div>
            <div className="flex items-center gap-2 text-green-600">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm font-medium">Growing</span>
            </div>
          </div>

          <div className="space-y-3">
            {clients.map((client, index) => (
              <div 
                key={client.id} 
                className="flex items-center space-x-4 p-4 rounded-xl bg-gradient-to-r from-white/80 to-gray-50/50 backdrop-blur-sm border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]"
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <span className="text-sm font-bold text-gray-700 w-6 h-6 flex items-center justify-center">
                      {index + 1}
                    </span>
                    <div className="absolute -top-1 -right-1">
                      {getRankIcon(index)}
                    </div>
                  </div>
                  <Avatar className="ring-2 ring-blue-100">
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold">
                      {getInitials(client.name)}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{client.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getRiskColor(client.riskAppetite)}`}>
                      {client.riskAppetite} Risk
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    {formatCrores(client.portfolioValue)}
                  </div>
                  <div className="text-xs text-gray-500">Portfolio Value</div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-800">Total Top Clients</p>
                <p className="text-xs text-gray-600">Premium portfolio holders</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-600">{clients.length}</p>
                <p className="text-xs text-gray-500">Active</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TopClients
