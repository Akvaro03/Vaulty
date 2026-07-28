"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Lock, Loader2 } from "lucide-react";
import { AuthField } from "./AuthField";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );
  const [loading, setLoading] = useState(false);

  function validate() {
    const next: { email?: string; password?: string } = {};
    if (!email) next.email = "Introduce tu correo electrónico.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      next.email = "Correo electrónico no válido.";
    if (!password) next.password = "Introduce tu contraseña.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => setLoading(false), 1200);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
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
      <AuthField
        label="Contraseña"
        type="password"
        name="password"
        placeholder="••••••••"
        icon={Lock}
        autoComplete="current-password"
        value={password}
        onChange={setPassword}
        error={errors.password}
        required
      />

      <div className="flex items-center justify-between">
        <label className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="size-4 rounded border-border bg-secondary accent-primary"
          />
          Recordarme
        </label>
        <Link
          href="#"
          className="text-sm font-medium text-primary transition-opacity hover:opacity-80"
        >
          ¿Olvidaste tu contraseña?
        </Link>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="flex h-12 items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-70"
      >
        {loading && (
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
        )}
        {loading ? "Iniciando sesión…" : "Iniciar sesión"}
      </button>

      <div className="relative py-1 text-center">
        <span className="relative bg-card px-3 text-xs uppercase tracking-wider text-muted-foreground">
          o continúa con
        </span>
        <span
          aria-hidden="true"
          className="absolute left-0 top-1/2 -z-0 h-px w-full bg-border"
        />
      </div>

      <button
        type="button"
        className="flex h-12 items-center justify-center gap-2.5 rounded-xl border border-border bg-secondary text-sm font-medium text-foreground transition-colors hover:bg-secondary/70"
      >
        <GoogleIcon />
        Google
      </button>

      <p className="text-center text-sm text-muted-foreground">
        ¿No tienes cuenta?
        <Link
          href="/register"
          className="font-semibold text-primary transition-opacity hover:opacity-80"
        >
          Regístrate gratis
        </Link>
      </p>
    </form>
  );
}

function GoogleIcon() {
  return (
    <svg className="size-[18px]" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#EA4335"
        d="M12 10.2v3.9h5.5c-.24 1.4-1.7 4.1-5.5 4.1-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.7 3.4 14.6 2.4 12 2.4 6.9 2.4 2.8 6.5 2.8 11.6S6.9 20.8 12 20.8c5.9 0 9.8-4.1 9.8-9.9 0-.7-.1-1.2-.2-1.7H12z"
      />
    </svg>
  );
}
