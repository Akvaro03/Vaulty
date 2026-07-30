"use server";

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
      categories: {
        create: [
          {
            color: "#155512",
            icon: "ArrowDown",
            name: "Vivienda",
            type: "EXPENSE",
          },
          {
            color: "#cb0909",
            icon: "ArrowDown",
            name: "Vivienda",
            type: "EXPENSE",
          },
          {
            color: "#553112",
            icon: "ArrowDown",
            name: "Vivienda",
            type: "EXPENSE",
          },
          {
            color: "#ff6a00",
            icon: "ArrowDown",
            name: "Vivienda",
            type: "EXPENSE",
          },
        ],
      },
    },
  });
}

export default createUser;
