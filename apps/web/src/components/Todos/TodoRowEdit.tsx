import type { DraggableAttributes, DraggableSyntheticListeners } from "@dnd-kit/core";
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
import { type CSSProperties, type FC, type KeyboardEvent } from "react";
import type { TodoResponse } from "../../api/generated/model";
import { useCategoryIndexSuspense } from "../../api/generated/toodl";
import { TodoUpdateBody } from "../../api/generated/toodlApi.zod";
import { useCurrentList } from "../../context/CurrentListState";
import { toDateTimeString } from "../../helpers/dateTime";
import { useTodoOptimisticMutations } from "../../hooks/useTodoOptimisticMutations";
import { useZodForm } from "../../hooks/useZodForm";

interface Props {
  todo: TodoResponse;
  toggleEditing: () => void;
  setNodeRef: (node: HTMLElement | null) => void;
  style: CSSProperties;
  attributes: DraggableAttributes;
  listeners: DraggableSyntheticListeners;
  isDragging?: boolean;
  isOverlay?: boolean;
}

const TodoEditRow: FC<Props> = ({
  todo,
  toggleEditing,
  setNodeRef,
  style,
  attributes,
  listeners,
  isDragging,
  isOverlay,
}) => {
  const { list } = useCurrentList();
  const { data: categories } = useCategoryIndexSuspense();
  const isShoppingList = list?.type === "SHOPPING";
  const { updateTodo } = useTodoOptimisticMutations();

  const form = useZodForm(TodoUpdateBody, {
    defaultValues: {
      ...todo,
      startTime: todo.startTime ?? new Date().toISOString(),
      endTime: todo.endTime,
      categoryId: todo.categoryId || null,
    },
    onSubmit: ({ value }) => {
      updateTodo({
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

  const draggingStyles: CSSProperties = isOverlay
    ? {
      boxShadow: "0 10px 20px rgba(0,0,0,0.15)",
      opacity: 1,
      zIndex: 99,
      position: "relative",
      backgroundColor: "var(--mui-palette-background-paper)",
    }
    : isDragging
      ? {
        transform: style.transform,
        opacity: 0.4,
      }
      : {
        transform: style.transform,
      };

  return (
    <TableRow
      ref={setNodeRef}
      style={{
        ...style,
        ...draggingStyles,
        touchAction: "none",
      }}
      {...attributes}
      {...listeners}
      sx={{
        backgroundColor: isOverlay ? "background.paper" : isDragging ? "action.hover" : "inherit",
        display: "table-row",
        cursor: isOverlay ? "grabbing" : isDragging ? "grabbing" : "grab",
        "& td": {
          borderBottom: (isDragging || isOverlay) ? "none !important" : undefined,
        }
      }}
    >
      <TableCell
        padding="checkbox"
        sx={{ padding: "0 !important", paddingLeft: "8px !important", width: "48px" }}
      >
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
        <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
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
      <TableCell align="right" sx={{ padding: "0 !important", width: "48px" }}>
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
