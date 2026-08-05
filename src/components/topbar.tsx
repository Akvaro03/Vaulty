"use client";

import { TransactionDialog } from "@/features/transactions/components/TransactionDialog";
import UserDropdown from "@/features/user/component/userDropdown";
import NotificationCenter from "./NotificationCenter";
import { user } from "@/lib/finance-data";
import { Search } from "lucide-react";

function getGreeting() {
  const h = new Date().getHours();
  if (h < 6) return "Buenas noches";
  if (h < 13) return "Buenos días";
  if (h < 20) return "Buenas tardes";
  return "Buenas noches";
}

export function Topbar() {
  const today = new Intl.DateTimeFormat("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date());

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

        <NotificationCenter />

        <TransactionDialog />
        <UserDropdown />
      </div>
    </header>
  );
}
