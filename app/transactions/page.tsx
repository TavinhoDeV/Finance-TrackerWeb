"use client"
import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { DashboardLayout } from "../../components/layout/DashboardLayout"
import { Card } from "../../components/ui/Card"
import { Button } from "../../components/ui/Button"
import { Input } from "../../components/ui/Input"
import { Select } from "../../components/ui/Select"
import { Modal } from "../../components/ui/Modal"
import { Badge } from "../../components/ui/Badge"
import { transactionsService } from "../../services/transactions"
import { accountsService } from "../../services/accounts"
import { Account, Transaction, CategoryLabel } from "../../types"
import { formatCurrency, formatDate } from "../../lib/utils"
import { Plus, Trash2, ArrowUpCircle, ArrowDownCircle, ChevronLeft, ChevronRight } from "lucide-react"

const categoryOptions = [
  { value: 1, label: "Salário" }, { value: 2, label: "Alimentação" }, { value: 3, label: "Transporte" },
  { value: 4, label: "Saúde" }, { value: 5, label: "Educação" }, { value: 6, label: "Lazer" },
  { value: 7, label: "Moradia" }, { value: 8, label: "Utilidades" }, { value: 9, label: "Compras" },
  { value: 10, label: "Investimento" }, { value: 99, label: "Outros" },
]

function TransactionsContent() {
  const searchParams = useSearchParams()
  const preselectedAccountId = searchParams.get("accountId") || ""
  const [accounts, setAccounts] = useState<Account[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [selectedAccountId, setSelectedAccountId] = useState(preselectedAccountId)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [creating, setCreating] = useState(false)
  const [filterType, setFilterType] = useState("")
  const [form, setForm] = useState({ description: "", amount: "", type: 1, category: 1, date: new Date().toISOString().split("T")[0], notes: "" })
  const pageSize = 10
  const totalPages = Math.ceil(totalCount / pageSize)

  useEffect(() => {
    accountsService.getAll().then(data => {
      setAccounts(data)
      if (!selectedAccountId && data.length > 0) setSelectedAccountId(data[0].id)
    })
  }, [])

  useEffect(() => {
    if (!selectedAccountId) return
    setLoading(true)
    transactionsService.getAll(selectedAccountId, { page, pageSize, type: filterType ? Number(filterType) : undefined })
      .then(data => { setTransactions(data.items); setTotalCount(data.totalCount) })
      .finally(() => setLoading(false))
  }, [selectedAccountId, page, filterType])

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedAccountId) return
    setCreating(true)
    try {
      await transactionsService.create(selectedAccountId, { ...form, amount: Number(form.amount), date: new Date(form.date).toISOString() })
      setModalOpen(false)
      setForm({ description: "", amount: "", type: 1, category: 1, date: new Date().toISOString().split("T")[0], notes: "" })
      setPage(1)
    } finally { setCreating(false) }
  }

  async function handleDelete(txId: string) {
    if (!confirm("Remover esta transação?")) return
    await transactionsService.delete(selectedAccountId, txId)
    setPage(1)
  }

  const selectedAccount = accounts.find(a => a.id === selectedAccountId)

  return (
    <DashboardLayout title="Transações">
      <div className="space-y-6">
        <Card className="p-4">
          <div className="flex flex-wrap items-end gap-4">
            <Select label="Conta" options={accounts.map(a => ({ value: a.id, label: a.name }))} value={selectedAccountId} onChange={e => { setSelectedAccountId(e.target.value); setPage(1) }} className="min-w-48" />
            <Select label="Tipo" options={[{ value: "", label: "Todos" }, { value: "1", label: "Receitas" }, { value: "2", label: "Despesas" }]} value={filterType} onChange={e => { setFilterType(e.target.value); setPage(1) }} />
            {selectedAccount && (
              <div className="ml-auto text-right">
                <p className="text-xs text-gray-500">Saldo da conta</p>
                <p className={`text-lg font-bold ${selectedAccount.balance >= 0 ? "text-green-600" : "text-red-600"}`}>{formatCurrency(selectedAccount.balance, selectedAccount.currency)}</p>
              </div>
            )}
            <Button onClick={() => setModalOpen(true)} className="self-end"><Plus className="w-4 h-4" /> Nova Transação</Button>
          </div>
        </Card>

        <Card>
          {loading ? (
            <div className="flex justify-center py-16"><div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" /></div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-16 text-gray-500"><p>Nenhuma transação encontrada.</p></div>
          ) : (
            <div className="divide-y divide-gray-100">
              {transactions.map(tx => (
                <div key={tx.id} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    {tx.type === 1 ? <ArrowUpCircle className="w-8 h-8 text-green-500 flex-shrink-0" /> : <ArrowDownCircle className="w-8 h-8 text-red-500 flex-shrink-0" />}
                    <div>
                      <p className="font-medium text-gray-900">{tx.description}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Badge variant="gray">{CategoryLabel[tx.category]}</Badge>
                        <span className="text-xs text-gray-400">{formatDate(tx.date)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className={`font-semibold text-lg ${tx.type === 1 ? "text-green-600" : "text-red-600"}`}>{tx.type === 1 ? "+" : "-"}{formatCurrency(tx.amount)}</p>
                    <button onClick={() => handleDelete(tx.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-100">
              <p className="text-sm text-gray-500">{totalCount} transação(ões)</p>
              <div className="flex items-center gap-2">
                <Button variant="secondary" size="sm" onClick={() => setPage(p => p - 1)} disabled={page === 1}><ChevronLeft className="w-4 h-4" /></Button>
                <span className="text-sm text-gray-700 px-2">{page} / {totalPages}</span>
                <Button variant="secondary" size="sm" onClick={() => setPage(p => p + 1)} disabled={page === totalPages}><ChevronRight className="w-4 h-4" /></Button>
              </div>
            </div>
          )}
        </Card>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Nova Transação">
        <form onSubmit={handleCreate} className="space-y-4">
          <Input label="Descrição" placeholder="Ex: Salário, Mercado..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required />
          <Input label="Valor" type="number" step="0.01" min="0.01" placeholder="0,00" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} required />
          <Select label="Tipo" options={[{ value: 1, label: "Receita" }, { value: 2, label: "Despesa" }]} value={form.type} onChange={e => setForm({ ...form, type: Number(e.target.value) })} />
          <Select label="Categoria" options={categoryOptions} value={form.category} onChange={e => setForm({ ...form, category: Number(e.target.value) })} />
          <Input label="Data" type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required />
          <Input label="Observação (opcional)" placeholder="..." value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" className="flex-1" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button type="submit" className="flex-1" loading={creating}>Criar</Button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  )
}

export default function TransactionsPage() {
  return <Suspense><TransactionsContent /></Suspense>
}
