import { z } from "zod";

export const loginSchema = z.object({
  email: z.email(),
  password: z.string(),
});

export type loginInput = z.infer<typeof loginSchema>;
