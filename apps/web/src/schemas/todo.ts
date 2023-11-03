import { z } from "zod";

export const storeSchema = z.object({
  done: z.boolean().default(false),
  subject: z.string().min(1).max(255),
  description: z.string().max(255).default("").optional(),
  enableDeadline: z.boolean().default(false).optional(),
  isAllDay: z.boolean().default(false).optional(),
  location: z.string().max(255).default("").optional(),
  recurrenceRule: z.string().max(255).default("").optional(),
  recurrenceException: z.string().max(255).default("").optional(),
  startTimezone: z.string().max(255).default("").optional(),
  endTimezone: z.string().max(255).default("").optional(),
  startTime: z.date().default(new Date()),
  endTime: z.date().optional(),
  listId: z.number().nullable().default(null).optional(),
});

export const updateSchema = storeSchema.extend({
  id: z.number(),
});

export const destroySchema = z.object({
  id: z.number(),
});
