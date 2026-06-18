"use client"
import { useEffect, useState } from "react"
import { DashboardLayout } from "../../components/layout/DashboardLayout"
import { Card, CardHeader, CardTitle } from "../../components/ui/Card"
import { Select } from "../../components/ui/Select"
import { transactionsService } from "../../services/transactions"
import { accountsService } from "../../services/accounts"
import { Account, MonthlySummary } from "../../types"
import { formatCurrency, getMonthName } from "../../lib/utils"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

const COLORS = ["#3b82f6","#22c55e","#f59e0b","#ef4444","#8b5cf6","#06b6d4","#f97316","#ec4899","#10b981","#6366f1","#84cc16"]
const monthOptions = Array.from({ length: 12 }, (_, i) => ({ value: i + 1, label: new Intl.DateTimeFormat("pt-BR", { month: "long" }).format(new Date(2024, i, 1)).replace(/^\w/, c => c.toUpperCase()) }))
const yearOptions = [2023, 2024, 2025, 2026].map(y => ({ value: y, label: String(y) }))

export default function ReportsPage() {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [selectedAccountId, setSelectedAccountId] = useState("")
  const [year, setYear] = useState(new Date().getFullYear())
  const [month, setMonth] = useState(new Date().getMonth() + 1)
  const [summary, setSummary] = useState<MonthlySummary | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    accountsService.getAll().then(data => { setAccounts(data); if (data.length > 0) setSelectedAccountId(data[0].id) })
  }, [])

  useEffect(() => {
    if (!selectedAccountId) return
    setLoading(true)
    transactionsService.getMonthlySummary(selectedAccountId, year, month).then(setSummary).catch(() => setSummary(null)).finally(() => setLoading(false))
  }, [selectedAccountId, year, month])

  const barData = summary ? [
    { name: "Receitas", value: summary.totalIncome, fill: "#22c55e" },
    { name: "Despesas", value: summary.totalExpenses, fill: "#ef4444" },
    { name: "Líquido", value: summary.netBalance, fill: summary.netBalance >= 0 ? "#3b82f6" : "#f97316" },
  ] : []

  const pieData = summary?.byCategory.map((c, i) => ({ name: c.category, value: c.amount, fill: COLORS[i % COLORS.length] })) || []

  return (
    <DashboardLayout title="Relatório Mensal">
      <div className="space-y-6">
        <Card className="p-4">
          <div className="flex flex-wrap items-end gap-4">
            <Select label="Conta" options={accounts.map(a => ({ value: a.id, label: a.name }))} value={selectedAccountId} onChange={e => setSelectedAccountId(e.target.value)} className="min-w-48" />
            <Select label="Mês" options={monthOptions} value={month} onChange={e => setMonth(Number(e.target.value))} />
            <Select label="Ano" options={yearOptions} value={year} onChange={e => setYear(Number(e.target.value))} />
          </div>
        </Card>

        {loading ? (
          <div className="flex justify-center py-16"><div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" /></div>
        ) : !summary ? (
          <Card className="text-center py-16 text-gray-500"><p>Nenhuma transação encontrada para este período.</p></Card>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center"><TrendingUp className="w-5 h-5 text-green-600" /></div>
                  <div><p className="text-sm text-gray-500">Receitas</p><p className="text-xl font-bold text-green-600">{formatCurrency(summary.totalIncome)}</p></div>
                </div>
              </Card>
              <Card>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center"><TrendingDown className="w-5 h-5 text-red-600" /></div>
                  <div><p className="text-sm text-gray-500">Despesas</p><p className="text-xl font-bold text-red-600">{formatCurrency(summary.totalExpenses)}</p></div>
                </div>
              </Card>
              <Card>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${summary.netBalance >= 0 ? "bg-blue-100" : "bg-orange-100"}`}>
                    <Minus className={`w-5 h-5 ${summary.netBalance >= 0 ? "text-blue-600" : "text-orange-600"}`} />
                  </div>
                  <div><p className="text-sm text-gray-500">Saldo Líquido</p><p className={`text-xl font-bold ${summary.netBalance >= 0 ? "text-blue-600" : "text-orange-600"}`}>{formatCurrency(summary.netBalance)}</p></div>
                </div>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader><CardTitle>Receitas vs Despesas — {getMonthName(month)}/{year}</CardTitle></CardHeader>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="name" tick={{ fontSize: 13 }} />
                    <YAxis tick={{ fontSize: 12 }} tickFormatter={v => `R$${(v/1000).toFixed(0)}k`} />
                    <Tooltip formatter={(v: number) => formatCurrency(v)} />
                    <Bar dataKey="value" radius={[6,6,0,0]}>
                      {barData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              <Card>
                <CardHeader><CardTitle>Gastos por Categoria</CardTitle></CardHeader>
                {pieData.length === 0 ? (
                  <div className="flex items-center justify-center h-64 text-gray-400">Sem despesas no período</div>
                ) : (
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label={({ name, percent }) => `${name} ${(percent*100).toFixed(0)}%`} labelLine={false}>
                        {pieData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                      </Pie>
                      <Tooltip formatter={(v: number) => formatCurrency(v)} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </Card>
            </div>

            <Card>
              <CardHeader><CardTitle>Detalhamento por Categoria</CardTitle></CardHeader>
              <div className="divide-y divide-gray-100">
                {summary.byCategory.map((cat, i) => (
                  <div key={cat.category} className="flex items-center justify-between py-3 first:pt-0">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                      <span className="text-sm font-medium text-gray-900">{cat.category}</span>
                      <span className="text-xs text-gray-400">{cat.count} transação(ões)</span>
                    </div>
                    <span className="font-semibold text-gray-900">{formatCurrency(cat.amount)}</span>
                  </div>
                ))}
              </div>
            </Card>
          </>
        )}
      </div>
    </DashboardLayout>
  )
}
