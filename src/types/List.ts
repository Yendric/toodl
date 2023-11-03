import { z } from "zod";
import { updateSchema } from "../schemas/list";

export type List = z.infer<typeof updateSchema>;

export type UnstoredList = Omit<List, "id">;

export type LocalList = List & {
  localId: number;
};
