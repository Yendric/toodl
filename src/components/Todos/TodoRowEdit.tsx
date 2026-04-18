import { type DraggableProvided } from "@hello-pangea/dnd";
import { DragIndicator } from "@mui/icons-material";
import SaveIcon from "@mui/icons-material/Save";
import {
  Box,
  Checkbox,
  FormControl,
  IconButton,
  MenuItem,
  Select,
  TableCell,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { type FC, type KeyboardEvent } from "react";
import type { TodoResponse } from "../../api/generated/model";
import { useCategoryIndexSuspense, useTodoUpdate } from "../../api/generated/toodl";
import { TodoUpdateBody } from "../../api/generated/toodlApi.zod";
import { useCurrentList } from "../../context/CurrentListState";
import { toDateTimeString } from "../../helpers/dateTime";
import { useZodForm } from "../../hooks/useZodForm";

interface Props {
  todo: TodoResponse;
  toggleEditing: () => void;
  provided?: DraggableProvided;
  isDragging?: boolean;
}

const TodoEditRow: FC<Props> = ({ todo, toggleEditing, provided, isDragging }) => {
  const { list } = useCurrentList();
  const { data: categories } = useCategoryIndexSuspense();
  const isShoppingList = list?.type === "SHOPPING";
  const updateTodoMutation = useTodoUpdate();

  const form = useZodForm(TodoUpdateBody, {
    defaultValues: {
      ...todo,
      startTime: todo.startTime ?? new Date().toISOString(),
      endTime: todo.endTime,
      categoryId: todo.categoryId || null,
    },
    onSubmit: ({ value }) => {
      updateTodoMutation.mutate({
        todoId: todo.id,
        data: value,
      });
      toggleEditing();
    },
  });

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Enter" || event.key === "Escape") {
      void form.handleSubmit();
    }
  }

  return (
    <TableRow
      ref={provided?.innerRef}
      {...provided?.draggableProps}
      style={{ transition: "height 2s", ...provided?.draggableProps.style }}
      sx={{
        backgroundColor: isDragging ? "action.hover" : "inherit",
        display: "table-row",
      }}
    >
      <TableCell sx={{ padding: "0 !important", width: 0 }}>
        {provided && (
          <div {...provided.dragHandleProps} style={{ display: "flex", alignItems: "center", paddingLeft: 8 }}>
            <DragIndicator fontSize="small" color="disabled" />
          </div>
        )}
      </TableCell>
      <TableCell padding="checkbox" sx={{ padding: "0 !important" }}>
        <div>
          <form.Field name="done">
            {(field) => (
              <Checkbox
                checked={!!field.state.value}
                onChange={(e) => field.handleChange(e.target.checked)}
                value="primary"
              />
            )}
          </form.Field>
        </div>
      </TableCell>
      <TableCell sx={{ paddingLeft: "0 !important", paddingRight: "0 !important" }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box sx={{ flexGrow: 1 }}>
            <form.Field name="subject">
              {(field) => (
                <TextField
                  name={field.name}
                  value={field.state.value}
                  onBlur={() => {
                    field.handleBlur();
                    if (!isShoppingList) void form.handleSubmit();
                  }}
                  onChange={(e) => field.handleChange(e.target.value)}
                  multiline={true}
                  error={!!field.state.meta.errors.length}
                  helperText={field.state.meta.errors.map((e) => e?.message).join(", ")}
                  onKeyDown={(e) => handleKeyDown(e)}
                  variant="standard"
                  fullWidth
                  autoFocus
                />
              )}
            </form.Field>
            {todo.enableDeadline && todo.startTime && (
              <Typography
                onClick={toggleEditing}
                sx={{ color: "text.secondary", fontSize: "0.75rem" }}
                style={{ textDecoration: todo.done ? "line-through" : "none" }}
              >
                {toDateTimeString(new Date(todo.startTime))}
              </Typography>
            )}
          </Box>
          {isShoppingList && (
            <FormControl variant="standard" sx={{ minWidth: 100, ml: 1 }}>
              <form.Field name="categoryId">
                {(field) => (
                  <Select
                    name={field.name}
                    value={field.state.value ?? ""}
                    onBlur={field.handleBlur}
                    onChange={(e) => {
                      const val = e.target.value as number | "";
                      field.handleChange(val === "" ? null : val);
                    }}
                    displayEmpty
                  >
                    <MenuItem value={""}>
                      <em>Geen</em>
                    </MenuItem>
                    {categories.map((cat) => (
                      <MenuItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              </form.Field>
            </FormControl>
          )}
        </Box>
      </TableCell>
      <TableCell align="right" style={{ width: 0, whiteSpace: "nowrap" }} sx={{ padding: "0 !important" }}>
        <div>
          <IconButton onClick={() => void form.handleSubmit()} aria-label="edit" size="large">
            <SaveIcon fontSize="small" />
          </IconButton>
        </div>
      </TableCell>
    </TableRow>
  );
};
export default TodoEditRow;
