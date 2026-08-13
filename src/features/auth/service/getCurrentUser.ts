import { cookies } from "next/headers";
import getSessionService from "./getSessionService";
import { AuthResult } from "../types/authType";

async function getCurrentUser(): Promise<AuthResult> {
  const totalStart = performance.now();
  let start = performance.now();

  const cookieStore = await cookies();

  console.log(
    `[Dashboard] cookieStore: ${(performance.now() - start).toFixed(2)}ms`,
  );
  start = performance.now();
  const token = cookieStore.get("session")?.value;
  if (!token) {
    return {
      authenticated: false,
      reason: "NO_COOKIE",
    };
  }

  const session = await getSessionService({ token: token });
  console.log(
    `[Dashboard] getSessionService: ${(performance.now() - start).toFixed(2)}ms`,
  );
  start = performance.now();

  if (!session) {
    return {
      authenticated: false,
      reason: "SESSION_NOT_FOUND",
    };
  }

  if (session.expiresAt < new Date()) {
    return {
      authenticated: false,
      reason: "SESSION_EXPIRED",
    };
  }
  console.log(
    `[Dashboard] TOTAL: ${(performance.now() - totalStart).toFixed(2)}ms`,
  );
  return {
    authenticated: true,
    session: session,
  };
}

export default getCurrentUser;
