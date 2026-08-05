import prisma from "@/lib/prisma";

async function createSessionDb({
  token,
  expiresAt,
  userId,
}: {
  token: string;
  expiresAt: Date;
  userId: string;
}) {
  return await prisma.session.create({
    data: {
      token,
      expiresAt,
      userId,
    },
  });
}

export default createSessionDb;
