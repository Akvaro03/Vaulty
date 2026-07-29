"use client";

import { useState } from "react";
import Link from "next/link";
import { User, Mail, Lock, Loader2 } from "lucide-react";
import { AuthField } from "./AuthField";
import { cn } from "@/lib/utils";
import createUser from "@/features/user/data/create";

function passwordStrength(pw: string) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score;
}

const strengthLabels = ["Muy débil", "Débil", "Aceptable", "Buena", "Fuerte"];

export function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accept, setAccept] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    accept?: string;
  }>({});
  const [loading, setLoading] = useState(false);

  const strength = passwordStrength(password);

  function validate() {
    const next: typeof errors = {};
    if (!name.trim()) next.name = "Introduce tu nombre.";
    if (!email) next.email = "Introduce tu correo electrónico.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      next.email = "Correo electrónico no válido.";
    if (!password) next.password = "Introduce una contraseña.";
    else if (password.length < 8) next.password = "Mínimo 8 caracteres.";
    if (!accept) next.accept = "Debes aceptar los términos.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    const res = await createUser({ email, name, passwordHash: password });
    console.log(res);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
      <AuthField
        label="Nombre completo"
        name="name"
        placeholder="Ana Martínez"
        icon={User}
        autoComplete="name"
        value={name}
        onChange={setName}
        error={errors.name}
        required
      />
      <AuthField
        label="Correo electrónico"
        type="email"
        name="email"
        placeholder="tu@correo.com"
        icon={Mail}
        autoComplete="email"
        value={email}
        onChange={setEmail}
        error={errors.email}
        required
      />
      <div className="flex flex-col gap-2">
        <AuthField
          label="Contraseña"
          type="password"
          name="password"
          placeholder="Mínimo 8 caracteres"
          icon={Lock}
          autoComplete="new-password"
          value={password}
          onChange={setPassword}
          error={errors.password}
          required
        />
        {password && (
          <div className="flex items-center gap-3">
            <div className="flex flex-1 gap-1.5">
              {[0, 1, 2, 3].map((i) => (
                <span
                  key={i}
                  className={cn(
                    "h-1.5 flex-1 rounded-full transition-colors",
                    i < strength
                      ? strength <= 1
                        ? "bg-destructive"
                        : strength === 2
                          ? "bg-chart-4"
                          : "bg-chart-3"
                      : "bg-border",
                  )}
                />
              ))}
            </div>
            <span className="w-20 text-right text-xs text-muted-foreground">
              {strengthLabels[strength]}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="flex cursor-pointer items-start gap-2.5 text-sm text-muted-foreground">
          <input
            type="checkbox"
            checked={accept}
            onChange={(e) => setAccept(e.target.checked)}
            className="mt-0.5 size-4 rounded border-border bg-secondary accent-primary"
          />
          <span className="leading-relaxed">
            Acepto los{" "}
            <Link
              href="#"
              className="font-medium text-primary hover:opacity-80"
            >
              Términos de servicio
            </Link>{" "}
            y la{" "}
            <Link
              href="#"
              className="font-medium text-primary hover:opacity-80"
            >
              Política de privacidad
            </Link>
            .
          </span>
        </label>
        {errors.accept && (
          <p className="text-xs text-destructive">{errors.accept}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="flex h-12 items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-70"
      >
        {loading && (
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
        )}
        {loading ? "Creando cuenta…" : "Crear cuenta"}
      </button>

      <p className="text-center text-sm text-muted-foreground">
        ¿Ya tienes cuenta?{" "}
        <Link
          href="/login"
          className="font-semibold text-primary transition-opacity hover:opacity-80"
        >
          Inicia sesión
        </Link>
      </p>
    </form>
  );
}
