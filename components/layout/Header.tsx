"use client"

import { Bell, Search } from "lucide-react"
import { authService } from "../../services/auth"

export function Header({
title,
}: {
title: string
}) {

const user = authService.getUser()

return (

<header className="h-20 px-8 border-b border-slate-800 bg-[#050816]/80 backdrop-blur-xl flex items-center justify-between">

<div>
<h1 className="text-2xl font-bold text-white">
{title}
</h1>

<p className="text-slate-400 text-sm">
Bem-vindo de volta
</p>
</div>

<div className="flex items-center gap-4">

<div className="relative">

<Search className="absolute left-3 top-3 w-4 h-4 text-slate-500" />

<input
placeholder="Pesquisar..."
className="
w-64
pl-10
pr-4
h-10
rounded-xl
bg-[#111827]
border
border-slate-800
text-white
"
/>

</div>

<button className="w-10 h-10 rounded-xl bg-[#111827] flex items-center justify-center">
<Bell className="w-5 h-5 text-slate-400" />
</button>

<div className="flex items-center gap-3">

<div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
<span className="font-bold text-white">
{user?.name?.charAt(0)}
</span>
</div>

<div>
<p className="text-white text-sm font-medium">
{user?.name}
</p>

<p className="text-slate-400 text-xs">
Usuário
</p>
</div>

</div>

</div>

</header>
)
}
