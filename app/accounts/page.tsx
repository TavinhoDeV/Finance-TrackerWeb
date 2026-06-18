"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "../../components/layout/DashboardLayout"
import { Card } from "../../components/ui/Card"
import { Button } from "../../components/ui/Button"
import { Input } from "../../components/ui/Input"
import { Select } from "../../components/ui/Select"
import { Modal } from "../../components/ui/Modal"
import { Badge } from "../../components/ui/Badge"

import { accountsService } from "../../services/accounts"

import {
  Account,
  AccountTypeLabel
} from "../../types"

import {
  formatCurrency,
  formatDate
} from "../../lib/utils"

import {
  Plus,
  Trash2,
  CreditCard,
  ArrowLeftRight,
  Wallet,
  TrendingUp
} from "lucide-react"

import Link from "next/link"

const accountTypeOptions = [
  { value: 1, label: "Conta Corrente" },
  { value: 2, label: "Poupança" },
  { value: 3, label: "Cartão de Crédito" },
  { value: 4, label: "Investimento" },
]

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([])
  const [loading, setLoading] = useState(true)

  const [modalOpen, setModalOpen] = useState(false)

  const [creating, setCreating] = useState(false)

  const [deleting, setDeleting] = useState<string | null>(null)

  const [form, setForm] = useState({
    name: "",
    type: 1,
    initialBalance: 0,
    currency: "BRL",
  })

  async function load() {
    const data = await accountsService.getAll()
    setAccounts(data)
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  async function handleCreate(
    e: React.FormEvent
  ) {
    e.preventDefault()

    setCreating(true)

    try {
      await accountsService.create(form)

      setModalOpen(false)

      setForm({
        name: "",
        type: 1,
        initialBalance: 0,
        currency: "BRL",
      })

      await load()
    } finally {
      setCreating(false)
    }
  }

  async function handleDelete(id: string) {
    if (
      !confirm(
        "Tem certeza? Todas as transações serão removidas."
      )
    )
      return

    setDeleting(id)

    try {
      await accountsService.delete(id)
      await load()
    } finally {
      setDeleting(null)
    }
  }

  const totalBalance = accounts.reduce(
    (sum, account) => sum + account.balance,
    0
  )

  const highestBalance =
    accounts.length > 0
      ? Math.max(...accounts.map(a => a.balance))
      : 0

  return (
    <DashboardLayout title="Contas">

      <div className="space-y-8">

        {/* HEADER */}

        <div className="flex items-center justify-between">

          <div>
            <h2 className="text-3xl font-bold text-white">
              Minhas Contas
            </h2>

            <p className="text-slate-400 mt-1">
              Gerencie suas contas financeiras
            </p>
          </div>

          <Button onClick={() => setModalOpen(true)}>
            <Plus className="w-4 h-4" />
            Nova Conta
          </Button>

        </div>

        {/* KPIS */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <Card className="bg-[#0B1220] border-slate-800">

            <div className="flex justify-between">

              <div>
                <p className="text-slate-400 text-sm">
                  Patrimônio Total
                </p>

                <h3 className="text-3xl font-bold text-white mt-2">
                  {formatCurrency(totalBalance)}
                </h3>
              </div>

              <div className="w-12 h-12 rounded-xl bg-blue-600/20 flex items-center justify-center">
                <Wallet className="w-6 h-6 text-blue-500" />
              </div>

            </div>

          </Card>

          <Card className="bg-[#0B1220] border-slate-800">

            <div className="flex justify-between">

              <div>
                <p className="text-slate-400 text-sm">
                  Total de Contas
                </p>

                <h3 className="text-3xl font-bold text-white mt-2">
                  {accounts.length}
                </h3>
              </div>

              <div className="w-12 h-12 rounded-xl bg-green-600/20 flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-green-500" />
              </div>

            </div>

          </Card>

          <Card className="bg-[#0B1220] border-slate-800">

            <div className="flex justify-between">

              <div>
                <p className="text-slate-400 text-sm">
                  Maior Saldo
                </p>

                <h3 className="text-3xl font-bold text-green-400 mt-2">
                  {formatCurrency(highestBalance)}
                </h3>
              </div>

              <div className="w-12 h-12 rounded-xl bg-purple-600/20 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-500" />
              </div>

            </div>

          </Card>

        </div>

        {/* LISTA */}

        {loading ? (
          <div className="flex justify-center py-24">
            <div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full" />
          </div>
        ) : accounts.length === 0 ? (

          <Card className="bg-[#0B1220] border-slate-800 text-center py-20">

            <CreditCard className="w-14 h-14 mx-auto text-slate-600 mb-4" />

            <h3 className="text-xl font-semibold text-white">
              Nenhuma conta encontrada
            </h3>

            <p className="text-slate-400 mt-2">
              Crie sua primeira conta para começar.
            </p>

            <Button
              className="mt-6"
              onClick={() => setModalOpen(true)}
            >
              <Plus className="w-4 h-4" />
              Criar Conta
            </Button>

          </Card>

        ) : (

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

            {accounts.map(account => (

              <Card
                key={account.id}
                className="
                bg-[#0B1220]
                border-slate-800
                hover:border-blue-600/50
                transition-all
                "
              >

                <div className="flex justify-between items-start">

                  <div className="flex gap-3">

                    <div className="w-12 h-12 rounded-xl bg-blue-600/20 flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-blue-500" />
                    </div>

                    <div>

                      <h3 className="font-semibold text-white">
                        {account.name}
                      </h3>

                      <Badge variant="info">
                        {AccountTypeLabel[account.type]}
                      </Badge>

                    </div>

                  </div>

                  <button
                    onClick={() => handleDelete(account.id)}
                    disabled={deleting === account.id}
                    className="
                    p-2
                    rounded-lg
                    text-slate-500
                    hover:text-red-500
                    hover:bg-red-500/10
                    transition-all
                    "
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                </div>

                <div className="mt-6">

                  <p className="text-sm text-slate-400">
                    Saldo Atual
                  </p>

                  <h2
                    className={`text-3xl font-bold mt-2 ${
                      account.balance >= 0
                        ? "text-white"
                        : "text-red-400"
                    }`}
                  >
                    {formatCurrency(
                      account.balance,
                      account.currency
                    )}
                  </h2>

                </div>

                <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">

                  <span className="text-xs text-slate-500">
                    {formatDate(account.createdAt)}
                  </span>

                  <Link
                    href={`/transactions?accountId=${account.id}`}
                    className="
                    text-blue-400
                    hover:text-blue-300
                    flex items-center gap-2
                    text-sm
                    "
                  >
                    <ArrowLeftRight className="w-4 h-4" />
                    Transações
                  </Link>

                </div>

              </Card>

            ))}

          </div>

        )}

      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Nova Conta"
      >

        <form
          onSubmit={handleCreate}
          className="space-y-4"
        >

          <Input
            label="Nome"
            placeholder="Ex: Nubank"
            value={form.name}
            onChange={e =>
              setForm({
                ...form,
                name: e.target.value,
              })
            }
            required
          />

          <Select
            label="Tipo"
            options={accountTypeOptions}
            value={form.type}
            onChange={e =>
              setForm({
                ...form,
                type: Number(e.target.value),
              })
            }
          />

          <Input
            label="Saldo Inicial"
            type="number"
            step="0.01"
            value={form.initialBalance}
            onChange={e =>
              setForm({
                ...form,
                initialBalance: Number(
                  e.target.value
                ),
              })
            }
          />

          <Select
            label="Moeda"
            options={[
              {
                value: "BRL",
                label: "BRL (Real)",
              },
              {
                value: "USD",
                label: "USD (Dólar)",
              },
            ]}
            value={form.currency}
            onChange={e =>
              setForm({
                ...form,
                currency: e.target.value,
              })
            }
          />

          <div className="flex gap-3 pt-2">

            <Button
              type="button"
              variant="secondary"
              className="flex-1"
              onClick={() =>
                setModalOpen(false)
              }
            >
              Cancelar
            </Button>

            <Button
              type="submit"
              className="flex-1"
              loading={creating}
            >
              Criar Conta
            </Button>

          </div>

        </form>

      </Modal>

    </DashboardLayout>
  )
}