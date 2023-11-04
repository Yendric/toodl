import { z } from "zod";

export const storeSchema = z.object({
  done: z.boolean().default(false),
  subject: z.string().min(1).max(255),
  description: z.string().max(255).default("").nullish(),
  enableDeadline: z.boolean().default(false).nullish(),
  isAllDay: z.boolean().default(false).nullish(),
  location: z.string().max(255).default("").nullish(),
  recurrenceRule: z.string().max(255).default("").nullish(),
  recurrenceException: z.string().max(255).default("").nullish(),
  startTimezone: z.string().max(255).default("").nullish(),
  endTimezone: z.string().max(255).default("").nullish(),
  startTime: z.date().default(new Date()),
  endTime: z.date().nullish(),
  listId: z.number().nullable().default(null).nullish(),
});

export const updateSchema = storeSchema.extend({
  id: z.number(),
});

export const destroySchema = z.object({
  id: z.number(),
});
