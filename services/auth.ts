import { User } from "../types"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5285"

export const authService = {
  async register(name: string, email: string, password: string): Promise<User> {
    const res = await fetch(`${BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    })
    if (!res.ok) throw new Error("Register failed")
    return res.json()
  },

  async login(email: string, password: string): Promise<User> {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
    if (!res.ok) throw new Error("Login failed")
    return res.json()
  },

  saveSession(user: User) {
    localStorage.setItem("token", user.token)
    localStorage.setItem("user", JSON.stringify(user))
  },

  getUser(): User | null {
    if (typeof window === "undefined") return null
    const u = localStorage.getItem("user")
    return u ? JSON.parse(u) : null
  },

  logout() {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    window.location.href = "/login"
  },
}
