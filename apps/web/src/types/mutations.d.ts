import "@tanstack/react-query";
import { Mutation } from "@tanstack/react-query";

declare module "@tanstack/react-query" {
  export class MutationCache extends Subscribable<MutationCacheListener> {
    getAll(): Mutation<unkown, unkown, { id?: number; listId?: number }, unkown>[];
  }
}
