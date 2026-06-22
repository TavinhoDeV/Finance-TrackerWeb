"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { TrendingUp } from "lucide-react"
import {
LayoutDashboard,
CreditCard,
ArrowLeftRight,
BarChart3,
LogOut
} from "lucide-react"

import { authService } from "../../services/auth"
import { cn } from "../../lib/utils"

const nav = [
{ href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
{ href: "/accounts", label: "Contas", icon: CreditCard },
{ href: "/transactions", label: "Transações", icon: ArrowLeftRight },
{ href: "/reports", label: "Relatórios", icon: BarChart3 },
{ href: "/stocks", label: "Bolsa de Valores", icon: TrendingUp },
]

export function Sidebar() {
const pathname = usePathname()

return (

<aside className="fixed left-0 top-0 h-screen w-64 bg-[#081120] border-r border-slate-800 flex flex-col">

<div className="h-20 flex items-center px-6 border-b border-slate-800">

<div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center">
<span className="font-bold text-white text-lg">
FT
</span>
</div>

<div className="ml-4">
<p className="font-bold text-white">
Finance Tracker
</p>

</div>

</div>

<nav className="flex-1 p-4 space-y-2">

{nav.map(({ href, label, icon: Icon }) => {

const active = pathname === href

return (

<Link
key={href}
href={href}
className={cn(
"flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
active
? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
: "text-slate-400 hover:bg-slate-800 hover:text-white"
)}
>
<Icon className="w-5 h-5" />
{label}
</Link>
)
})}

</nav>

<div className="p-4 border-t border-slate-800">

<button
onClick={() => authService.logout()}
className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all"

>

<LogOut className="w-5 h-5" />
Sair
</button>

</div>

</aside>
)
}
