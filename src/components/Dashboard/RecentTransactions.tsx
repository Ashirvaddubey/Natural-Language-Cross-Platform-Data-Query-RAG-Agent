"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { dashboardAPI } from "../../services/api"
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Loader2,
  TrendingUp,
  DollarSign
} from "lucide-react"

interface Transaction {
  id: string
  clientName: string
  type: "BUY" | "SELL"
  amount: number
  stock: string
  date: string
  status: "COMPLETED" | "PENDING" | "FAILED"
}

const RecentTransactions: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const data = await dashboardAPI.getRecentTransactions()
        setTransactions(data)
      } catch (error) {
        console.error("Failed to fetch transactions:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTransactions()
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-800 border-green-200"
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "FAILED":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return <CheckCircle className="h-4 w-4" />
      case "PENDING":
        return <Clock className="h-4 w-4" />
      case "FAILED":
        return <XCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getTypeColor = (type: string) => {
    return type === "BUY" ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50"
  }

  const getTypeIcon = (type: string) => {
    return type === "BUY" ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />
  }

  return (
    <div className="h-full">
      {loading ? (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
            <span className="text-sm text-gray-500">Loading recent transactions...</span>
          </div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-gray-50/50 border border-gray-100">
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
              </div>
              <div className="w-20 h-6 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Recent Activity</h3>
              <p className="text-sm text-gray-600">Latest portfolio transactions</p>
            </div>
            <div className="flex items-center gap-2 text-blue-600">
              <DollarSign className="h-4 w-4" />
              <span className="text-sm font-medium">Live</span>
            </div>
          </div>

          <div className="space-y-3">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-white/80 to-gray-50/50 backdrop-blur-sm border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:scale-[1.01]"
              >
                <div className="flex items-center space-x-4 flex-1">
                  <div className={`p-2 rounded-lg ${getTypeColor(transaction.type)}`}>
                    {getTypeIcon(transaction.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <span className="font-semibold text-gray-900">{transaction.clientName}</span>
                      <span className={`font-bold ${transaction.type === 'BUY' ? 'text-green-600' : 'text-red-600'}`}>
                        {transaction.type}
                      </span>
                      <span className="text-gray-600 font-medium">{transaction.stock}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                      <span>{new Date(transaction.date).toLocaleDateString("en-IN", {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}</span>
                      <span className="font-semibold text-gray-700">{formatCurrency(transaction.amount)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={`${getStatusColor(transaction.status)} flex items-center gap-1 px-3 py-1`}>
                    {getStatusIcon(transaction.status)}
                    {transaction.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-800">Transaction Summary</p>
                <p className="text-xs text-gray-600">This month's activity</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-600">{transactions.length}</p>
                <p className="text-xs text-gray-500">Total Transactions</p>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-lg font-bold text-green-600">
                  {transactions.filter(t => t.status === 'COMPLETED').length}
                </p>
                <p className="text-xs text-gray-500">Completed</p>
              </div>
              <div>
                <p className="text-lg font-bold text-yellow-600">
                  {transactions.filter(t => t.status === 'PENDING').length}
                </p>
                <p className="text-xs text-gray-500">Pending</p>
              </div>
              <div>
                <p className="text-lg font-bold text-red-600">
                  {transactions.filter(t => t.status === 'FAILED').length}
                </p>
                <p className="text-xs text-gray-500">Failed</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default RecentTransactions
