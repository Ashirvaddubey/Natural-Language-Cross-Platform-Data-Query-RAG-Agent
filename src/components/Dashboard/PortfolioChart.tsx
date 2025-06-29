"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, CartesianGrid, Tooltip } from "recharts"
import { dashboardAPI } from "../../services/api"
import { TrendingUp, Loader2 } from "lucide-react"

interface PortfolioData {
  month: string
  value: number
}

const PortfolioChart: React.FC = () => {
  const [data, setData] = useState<PortfolioData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const chartData = await dashboardAPI.getPortfolioChart()
        setData(chartData)
      } catch (error) {
        console.error("Failed to fetch chart data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchChartData()
  }, [])

  const chartConfig = {
    value: {
      label: "Portfolio Value",
      color: "hsl(var(--chart-1))",
    },
  }

  const formatValue = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg shadow-xl p-4">
          <p className="text-sm font-semibold text-gray-700 mb-2">{label}</p>
          <p className="text-lg font-bold text-blue-600">
            {formatValue(payload[0].value)}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="h-full">
      {loading ? (
        <div className="h-[300px] flex flex-col items-center justify-center space-y-4">
          <div className="relative">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <div className="absolute inset-0 bg-blue-600/20 rounded-full animate-ping"></div>
          </div>
          <p className="text-sm text-gray-500">Loading chart data...</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Performance Overview</h3>
              <p className="text-sm text-gray-600">Monthly portfolio value trends</p>
            </div>
            <div className="flex items-center gap-2 text-green-600">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm font-medium">Growing</span>
            </div>
          </div>
          
          <div className="relative">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <defs>
                  <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#1D4ED8" stopOpacity={0.9}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" opacity={0.3} />
                <XAxis 
                  dataKey="month" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#6B7280' }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#6B7280' }}
                  tickFormatter={(value) => `₹${(value / 1000000).toFixed(1)}M`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="value" 
                  fill="url(#portfolioGradient)"
                  radius={[4, 4, 0, 0]}
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {data.length > 0 ? formatValue(Math.max(...data.map(d => d.value))) : "₹0"}
              </p>
              <p className="text-xs text-gray-500">Peak Value</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {data.length > 0 ? formatValue(Math.min(...data.map(d => d.value))) : "₹0"}
              </p>
              <p className="text-xs text-gray-500">Lowest Value</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">
                {data.length > 0 ? formatValue(data.reduce((sum, d) => sum + d.value, 0) / data.length) : "₹0"}
              </p>
              <p className="text-xs text-gray-500">Average</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PortfolioChart
