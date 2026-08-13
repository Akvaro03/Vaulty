import { cookies } from "next/headers";
import getSessionService from "./getSessionService";
import { AuthResult } from "../types/authType";
import { cache } from "react";

const getCurrentUser = cache(async (): Promise<AuthResult> => {
  {
    const cookieStore = await cookies();

    const token = cookieStore.get("session")?.value;
    if (!token) {
      return {
        authenticated: false,
        reason: "NO_COOKIE",
      };
    }

    const session = await getSessionService({ token: token });

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
    return {
      authenticated: true,
      session: session,
    };
  }
});
export default getCurrentUser;
