"use client"
import { useEffect, useState, useCallback } from "react"
import { DashboardLayout } from "../../components/layout/DashboardLayout"
import { Card, CardHeader, CardTitle } from "../../components/ui/Card"
import { Button } from "../../components/ui/Button"
import { Input } from "../../components/ui/Input"
import { Modal } from "../../components/ui/Modal"
import { Badge } from "../../components/ui/Badge"
import { stocksService, StockQuote, StockHistory, StockSearchResult, WatchlistItem } from "../../services/stocks"
import { formatCurrency } from "../../lib/utils"
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts"
import { Search, Plus, Trash2, TrendingUp, TrendingDown, Star, RefreshCw } from "lucide-react"

export default function StocksPage() {
  const [query, setQuery] = useState("")
  const [searchResults, setSearchResults] = useState<StockSearchResult[]>([])
  const [searching, setSearching] = useState(false)
  const [selectedQuote, setSelectedQuote] = useState<StockQuote | null>(null)
  const [history, setHistory] = useState<StockHistory | null>(null)
  const [loadingQuote, setLoadingQuote] = useState(false)
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedResult, setSelectedResult] = useState<StockSearchResult | null>(null)
  const [alertThreshold, setAlertThreshold] = useState("5")
  const [adding, setAdding] = useState(false)
  const [watchlistQuotes, setWatchlistQuotes] = useState<Record<string, StockQuote>>({})

  useEffect(() => {
    loadWatchlist()
  }, [])

  async function loadWatchlist() {
    try {
      const items = await stocksService.getWatchlist()
      setWatchlist(items)
      // Load quotes for watchlist items
      for (const item of items.slice(0, 5)) {
        try {
          const quote = await stocksService.getQuote(item.symbol)
          setWatchlistQuotes(prev => ({ ...prev, [item.symbol]: quote }))
        } catch {}
      }
    } catch (err) {
      console.error(err)
    }
  }

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!query.trim()) return
    setSearching(true)
    try {
      const results = await stocksService.search(query)
      setSearchResults(results)
    } catch {
      setSearchResults([])
    } finally {
      setSearching(false)
    }
  }

  async function handleSelectStock(symbol: string) {
    setLoadingQuote(true)
    setSelectedQuote(null)
    setHistory(null)
    try {
      const [quote, hist] = await Promise.all([
        stocksService.getQuote(symbol),
        stocksService.getHistory(symbol),
      ])
      setSelectedQuote(quote)
      setHistory(hist)
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingQuote(false)
    }
  }

  async function handleAddToWatchlist() {
    if (!selectedResult) return
    setAdding(true)
    try {
      await stocksService.addToWatchlist({
        symbol: selectedResult.symbol,
        companyName: selectedResult.name,
        market: selectedResult.region === "Brazil/Sao Paulo" ? "B3" : "US",
        alertThresholdPercent: Number(alertThreshold),
      })
      setModalOpen(false)
      await loadWatchlist()
    } catch {
    } finally {
      setAdding(false)
    }
  }

  async function handleRemove(id: string) {
    if (!confirm("Remover da watchlist?")) return
    await stocksService.removeFromWatchlist(id)
    await loadWatchlist()
  }

  const chartData = history?.dataPoints.map(d => ({
    date: new Date(d.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
    close: d.close,
  })) ?? []

  return (
    <DashboardLayout title="Bolsa de Valores">
      <div className="space-y-6">

        {/* Search */}
        <Card>
          <CardHeader><CardTitle>Buscar Ação</CardTitle></CardHeader>
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="flex-1">
              <Input
                placeholder="Ex: PETR4, VALE3, AAPL, MSFT..."
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
            </div>
            <Button type="submit" loading={searching}>
              <Search className="w-4 h-4" /> Buscar
            </Button>
          </form>

          {searchResults.length > 0 && (
            <div className="mt-4 divide-y divide-gray-100 dark:divide-gray-700">
              {searchResults.map(result => (
                <div key={result.symbol} className="flex items-center justify-between py-3">
                  <div
                    className="flex-1 cursor-pointer hover:text-blue-600 transition-colors"
                    onClick={() => handleSelectStock(result.symbol)}
                  >
                    <span className="font-semibold text-gray-900 dark:text-gray-100">{result.symbol}</span>
                    <span className="text-gray-500 text-sm ml-2">{result.name}</span>
                    <Badge variant="info" className="ml-2">{result.region}</Badge>
                  </div>
                  <Button
                    size="sm" variant="secondary"
                    onClick={() => { setSelectedResult(result); setModalOpen(true) }}
                  >
                    <Star className="w-3 h-3" /> Watchlist
                  </Button>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Quote + Chart */}
        {loadingQuote && (
          <Card className="flex items-center justify-center py-16">
            <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
          </Card>
        )}

        {selectedQuote && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedQuote.symbol}</h2>
                  <p className="text-gray-500 text-sm">{selectedQuote.market}</p>
                </div>
                <Badge variant={selectedQuote.changePercent >= 0 ? "success" : "danger"}>
                  {selectedQuote.market}
                </Badge>
              </div>

              <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {selectedQuote.market === "B3" ? "R$" : "$"} {selectedQuote.price.toFixed(2)}
              </div>

              <div className={`flex items-center gap-2 text-lg font-medium mb-6 ${selectedQuote.changePercent >= 0 ? "text-green-600" : "text-red-600"}`}>
                {selectedQuote.changePercent >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                {selectedQuote.change >= 0 ? "+" : ""}{selectedQuote.change.toFixed(2)} ({selectedQuote.changePercent >= 0 ? "+" : ""}{selectedQuote.changePercent.toFixed(2)}%)
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                  <div className="text-gray-500 mb-1">Máxima</div>
                  <div className="font-semibold">{selectedQuote.high.toFixed(2)}</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                  <div className="text-gray-500 mb-1">Mínima</div>
                  <div className="font-semibold">{selectedQuote.low.toFixed(2)}</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 col-span-2">
                  <div className="text-gray-500 mb-1">Volume</div>
                  <div className="font-semibold">{selectedQuote.volume.toLocaleString("pt-BR")}</div>
                </div>
              </div>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Histórico 30 dias — {selectedQuote.symbol}</CardTitle>
              </CardHeader>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} domain={["auto", "auto"]} />
                  <Tooltip
                    formatter={(v: number) => [`${selectedQuote.market === "B3" ? "R$" : "$"} ${v.toFixed(2)}`, "Fechamento"]}
                  />
                  <Line
                    type="monotone" dataKey="close"
                    stroke={selectedQuote.changePercent >= 0 ? "#22c55e" : "#ef4444"}
                    strokeWidth={2} dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </div>
        )}

        {/* Watchlist */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Minha Watchlist</CardTitle>
              <Button variant="secondary" size="sm" onClick={loadWatchlist}>
                <RefreshCw className="w-3 h-3" /> Atualizar
              </Button>
            </div>
          </CardHeader>

          {watchlist.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <Star className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p>Nenhuma ação na watchlist.</p>
              <p className="text-sm mt-1">Busque uma ação e clique em "Watchlist" para adicionar.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {watchlist.map(item => {
                const quote = watchlistQuotes[item.symbol]
                return (
                  <div key={item.id} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
                    <div
                      className="flex items-center gap-3 flex-1 cursor-pointer"
                      onClick={() => handleSelectStock(item.symbol)}
                    >
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                        <span className="text-xs font-bold text-blue-600 dark:text-blue-400">{item.symbol.slice(0, 2)}</span>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-gray-100">{item.symbol}</div>
                        <div className="text-xs text-gray-500">{item.companyName} · {item.market} · Alerta: {item.alertThresholdPercent}%</div>
                      </div>
                    </div>

                    {quote && (
                      <div className="text-right mr-4">
                        <div className="font-semibold">{quote.market === "B3" ? "R$" : "$"} {quote.price.toFixed(2)}</div>
                        <div className={`text-sm font-medium ${quote.changePercent >= 0 ? "text-green-600" : "text-red-600"}`}>
                          {quote.changePercent >= 0 ? "+" : ""}{quote.changePercent.toFixed(2)}%
                        </div>
                      </div>
                    )}

                    <button
                      onClick={() => handleRemove(item.id)}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </Card>
      </div>

      {/* Add to watchlist modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Adicionar à Watchlist">
        <div className="space-y-4">
          {selectedResult && (
            <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <div className="font-semibold text-gray-900 dark:text-gray-100">{selectedResult.symbol}</div>
              <div className="text-sm text-gray-500">{selectedResult.name}</div>
            </div>
          )}
          <Input
            label="Alerta de variação (%)"
            type="number" step="0.5" min="0.5" max="20"
            value={alertThreshold}
            onChange={e => setAlertThreshold(e.target.value)}
          />
          <p className="text-xs text-gray-500">
            Você receberá um e-mail quando a ação variar mais de {alertThreshold}% em um dia.
          </p>
          <div className="flex gap-3">
            <Button variant="secondary" className="flex-1" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button className="flex-1" loading={adding} onClick={handleAddToWatchlist}>
              <Star className="w-4 h-4" /> Adicionar
            </Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  )
}
