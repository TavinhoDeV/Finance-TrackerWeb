"use client"
import { useState } from "react"
import Link from "next/link"
import { authService } from "../../services/auth"
import { Button } from "../../components/ui/Button"
import { Input } from "../../components/ui/Input"

export default function RegisterPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const user = await authService.register(name, email, password)
      authService.saveSession(user)
      window.location.href = "/dashboard"
    } catch {
      setError("Não foi possível criar a conta. Tente outro e-mail.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">FT</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Criar conta</h1>
          <p className="text-gray-500 mt-1">Comece a controlar suas finanças</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input id="name" label="Nome" placeholder="Seu nome" value={name} onChange={e => setName(e.target.value)} required />
            <Input id="email" label="E-mail" type="email" placeholder="voce@email.com" value={email} onChange={e => setEmail(e.target.value)} required />
            <Input id="password" label="Senha" type="password" placeholder="Mínimo 6 caracteres" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
            {error && <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm">{error}</div>}
            <Button type="submit" className="w-full" size="lg" loading={loading}>Criar conta</Button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-6">
            Já tem conta?{" "}
            <Link href="/login" className="text-blue-600 hover:underline font-medium">Entrar</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
