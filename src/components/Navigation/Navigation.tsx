"use client"

import type React from "react"
import { useState } from "react"
import { useAuth } from "../../contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { TrendingUp, BarChart3, MessageSquare, LogOut, User } from "lucide-react"

interface NavigationProps {
  onTabChange?: (tab: string) => void
  currentTab?: string
}

const Navigation: React.FC<NavigationProps> = ({ onTabChange, currentTab = "dashboard" }) => {
  const { user, logout } = useAuth()

  const isActive = (path: string) => currentTab === path

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <button 
              onClick={() => onTabChange?.("dashboard")}
              className="flex items-center space-x-2"
            >
              <TrendingUp className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">WealthManager</span>
            </button>
            <div className="ml-10 flex items-baseline space-x-4">
              <button
                onClick={() => onTabChange?.("dashboard")}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive("dashboard")
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                }`}
              >
                <BarChart3 className="inline-block w-4 h-4 mr-2" />
                Dashboard
              </button>
              <button
                onClick={() => onTabChange?.("query")}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive("query")
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                }`}
              >
                <MessageSquare className="inline-block w-4 h-4 mr-2" />
                AI Query
              </button>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-700">
              <User className="h-4 w-4" />
              <span>{user?.username}</span>
            </div>
            <Button variant="outline" size="sm" onClick={logout} className="flex items-center space-x-2 bg-transparent">
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navigation
