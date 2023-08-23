import { queryClient } from "../queryClient";
import { destroy as destroyList, store as storeList, update as updateList } from "./list/api";
import { destroy as destroyTodo, store as storeTodo, toggle as toggleTodo, update as updateTodo } from "./todo/api";

export function setMutationDefaults() {
  queryClient.setMutationDefaults(["destroyList"], { mutationFn: destroyList });
  queryClient.setMutationDefaults(["storeList"], { mutationFn: storeList });
  queryClient.setMutationDefaults(["updateList"], { mutationFn: updateList });

  queryClient.setMutationDefaults(["destroyTodo"], { mutationFn: destroyTodo });
  queryClient.setMutationDefaults(["storeTodo"], { mutationFn: storeTodo });
  queryClient.setMutationDefaults(["toggleTodo"], { mutationFn: toggleTodo });
  queryClient.setMutationDefaults(["updateTodo"], { mutationFn: updateTodo });
}
