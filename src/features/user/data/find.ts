import prisma from "@/lib/prisma";

function findUserByEmail(email: string) {
  if (!email) return;

  return prisma.user.findUnique({ where: { email } });
}

export default findUserByEmail;
