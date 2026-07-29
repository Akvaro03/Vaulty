import { cn } from "@/lib/utils";

import { ArrowDownRight, ArrowUpRight, Check } from "lucide-react";

import { useEffect, useRef, useState } from "react";
import { expenseCategories, incomeCategories } from "@/lib/finance-data";
interface Props {
  isOpen: boolean;
  closeForm: () => void;
}

const accounts = [
  {
    id: "cash",
    name: "Efectivo",
    detail: "Billetera",
  },
  {
    id: "bank",
    name: "Banco",
    detail: "Cuenta sueldo",
  },
];
type TxType = "gasto" | "ingreso";

export function TransactionForm({ isOpen, closeForm }: Props) {
  // const { isOpen, closeForm, addTransaction } = useTransactions();

  const [type, setType] = useState<TxType>("gasto");
  const [amount, setAmount] = useState("");
  const [account, setAccount] = useState(accounts[0].id);
  const [category, setCategory] = useState<string>(expenseCategories[0]);
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const amountRef = useRef<HTMLInputElement>(null);
  const categories = type === "gasto" ? expenseCategories : incomeCategories;

  // Cierra con la tecla Escape
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeForm();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, closeForm]);

  if (!isOpen) return null;

  function selectType(next: TxType) {
    setType(next);
    // Ajusta la categoría por defecto al cambiar de tipo
    setCategory(next === "gasto" ? expenseCategories[0] : incomeCategories[0]);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const value = Number.parseFloat(amount.replace(",", "."));
    if (!value || value <= 0) {
      setError("Introduce un monto válido mayor que 0.");
      amountRef.current?.focus();
      return;
    }
    console.log({ name, category, account, amount: value, type });
    closeForm();
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
      {/* Tipo de movimiento */}
      <div className="grid grid-cols-2 gap-2 rounded-xl bg-secondary p-1">
        {(
          [
            { key: "gasto", label: "Gasto", Icon: ArrowDownRight },
            { key: "ingreso", label: "Ingreso", Icon: ArrowUpRight },
          ] as const
        ).map(({ key, label, Icon }) => (
          <button
            key={key}
            type="button"
            onClick={() => selectType(key)}
            className={cn(
              "flex h-10 items-center justify-center gap-1.5 rounded-lg text-sm font-medium transition-colors",
              type === key
                ? key === "gasto"
                  ? "bg-primary text-primary-foreground"
                  : "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Icon className="size-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Monto */}
      <div>
        <label
          htmlFor="tx-amount"
          className="mb-1.5 block text-xs font-medium text-muted-foreground"
        >
          Monto
        </label>
        <div className="flex items-center rounded-xl border border-border bg-secondary px-4 focus-within:border-primary">
          <span className="text-xl font-semibold text-muted-foreground">€</span>
          <input
            id="tx-amount"
            ref={amountRef}
            inputMode="decimal"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value.replace(/[^0-9.,]/g, ""));
              setError(null);
            }}
            placeholder="0,00"
            className="h-14 w-full bg-transparent px-2 font-mono text-2xl font-semibold tabular-nums outline-none placeholder:text-muted-foreground/50"
          />
        </div>
        {error && <p className="mt-1.5 text-xs text-primary">{error}</p>}
      </div>

      {/* Cuenta */}
      <div>
        <span className="mb-1.5 block text-xs font-medium text-muted-foreground">
          Cuenta
        </span>
        <div className="grid grid-cols-2 gap-2">
          {accounts.map((a) => (
            <button
              key={a.id}
              type="button"
              onClick={() => setAccount(a.id)}
              className={cn(
                "flex flex-col items-start rounded-xl border px-3 py-2.5 text-left transition-colors",
                account === a.id
                  ? "border-primary bg-primary/10"
                  : "border-border bg-secondary hover:border-muted-foreground/40",
              )}
            >
              <span className="text-sm font-medium">{a.name}</span>
              <span className="text-xs text-muted-foreground">{a.detail}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Categoría */}
      <div>
        <span className="mb-1.5 block text-xs font-medium text-muted-foreground">
          Categoría
        </span>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => {
            const active = category === c;
            return (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                className={cn(
                  "flex items-center gap-1 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
                  active
                    ? "border-primary bg-primary/10 text-foreground"
                    : "border-border bg-secondary text-muted-foreground hover:text-foreground",
                )}
              >
                {active && <Check className="size-3.5 text-primary" />}
                {c}
              </button>
            );
          })}
        </div>
      </div>

      {/* Concepto (opcional) */}
      <div>
        <label
          htmlFor="tx-name"
          className="mb-1.5 block text-xs font-medium text-muted-foreground"
        >
          Concepto <span className="text-muted-foreground/60">(opcional)</span>
        </label>
        <input
          id="tx-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ej. Cena con amigos"
          className="h-11 w-full rounded-xl border border-border bg-secondary px-3 text-sm outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary"
        />
      </div>

      <div className="mt-1 flex gap-2">
        <button
          type="button"
          onClick={closeForm}
          className="h-11 flex-1 rounded-xl border border-border bg-secondary text-sm font-semibold text-foreground transition-colors hover:bg-secondary/70"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="h-11 flex-[1.5] rounded-xl bg-primary text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          Guardar transacción
        </button>
      </div>
    </form>
  );
}
