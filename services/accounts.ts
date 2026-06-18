import { Account } from "../types"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5285"

function authHeader() {
  const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null
  console.log('Token sendo enviado:', token?.substring(0, 20))
  return {
    "Content-Type": "application/json",
    "Authorization": token ? `Bearer ${token}` : ""
  }
}

export const accountsService = {
  async getAll(): Promise<Account[]> {
    const res = await fetch(`${BASE_URL}/api/accounts`, {
      headers: authHeader(),
    })
    if (!res.ok) throw new Error("Failed")
    return res.json()
  },

  async create(payload: { name: string; type: number; initialBalance: number; currency: string }): Promise<Account> {
    const res = await fetch(`${BASE_URL}/api/accounts`, {
      method: "POST",
      headers: authHeader(),
      body: JSON.stringify(payload),
    })
    if (!res.ok) throw new Error("Failed")
    return res.json()
  },

  async delete(id: string): Promise<void> {
    await fetch(`${BASE_URL}/api/accounts/${id}`, {
      method: "DELETE",
      headers: authHeader(),
    })
  },
}
