import prisma from "@/lib/prisma";

async function getSessionDb(token: string) {
  return await prisma.session.findUnique({
    where: {
      token,
    },

    include: {
      user: true,
    },
  });
}

export default getSessionDb;
