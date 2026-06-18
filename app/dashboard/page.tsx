"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

import { DashboardLayout } from "../../components/layout/DashboardLayout"
import { Card } from "../../components/ui/Card"
import { Badge } from "../../components/ui/Badge"

import { accountsService } from "../../services/accounts"

import {
Wallet,
TrendingUp,
CreditCard,
ArrowUpRight,
Bitcoin
} from "lucide-react"

import {
Account,
AccountTypeLabel
} from "../../types"

import { formatCurrency } from "../../lib/utils"

export default function DashboardPage() {
const [accounts, setAccounts] = useState<Account[]>([])
const [loading, setLoading] = useState(true)

useEffect(() => {
accountsService
.getAll()
.then(setAccounts)
.catch(console.error)
.finally(() => setLoading(false))
}, [])

const totalBalance = accounts.reduce(
(sum, a) => sum + a.balance,
0
)

const positiveAccounts =
accounts.filter(a => a.balance >= 0).length

if (loading) {
return ( <DashboardLayout title="Dashboard">

<div className="flex justify-center py-32">
<div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full" />
</div>
</DashboardLayout>
)
}

return ( <DashboardLayout title="Dashboard">

<div className="space-y-8">

<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

<Card className="bg-[#0B1220] border-slate-800">
<div className="flex justify-between items-start">
<div>
<p className="text-slate-400 text-sm">
Patrimônio Total
</p>

<h2 className="text-4xl font-bold text-white mt-2">
{formatCurrency(totalBalance)}
</h2>

<p className="text-green-400 text-sm mt-2">
↑ 12% este mês
</p>
</div>

<div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
<Wallet className="w-6 h-6 text-blue-500" />
</div>
</div>
</Card>

<Card className="bg-[#0B1220] border-slate-800">
<div className="flex justify-between items-start">
<div>
<p className="text-slate-400 text-sm">
Contas Positivas
</p>

<h2 className="text-4xl font-bold text-white mt-2">
{positiveAccounts}
</h2>

<p className="text-slate-400 text-sm mt-2">
de {accounts.length} contas
</p>
</div>

<div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
<TrendingUp className="w-6 h-6 text-green-500" />
</div>
</div>
</Card>

<Card className="bg-[#0B1220] border-slate-800">
<div className="flex justify-between items-start">
<div>
<p className="text-slate-400 text-sm">
Total de Contas
</p>

<h2 className="text-4xl font-bold text-white mt-2">
{accounts.length}
</h2>

<p className="text-slate-400 text-sm mt-2">
Contas cadastradas
</p>
</div>

<div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
<CreditCard className="w-6 h-6 text-purple-500" />
</div>
</div>
</Card>

<Card className="bg-[#0B1220] border-slate-800">
<div className="flex justify-between items-start">
<div>
<p className="text-slate-400 text-sm">
Mercado
</p>

<h2 className="text-3xl font-bold text-white mt-2">
BTC
</h2>

<p className="text-green-400 mt-2">
+2.18%
</p>
</div>

<div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center">
<Bitcoin className="w-6 h-6 text-yellow-500" />
</div>
</div>
</Card>

</div>

<Card className="bg-[#0B1220] border-slate-800">

<div className="flex items-center justify-between mb-8">

<h2 className="text-xl font-semibold text-white">
Suas Contas
</h2>

<Link
href="/accounts"
className="text-blue-500 hover:text-blue-400"
>
Ver todas
</Link>

</div>

<div className="space-y-4">

{accounts.map(account => (

<Link
key={account.id}
href={`/transactions?accountId=${account.id}`}
className="
flex
items-center
justify-between
bg-[#111827]
hover:bg-[#172036]
border
border-slate-800
rounded-2xl
p-5
transition
"
>

<div className="flex items-center gap-4">

<div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
<CreditCard className="w-5 h-5 text-blue-500" />
</div>

<div>
<p className="font-semibold text-white">
{account.name}
</p>

<p className="text-sm text-slate-400">
{AccountTypeLabel[account.type]}
</p>
</div>

</div>

<div className="text-right">

<p className="text-xl font-semibold text-white">
{formatCurrency(
account.balance,
account.currency
)}
</p>

<Badge
variant={
account.balance >= 0
? "success"
: "danger"
}
className="mt-2"

>

{account.balance >= 0
? "Positivo"
: "Negativo"} </Badge>

</div>

</Link>

))}

</div>

</Card>

<Card className="bg-[#0B1220] border-slate-800">

<div className="flex justify-between items-center mb-6">

<h2 className="text-xl font-semibold text-white">
Mercado Financeiro
</h2>

<ArrowUpRight className="text-blue-500" />

</div>

<div className="grid grid-cols-2 md:grid-cols-4 gap-6">

<div>
<p className="text-slate-400">
PETR4
</p>

<p className="text-green-400 font-semibold">
+2.31%
</p>
</div>

<div>
<p className="text-slate-400">
VALE3
</p>

<p className="text-red-400 font-semibold">
-0.72%
</p>
</div>

<div>
<p className="text-slate-400">
BTC
</p>

<p className="text-white font-semibold">
R$ 587.000
</p>
</div>

<div>
<p className="text-slate-400">
USD/BRL
</p>

<p className="text-white font-semibold">
R$ 5,47
</p>
</div>

</div>

</Card>

</div>

</DashboardLayout>
)
}
