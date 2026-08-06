import CategoryFormPopover from "@/features/categories/components/CategoryFormPopover";
import { DialogClose } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { useRef, useState } from "react";
import getCategories from "@/features/categories/hooks/getCategories";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
function BudgetForm() {
  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ["category"],
    queryFn: getCategories,
    staleTime: Infinity,
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(categorySelected);
  };
  const [categorySelected, setCategorySelected] = useState(categories?.[0]);
  const [limit, setLimit] = useState("");
  const [error, setError] = useState<string | null>(null);
  const limitRef = useRef<HTMLInputElement>(null);

  return (
    <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
      {/* Categoría */}
      <div>
        <span className="mb-1.5 block text-xs font-medium text-muted-foreground">
          Categoría
        </span>
        <div className="flex flex-wrap gap-2">
          {isLoadingCategories ? (
            <>
              <Skeleton className="flex items-center gap-1 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors h-8 w-24" />
              <Skeleton className="flex items-center gap-1 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors h-8 w-24" />
              <Skeleton className="flex items-center gap-1 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors h-8 w-24" />
              <Skeleton className="flex items-center gap-1 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors h-8 w-24" />
            </>
          ) : (
            categories?.map((c, key) => {
              const active = categorySelected === c;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setCategorySelected(c)}
                  className={cn(
                    "flex items-center gap-1 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
                    active
                      ? "border-primary bg-primary/10 text-foreground"
                      : "border-border bg-secondary text-muted-foreground hover:text-foreground",
                  )}
                >
                  {active && <Check className="size-3.5 text-primary" />}
                  {c.name}
                </button>
              );
            })
          )}
          <CategoryFormPopover type="EXPENSE"/>
        </div>
      </div>

      {/* Límite mensual */}
      <div>
        <label
          htmlFor="budget-limit"
          className="mb-1.5 block text-xs font-medium text-muted-foreground"
        >
          Límite mensual
        </label>
        <div className="flex items-center rounded-xl border border-border bg-secondary px-4 focus-within:border-primary">
          <span className="text-xl font-semibold text-muted-foreground">€</span>
          <input
            id="budget-limit"
            ref={limitRef}
            inputMode="decimal"
            value={limit}
            onChange={(e) => {
              setLimit(e.target.value.replace(/[^0-9.,]/g, ""));
              setError(null);
            }}
            placeholder="0,00"
            className="h-14 w-full bg-transparent px-2 font-mono text-2xl font-semibold tabular-nums outline-none placeholder:text-muted-foreground/50"
          />
        </div>
        {error && <p className="mt-1.5 text-xs text-primary">{error}</p>}
      </div>

      <div className="mt-1 flex gap-2">
        <DialogClose
          render={
            <button
              type="button"
              className="h-11 flex-1 rounded-xl border border-border bg-secondary text-sm font-semibold text-foreground transition-colors hover:bg-secondary/70 px-6"
            >
              Cancelar
            </button>
          }
        />
        <button
          type="submit"
          className="h-11 flex-[1.5] rounded-xl bg-primary text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          Guardar presupuesto
        </button>
      </div>
    </form>
  );
}

export default BudgetForm;
