"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { dashboardAPI } from "../../services/api"
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Activity, 
  RefreshCw, 
  Sparkles,
  BarChart3,
  Target,
  Award,
  Zap
} from "lucide-react"
import PortfolioChart from "./PortfolioChart"
import RecentTransactions from "./RecentTransactions"
import TopClients from "./TopClients"

interface DashboardStats {
  totalPortfolioValue: number
  totalClients: number
  totalTransactions: number
  monthlyGrowth: number
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const data = await dashboardAPI.getStats()
      setStats(data)
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatCrores = (amount: number) => {
    return `₹${(amount / 10000000).toFixed(2)} Cr`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <RefreshCw className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
            <Sparkles className="h-6 w-6 text-purple-500 absolute -top-2 -right-2 animate-pulse" />
          </div>
          <p className="text-lg font-semibold text-gray-700">Loading your portfolio...</p>
          <p className="text-sm text-gray-500 mt-2">Preparing your wealth insights</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-10">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg">
                  <BarChart3 className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                    Wealth Portfolio
                  </h1>
                  <p className="text-lg text-gray-600 mt-1">Premium Wealth Management Dashboard</p>
                </div>
              </div>
            </div>
            <Button 
              onClick={fetchDashboardData} 
              className="bg-blue-400 hover:bg-blue-500 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Data
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-gray-700">Total Portfolio Value</CardTitle>
              <div className="p-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-lg">
                <DollarSign className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                {stats ? formatCrores(stats.totalPortfolioValue) : "₹0"}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <p className="text-sm text-green-600 font-medium">+{stats?.monthlyGrowth || 0}% from last month</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-gray-700">Total Clients</CardTitle>
              <div className="p-2 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-lg">
                <Users className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                {stats?.totalClients || 0}
              </div>
              <p className="text-sm text-gray-600 mt-2">Premium portfolio holders</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-gray-700">Total Transactions</CardTitle>
              <div className="p-2 bg-gradient-to-r from-purple-400 to-pink-500 rounded-lg">
                <Activity className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {stats?.totalTransactions || 0}
              </div>
              <p className="text-sm text-gray-600 mt-2">This month's activity</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-gray-700">Growth Rate</CardTitle>
              <div className="p-2 bg-gradient-to-r from-orange-400 to-red-500 rounded-lg">
                <Target className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                +{stats?.monthlyGrowth || 0}%
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Zap className="h-4 w-4 text-orange-500" />
                <p className="text-sm text-orange-600 font-medium">Monthly growth</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts and Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                  <BarChart3 className="h-5 w-5 text-white" />
                </div>
                Portfolio Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PortfolioChart />
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                  <Award className="h-5 w-5 text-white" />
                </div>
                Top Performers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <TopClients />
            </CardContent>
          </Card>
        </div>

        {/* Recent Transactions */}
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                <Activity className="h-5 w-5 text-white" />
              </div>
              Recent Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RecentTransactions />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Dashboard
