import { Button, buttonVariants } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import CategoryForm from "@/features/categories/components/CategoryForm";
import { VariantProps } from "class-variance-authority";
import { Plus } from "lucide-react";
interface CategoryDialogProps {
  buttonVariant?: VariantProps<typeof buttonVariants>["variant"];
}
function CategoryFormPopover({ buttonVariant = "default" }: CategoryDialogProps) {
  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            variant={buttonVariant}
            className="flex items-center gap-1 rounded-full border border-dashed border-border px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
          >
            <Plus className="size-4" />
            <span className="hidden sm:inline">Nueva</span>
          </Button>
        }
      />
      <PopoverContent className="w-64" align="center">
        {/* <PopoverHeader>
          <PopoverTitle>Dimensions</PopoverTitle>
          <PopoverDescription>
            Set the dimensions for the layer.
          </PopoverDescription>
        </PopoverHeader>
        <div className="grid grid-cols-3 items-center gap-4">
          <label htmlFor="width">Width</label>
          <Input id="width" defaultValue="100%" className="col-span-2 h-8" />

        </div> */}
        <CategoryForm />
      </PopoverContent>
    </Popover>
  );
}

export default CategoryFormPopover;
