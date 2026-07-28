"use client"

import { Search, Bell, Plus } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { user } from "@/lib/finance-data"

function getGreeting() {
  const h = new Date().getHours()
  if (h < 6) return "Buenas noches"
  if (h < 13) return "Buenos días"
  if (h < 20) return "Buenas tardes"
  return "Buenas noches"
}

export function Topbar() {
  const today = new Intl.DateTimeFormat("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date())

  return (
    <header className="flex flex-col gap-4 border-b border-border px-5 py-5 md:flex-row md:items-center md:justify-between md:px-8">
      <div>
        <p className="text-sm text-muted-foreground capitalize">{today}</p>
        <h1 className="mt-0.5 text-2xl font-semibold tracking-tight text-balance">
          {getGreeting()}, {user.name}
        </h1>
      </div>

      <div className="flex items-center gap-2.5">
        <div className="relative hidden sm:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Buscar movimientos…"
            aria-label="Buscar movimientos"
            className="h-10 w-48 rounded-xl border border-border bg-secondary pl-9 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary lg:w-60"
          />
        </div>

        <button
          aria-label="Notificaciones"
          className="relative flex size-10 items-center justify-center rounded-xl border border-border bg-secondary text-muted-foreground transition-colors hover:text-foreground"
        >
          <Bell className="size-[18px]" />
          <span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-primary ring-2 ring-secondary" />
        </button>

        <button className="flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90">
          <Plus className="size-4" />
          <span className="hidden sm:inline">Añadir</span>
        </button>

        <Avatar className="size-10 border border-border">
          <AvatarFallback className="bg-secondary text-sm font-medium text-foreground">
            {user.initials}
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}
