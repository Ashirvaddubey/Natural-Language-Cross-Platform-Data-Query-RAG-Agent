"use client"

import type React from "react"
import { AuthProvider } from "./contexts/AuthContext"
import { Toaster } from "react-hot-toast"
import { useAuth } from "./contexts/AuthContext"
import Login from "./components/Auth/Login"
import Register from "./components/Auth/Register"
import Dashboard from "./components/Dashboard/Dashboard"
import QueryInterface from "./components/Query/QueryInterface"
import Navigation from "./components/Navigation/Navigation"
import { useEffect, useState } from "react"

function AppContent() {
  const { isAuthenticated } = useAuth()
  const [mounted, setMounted] = useState(false)
  const [currentTab, setCurrentTab] = useState("dashboard")

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading application...</div>
      </div>
    )
  }

  const renderContent = () => {
    switch (currentTab) {
      case "dashboard":
        return <Dashboard />
      case "query":
        return <QueryInterface />
      default:
        return <Dashboard />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {isAuthenticated ? (
        <>
          <Navigation currentTab={currentTab} onTabChange={setCurrentTab} />
          <div className="p-4">
            {renderContent()}
          </div>
        </>
      ) : (
        <Login />
      )}
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
      <Toaster position="top-right" />
    </AuthProvider>
  )
}

export default App
