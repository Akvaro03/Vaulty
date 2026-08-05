import { User } from "@/generated/prisma/client";

export type AuthResult =
  | {
      authenticated: true;
      user: User;
    }
  | {
      authenticated: false;
      reason: "NO_COOKIE";
    }
  | {
      authenticated: false;
      reason: "SESSION_NOT_FOUND";
    }
  | {
      authenticated: false;
      reason: "SESSION_EXPIRED";
    };

export class UnauthorizedError extends Error {
  constructor(message = "Unauthorized") {
    super(message);
    this.name = "Unauthorized";
  }
}
