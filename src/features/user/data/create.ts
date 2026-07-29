'use server'


import prisma from "@/lib/prisma";
import { CreateUserInput } from "../types/schemaUser";
import argon2 from "argon2";

async function createUser({ email, name, passwordHash }: CreateUserInput) {
  const hash = await argon2.hash(passwordHash);
  return prisma.user.create({
    data: {
      email,
      name,
      password: hash,
    },
  });
}

export default createUser;
