import { z } from "zod";

export const storeSchema = z.object({
  name: z.string().min(1).max(20),
  color: z.string().length(7),
});

export const updateSchema = storeSchema.extend({
  id: z.number(),
});

export const destroySchema = z.object({
  id: z.number(),
});
