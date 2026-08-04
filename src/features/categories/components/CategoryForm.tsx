import { useRef, useState } from "react";

function CategoryForm() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    console.log(name);
  };
  return (
    <div className="mt-4 flex flex-col gap-4">
      <div>
        <label
          htmlFor="category-name"
          className="mb-1.5 block text-xs font-medium text-muted-foreground"
        >
          Nombre
        </label>
        <input
          id="category-name"
          ref={inputRef}
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setError(null);
          }}
          placeholder="Ej. Suscripciones"
          className="h-11 w-full rounded-xl border border-border bg-secondary px-3 text-sm outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary"
        />
        {error && <p className="mt-1.5 text-xs text-primary">{error}</p>}
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleSubmit}
          className="h-11 flex-[1.5] rounded-xl bg-primary text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          Añadir categoría
        </button>
      </div>
    </div>
  );
}

export default CategoryForm;
