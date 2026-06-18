import { PagedTransactions, MonthlySummary, Transaction } from "../types"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5285"

function getToken() {
  if (typeof window === 'undefined') return ''
  return localStorage.getItem('token') ?? ''
}

export const transactionsService = {
  async getAll(accountId: string, params?: { page?: number; pageSize?: number; type?: number }): Promise<PagedTransactions> {
    const query = new URLSearchParams()
    if (params?.page) query.set("page", String(params.page))
    if (params?.pageSize) query.set("pageSize", String(params.pageSize))
    if (params?.type) query.set("type", String(params.type))
    const res = await fetch(`${BASE_URL}/api/accounts/${accountId}/transactions?${query}`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    })
    if (!res.ok) throw new Error("Failed")
    return res.json()
  },

  async getMonthlySummary(accountId: string, year: number, month: number): Promise<MonthlySummary> {
    const res = await fetch(`${BASE_URL}/api/accounts/${accountId}/transactions/summary/${year}/${month}`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    })
    if (!res.ok) throw new Error("Failed")
    return res.json()
  },

  async create(accountId: string, payload: { description: string; amount: number; type: number; category: number; date: string; notes?: string }): Promise<Transaction> {
    const res = await fetch(`${BASE_URL}/api/accounts/${accountId}/transactions`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
      body: JSON.stringify(payload),
    })
    if (!res.ok) throw new Error("Failed")
    return res.json()
  },

  async delete(accountId: string, transactionId: string): Promise<void> {
    await fetch(`${BASE_URL}/api/accounts/${accountId}/transactions/${transactionId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${getToken()}` },
    })
  },
}
