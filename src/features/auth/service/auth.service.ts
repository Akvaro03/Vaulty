"use server";

import findUserByEmail from "@/features/user/data/find";
import createSessionDb from "../data/createSession";
import { loginInput } from "../types/schemaAuth";
import { cookies } from "next/headers";
import argon2 from "argon2";
import crypto from "crypto";
import getCurrentUser from "./getCurrentUser";
import invalidateSession from "./invalidateSession";

async function loginService({ email, password }: loginInput) {
  const user = await findUserByEmail(email);
  if (!user) throw new Error("Usuario no encontrado");

  const isValid = await argon2.verify(user.password, password);
  if (!isValid) throw new Error("Contraseña incorrecta");

  const token = crypto.randomBytes(64).toString("hex");
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30); // 30 días
  await createSessionDb({
    token,
    expiresAt,
    userId: user.id,
  });

  const cookieStore = await cookies();
  cookieStore.set({
    name: "session",
    value: token,
    sameSite: "lax",
    expires: expiresAt.getTime(),
    path: "/",
    domain: process.env.NODE_ENV === "production" ? ".vercel.app" : undefined,
  });
}
export async function logoutService() {
  const user = await getCurrentUser();
  if (!user) throw new Error("Usuario no encontrado");
  await invalidateSession();
}

export default loginService;
