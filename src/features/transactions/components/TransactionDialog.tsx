import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TransactionForm } from "./TransactionForm";
import { useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { VariantProps } from "class-variance-authority";
interface TransactionDialogProps {
  buttonVariant?: VariantProps<typeof buttonVariants>["variant"];
}
export function TransactionDialog({
  buttonVariant = "default",
}: TransactionDialogProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const close = () => {
    setIsOpen(false);
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger
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

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nueva transacción</DialogTitle>
        </DialogHeader>

        <TransactionForm isOpen={isOpen} closeForm={close} />
      </DialogContent>
    </Dialog>
  );
}
