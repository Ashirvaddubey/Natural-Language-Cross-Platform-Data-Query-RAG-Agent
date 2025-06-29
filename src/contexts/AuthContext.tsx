"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { authAPI } from "../services/api"
import toast from "react-hot-toast"

interface User {
  id: string
  username: string
  email: string
  role: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<boolean>
  register: (username: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      // Verify token and get user info
      authAPI
        .verifyToken(token)
        .then((userData) => {
          setUser(userData)
        })
        .catch(() => {
          localStorage.removeItem("token")
        })
        .finally(() => {
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await authAPI.login(username, password)
      localStorage.setItem("token", response.token)
      setUser(response.user)
      toast.success("Login successful!")
      return true
    } catch (error: any) {
      toast.error(error.message || "Login failed")
      return false
    }
  }

  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    try {
      const response = await authAPI.register(username, email, password)
      localStorage.setItem("token", response.token)
      setUser(response.user)
      toast.success("Registration successful!")
      return true
    } catch (error: any) {
      toast.error(error.message || "Registration failed")
      return false
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    setUser(null)
    toast.success("Logged out successfully")
  }

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    loading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
