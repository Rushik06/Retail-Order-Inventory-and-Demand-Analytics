import { z } from "zod";

export const exportEmailSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
});