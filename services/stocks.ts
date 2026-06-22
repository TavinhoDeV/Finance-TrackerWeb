const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5285"

function getToken() {
  return typeof window !== "undefined" ? localStorage.getItem("token") ?? "" : ""
}

function authHeader() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
  }
}

export interface StockQuote {
  symbol: string
  companyName: string
  price: number
  change: number
  changePercent: number
  high: number
  low: number
  volume: number
  market: string
  lastUpdated: string
}

export interface StockDataPoint {
  date: string
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export interface StockHistory {
  symbol: string
  dataPoints: StockDataPoint[]
}

export interface StockSearchResult {
  symbol: string
  name: string
  type: string
  region: string
  currency: string
}

export interface WatchlistItem {
  id: string
  symbol: string
  companyName: string
  market: string
  alertThresholdPercent: number
  createdAt: string
}

export const stocksService = {
  async search(q: string): Promise<StockSearchResult[]> {
    const res = await fetch(`${BASE_URL}/api/stocks/search?q=${encodeURIComponent(q)}`, {
      headers: authHeader(),
    })
    if (!res.ok) throw new Error("Search failed")
    return res.json()
  },

  async getQuote(symbol: string): Promise<StockQuote> {
    const res = await fetch(`${BASE_URL}/api/stocks/${symbol}`, {
      headers: authHeader(),
    })
    if (!res.ok) throw new Error("Quote not found")
    return res.json()
  },

  async getHistory(symbol: string): Promise<StockHistory> {
    const res = await fetch(`${BASE_URL}/api/stocks/${symbol}/history`, {
      headers: authHeader(),
    })
    if (!res.ok) throw new Error("History not found")
    return res.json()
  },

  async getWatchlist(): Promise<WatchlistItem[]> {
    const res = await fetch(`${BASE_URL}/api/stocks/watchlist`, {
      headers: authHeader(),
    })
    if (!res.ok) throw new Error("Failed to fetch watchlist")
    return res.json()
  },

  async addToWatchlist(payload: {
    symbol: string
    companyName: string
    market: string
    alertThresholdPercent: number
  }): Promise<WatchlistItem> {
    const res = await fetch(`${BASE_URL}/api/stocks/watchlist`, {
      method: "POST",
      headers: authHeader(),
      body: JSON.stringify(payload),
    })
    if (!res.ok) throw new Error("Failed to add to watchlist")
    return res.json()
  },

  async removeFromWatchlist(id: string): Promise<void> {
    await fetch(`${BASE_URL}/api/stocks/watchlist/${id}`, {
      method: "DELETE",
      headers: authHeader(),
    })
  },
}
