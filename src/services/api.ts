const API_BASE_URL = "http://localhost:8000/api"

class APIClient {
  private async request(endpoint: string, options: RequestInit = {}) {
    const token = localStorage.getItem("token")
    const headers = {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "Network error" }))
      throw new Error(error.message || "Request failed")
    }

    return response.json()
  }

  // Auth endpoints
  async login(username: string, password: string) {
    return this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    })
  }

  async register(username: string, email: string, password: string) {
    return this.request("/auth/register", {
      method: "POST",
      body: JSON.stringify({ username, email, password }),
    })
  }

  async verifyToken(token: string) {
    return this.request("/auth/verify", {
      method: "POST",
      body: JSON.stringify({ token }),
    })
  }

  // Dashboard endpoints
  async getDashboardStats() {
    return this.request("/dashboard/stats")
  }

  async getPortfolioChart() {
    return this.request("/dashboard/portfolio-chart")
  }

  async getTopClients() {
    return this.request("/dashboard/top-clients")
  }

  async getRecentTransactions() {
    return this.request("/dashboard/recent-transactions")
  }

  // Query endpoints
  async processQuery(query: string) {
    return this.request("/query/process", {
      method: "POST",
      body: JSON.stringify({ query }),
    })
  }
}

const apiClient = new APIClient()

export const authAPI = {
  login: apiClient.login.bind(apiClient),
  register: apiClient.register.bind(apiClient),
  verifyToken: apiClient.verifyToken.bind(apiClient),
}

export const dashboardAPI = {
  getStats: apiClient.getDashboardStats.bind(apiClient),
  getPortfolioChart: apiClient.getPortfolioChart.bind(apiClient),
  getTopClients: apiClient.getTopClients.bind(apiClient),
  getRecentTransactions: apiClient.getRecentTransactions.bind(apiClient),
}

export const queryAPI = {
  processQuery: apiClient.processQuery.bind(apiClient),
}
