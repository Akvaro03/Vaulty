import { cookies } from "next/headers";
import getSessionService from "./getSessionService";
import prisma from "@/lib/prisma";

async function invalidateSession() {
  const cookieStore = await cookies();

  const token = cookieStore.get("session")?.value;
  if (!token) {
    return {
      authenticated: false,
      reason: "NO_COOKIE",
    };
  }

  try {
    const session = await getSessionService({ token: token });
    await prisma.session.delete({
      where: {
        id: session?.id,
      },
    });
  } catch {}
  cookieStore.delete("session");
}

export default invalidateSession;
