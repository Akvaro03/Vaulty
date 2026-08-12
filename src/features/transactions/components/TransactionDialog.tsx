import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  Dialog,
} from "@/components/ui/dialog";
import { TransactionForm } from "./TransactionForm";
import { useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { VariantProps } from "class-variance-authority";
import { RecurringTransactionForm } from "./RecurringTransactionForm";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
interface TransactionDialogProps {
  buttonVariant?: VariantProps<typeof buttonVariants>["variant"];
}

type DialogType = "transaction" | "recurring" | null;

export function TransactionDialog({
  buttonVariant = "default",
}: TransactionDialogProps) {
  const [dialogType, setDialogType] = useState<DialogType>(null);

  const isOpen = dialogType !== null;

  const close = () => {
    setDialogType(null);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant={buttonVariant}
              className="flex h-10 items-center gap-2 rounded-xl px-4 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              <Plus className="size-4" />
              <span className="hidden sm:inline">Añadir</span>
            </Button>
          }
        />

        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuItem onClick={() => setDialogType("transaction")} className="h-10">
            Nueva transacción
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => setDialogType("recurring")} className="h-10">
            Nueva transacción programada
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isOpen} onOpenChange={(open) => !open && close()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {dialogType === "transaction"
                ? "Nueva transacción"
                : "Nueva transacción programada"}
            </DialogTitle>
          </DialogHeader>

          {dialogType === "transaction" && (
            <TransactionForm isOpen={isOpen} closeForm={close} />
          )}

          {dialogType === "recurring" && (
            <RecurringTransactionForm isOpen={isOpen} closeForm={close} />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
