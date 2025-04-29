import { z } from "zod";

export const authSchema = z.object({
  userId: z.number(),
  token: z.string(),
})