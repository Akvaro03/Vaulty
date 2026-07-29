"use server";

import findUserByEmail from "@/features/user/data/find";
import { loginInput } from "../types/schemaAuth";
import argon2 from "argon2";

async function loginService({ email, password }: loginInput) {
  const user = await findUserByEmail(email);
  if (!user) throw new Error("Usuario no encontrado");

  const isValid = await argon2.verify(user.password, password);
  if (!isValid) throw new Error();

  return user;
}

export default loginService;
