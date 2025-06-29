"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { queryAPI } from "../../services/api"
import { Send, Loader2, MessageSquare, BarChart3, Table, Sparkles, Zap, Brain, TrendingUp } from "lucide-react"
import QueryResult from "./QueryResult"

interface QueryResponse {
  id: string
  query: string
  response: string
  data?: any
  visualizationType?: "table" | "chart" | "text"
  timestamp: string
}

const QueryInterface: React.FC = () => {
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [responses, setResponses] = useState<QueryResponse[]>([])

  const sampleQueries = [
    "What are the top five portfolios of our wealth members?",
    "Give me the breakup of portfolio values per relationship manager.",
    "Tell me the top relationship managers in my firm",
    "Which clients are the highest holders of RELIANCE stock?",
    "Show me the monthly performance of portfolios above 50 crores",
    "What is the risk distribution across all client portfolios?",
    "Which stocks have the highest allocation across all portfolios?",
    "Show me clients with aggressive risk appetite and their returns",
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setLoading(true)
    try {
      const response = await queryAPI.processQuery(query)
      const newResponse: QueryResponse = {
        id: Date.now().toString(),
        query,
        response: response.response,
        data: response.data,
        visualizationType: response.visualizationType,
        timestamp: new Date().toISOString(),
      }

      setResponses((prev) => [newResponse, ...prev])
      setQuery("")
    } catch (error) {
      console.error("Query failed:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSampleQuery = (sampleQuery: string) => {
    setQuery(sampleQuery)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-6 shadow-lg">
            <Brain className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-4">
            AI Portfolio Intelligence
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Unlock insights from your wealth portfolio data with natural language queries powered by advanced AI
          </p>
          <div className="flex items-center justify-center space-x-4 mt-6">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Sparkles className="h-4 w-4 text-yellow-500" />
              <span>Powered by AI</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Zap className="h-4 w-4 text-blue-500" />
              <span>Real-time Analysis</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span>Smart Insights</span>
            </div>
          </div>
        </div>

        {/* Query Input Section */}
        <Card className="mb-10 border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center space-x-3 text-2xl font-bold text-gray-900">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                <MessageSquare className="h-6 w-6 text-white" />
              </div>
              <span>Ask Your Portfolio</span>
            </CardTitle>
            <CardDescription className="text-lg text-gray-600">
              Describe what you want to know about your portfolio data in natural language
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <Textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="e.g., What are the top five portfolios of our wealth members?"
                  className="min-h-[120px] text-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 rounded-xl resize-none transition-all duration-300"
                  disabled={loading}
                />
                <div className="absolute bottom-4 right-4 flex items-center space-x-2">
                  <div className="text-sm text-gray-400 bg-gray-100 px-2 py-1 rounded-md">
                    {query.length}/500
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  disabled={loading || !query.trim()}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Send className="mr-3 h-5 w-5" />
                      Send Query
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Sample Queries Section */}
        <Card className="mb-10 border-0 shadow-xl bg-gradient-to-r from-white to-blue-50">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center space-x-3 text-xl font-bold text-gray-900">
              <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <span>Quick Start Examples</span>
            </CardTitle>
            <CardDescription className="text-gray-600">
              Click on any example to instantly populate your query
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sampleQueries.map((sampleQuery, index) => (
                <div
                  key={index}
                  className="group cursor-pointer transition-all duration-300 transform hover:scale-105"
                  onClick={() => handleSampleQuery(sampleQuery)}
                >
                  <div className="p-4 bg-white rounded-xl border-2 border-gray-100 hover:border-blue-300 hover:shadow-lg transition-all duration-300 group-hover:bg-gradient-to-r group-hover:from-blue-50 group-hover:to-indigo-50">
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors duration-300">
                        <MessageSquare className="h-4 w-4 text-blue-600" />
                      </div>
                      <p className="text-gray-700 group-hover:text-gray-900 font-medium leading-relaxed">
                        {sampleQuery}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Query Results Section */}
        {responses.length > 0 && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-blue-800 bg-clip-text text-transparent mb-2">
                Query Results
              </h2>
              <p className="text-gray-600">Your AI-powered insights and visualizations</p>
            </div>
            <div className="space-y-6">
              {responses.map((response) => (
                <QueryResult key={response.id} response={response} />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {responses.length === 0 && !loading && (
          <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-blue-50">
            <CardContent className="text-center py-16">
              <div className="flex justify-center space-x-6 mb-8">
                <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-lg">
                  <BarChart3 className="h-8 w-8 text-white" />
                </div>
                <div className="p-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full shadow-lg">
                  <Table className="h-8 w-8 text-white" />
                </div>
                <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full shadow-lg">
                  <MessageSquare className="h-8 w-8 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Explore Your Data?</h3>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
                Start by asking a question about your portfolio data or try one of the sample queries above. 
                Our AI will analyze your data and provide insights with beautiful visualizations.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default QueryInterface
