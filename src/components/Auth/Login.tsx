"use client"

import type React from "react"
import { useState } from "react"
import { useAuth } from "../../contexts/AuthContext"
import Register from "./Register"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, TrendingUp, Shield, User, Lock } from "lucide-react"

const Login: React.FC = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [showRegister, setShowRegister] = useState(false)
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const success = await login(username, password)
    if (success) {
      // Login successful - the parent component will handle the UI change
      console.log("Login successful")
    }

    setLoading(false)
  }

  if (showRegister) {
    return <Register onBack={() => setShowRegister(false)} />
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="w-full max-w-md mx-auto">
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-2xl">
          <CardHeader className="text-center pb-8 pt-10">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg">
                <Shield className="h-10 w-10 text-white" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-2">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-lg text-gray-600">
              Sign in to access your wealth portfolio dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="username" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="Enter your username"
                  className="h-12 px-4 text-base border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="password" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                  className="h-12 px-4 text-base border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <button 
                type="submit" 
                className="w-full h-12 text-base font-semibold bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] rounded-md flex items-center justify-center text-white" 
                style={{ color: 'white !important' }}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-3 h-5 w-5 animate-spin text-white" />
                    <span className="text-white font-bold">Signing in...</span>
                  </>
                ) : (
                  <span className="text-white font-bold">Sign In</span>
                )}
              </button>
            </form>
            <div className="mt-8 text-center">
              <div className="text-sm text-gray-600 mb-4">
                {"Don't have an account? "}
                <button 
                  onClick={() => setShowRegister(true)}
                  className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors"
                >
                  Create account
                </button>
              </div>
              <div className="text-xs text-gray-500">
                Secure access to your wealth management portfolio
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Login
