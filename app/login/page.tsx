"use client"

import { useState } from "react"
import Link from "next/link"
import { authService } from "../../services/auth"
import { Button } from "../../components/ui/Button"
import { Input } from "../../components/ui/Input"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const user = await authService.login(email, password)
      authService.saveSession(user)
      window.location.href = "/dashboard"
    } catch {
      setError("E-mail ou senha inválidos.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#050816] text-white flex">

      {/* LEFT SIDE */}
      <div className="hidden lg:flex w-1/2 flex-col justify-between p-14 bg-gradient-to-br from-[#08142f] via-[#071021] to-[#040814] border-r border-blue-950">

        <div>
          <div className="flex items-center gap-4 mb-20">
            <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center font-bold text-xl">
              FT
            </div>

            <h1 className="text-2xl font-bold">
              Finance Tracker
            </h1>
          </div>

          <h2 className="text-6xl font-bold leading-tight max-w-xl">
            Controle total das suas{" "}
            <span className="text-blue-500">
              finanças
            </span>
          </h2>

          <p className="mt-8 text-xl text-slate-400 max-w-lg">
            Gerencie contas, transações e relatórios mensais
            em um só lugar.
          </p>

          <div className="mt-20 space-y-8">

            <div className="flex gap-4">
              <div className="w-14 h-14 rounded-xl bg-blue-600/20 flex items-center justify-center">
                💳
              </div>

              <div>
                <h3 className="font-semibold">
                  Visão completa
                </h3>

                <p className="text-slate-400">
                  Todas as suas contas em um único painel.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-14 h-14 rounded-xl bg-green-500/20 flex items-center justify-center">
                📈
              </div>

              <div>
                <h3 className="font-semibold">
                  Crescimento contínuo
                </h3>

                <p className="text-slate-400">
                  Acompanhe seu patrimônio em tempo real.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-slate-500 text-sm">
          © 2026 Finance Tracker
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex-1 flex items-center justify-center p-8 bg-[#070b18]">

        <div className="w-full max-w-md">

          <div className="bg-[#0B1220] border border-slate-800 rounded-3xl p-10 shadow-2xl">

            <h2 className="text-4xl font-bold mb-2">
              Entrar na conta
            </h2>

            <p className="text-slate-400 mb-10">
              Bem-vindo de volta 👋
            </p>

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              <Input
                id="email"
                label="E-mail"
                type="email"
                placeholder="voce@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <Input
                id="password"
                label="Senha"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              {error && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                loading={loading}
                className="
                  w-full
                  h-14
                  rounded-xl
                  bg-blue-600
                  hover:bg-blue-500
                  text-lg
                  font-semibold
                "
              >
                Entrar
              </Button>
            </form>

            <p className="text-center text-slate-400 mt-8">
              Não tem conta?{" "}
              <Link
                href="/register"
                className="text-blue-500 hover:text-blue-400"
              >
                Criar conta
              </Link>
            </p>
          </div>

        </div>
      </div>

    </div>
  )
}