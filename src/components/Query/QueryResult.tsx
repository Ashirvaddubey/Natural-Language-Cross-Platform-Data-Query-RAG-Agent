import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { MessageSquare, BarChart3, TableIcon, Clock, Sparkles, TrendingUp, Eye } from "lucide-react"

interface QueryResponse {
  id: string
  query: string
  response: string
  data?: any
  visualizationType?: "table" | "chart" | "text"
  timestamp: string
}

interface QueryResultProps {
  response: QueryResponse
}

const QueryResult: React.FC<QueryResultProps> = ({ response }) => {
  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString("en-IN")
  }

  const getVisualizationIcon = (type?: string) => {
    switch (type) {
      case "table":
        return <TableIcon className="h-5 w-5" />
      case "chart":
        return <BarChart3 className="h-5 w-5" />
      default:
        return <MessageSquare className="h-5 w-5" />
    }
  }

  const getVisualizationColor = (type?: string) => {
    switch (type) {
      case "table":
        return "from-emerald-500 to-teal-600"
      case "chart":
        return "from-blue-500 to-purple-600"
      default:
        return "from-gray-500 to-slate-600"
    }
  }

  const renderVisualization = () => {
    if (!response.data || response.visualizationType === "text") {
      return null
    }

    if (response.visualizationType === "table") {
      return (
        <div className="mt-6">
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-100">
            <div className="flex items-center space-x-2 mb-4">
              <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg">
                <TableIcon className="h-4 w-4 text-white" />
              </div>
              <h4 className="font-semibold text-gray-900">Data Table</h4>
            </div>
            <div className="overflow-x-auto rounded-lg border border-emerald-200 bg-white shadow-sm">
              <table className="min-w-full divide-y divide-emerald-200">
                <thead className="bg-gradient-to-r from-emerald-500 to-teal-600">
                  <tr>
                    {response.data.headers?.map((header: string, index: number) => (
                      <th
                        key={index}
                        className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-emerald-100">
                  {response.data.rows?.map((row: any[], rowIndex: number) => (
                    <tr key={rowIndex} className="hover:bg-emerald-50 transition-colors duration-200">
                      {row.map((cell, cellIndex) => (
                        <td key={cellIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {typeof cell === "number" && cell > 1000000 ? `₹${(cell / 10000000).toFixed(2)} Cr` : cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )
    }

    if (response.visualizationType === "chart") {
      const chartConfig = {
        value: {
          label: "Value",
          color: "hsl(var(--chart-1))",
        },
      }

      return (
        <div className="mt-6">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
            <div className="flex items-center space-x-2 mb-4">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                <BarChart3 className="h-4 w-4 text-white" />
              </div>
              <h4 className="font-semibold text-gray-900">Data Visualization</h4>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border border-blue-200">
              <ChartContainer config={chartConfig} className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={response.data}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="value" fill="var(--color-value)" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </div>
        </div>
      )
    }

    return null
  }

  return (
    <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-slate-50 hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02]">
      <CardHeader className="pb-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-3">
              <div className={`p-3 bg-gradient-to-r ${getVisualizationColor(response.visualizationType)} rounded-xl shadow-lg`}>
                {getVisualizationIcon(response.visualizationType)}
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-gray-900 flex items-center space-x-2">
                  <span>AI Response</span>
                  <div className="flex items-center space-x-1">
                    <Sparkles className="h-4 w-4 text-yellow-500" />
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  </div>
                </CardTitle>
                <div className="flex items-center space-x-2 mt-1">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-500">{formatTimestamp(response.timestamp)}</span>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
              <div className="flex items-start space-x-2">
                <Eye className="h-4 w-4 text-blue-600 mt-1 flex-shrink-0" />
                <CardDescription className="text-base font-medium text-gray-800 leading-relaxed">
                  {response.query}
                </CardDescription>
              </div>
            </div>
          </div>
        </div>
        {response.visualizationType && (
          <div className="flex items-center space-x-2">
            <Badge 
              variant="outline" 
              className="bg-gradient-to-r from-blue-100 to-purple-100 border-blue-300 text-blue-800 font-semibold px-3 py-1"
            >
              {response.visualizationType.charAt(0).toUpperCase() + response.visualizationType.slice(1)} Response
            </Badge>
            <Badge 
              variant="outline" 
              className="bg-gradient-to-r from-green-100 to-emerald-100 border-green-300 text-green-800 font-semibold px-3 py-1"
            >
              AI Generated
            </Badge>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <div className="prose max-w-none">
            <p className="text-gray-700 leading-relaxed text-lg">{response.response}</p>
          </div>
        </div>
        {renderVisualization()}
      </CardContent>
    </Card>
  )
}

export default QueryResult
