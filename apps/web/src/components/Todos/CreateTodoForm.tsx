import AddCircleIcon from "@mui/icons-material/AddCircle";
import {
  CircularProgress,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { generateKeyBetween } from "fractional-indexing";
import { Suspense, type FC, type KeyboardEvent } from "react";
import type { TodoResponse } from "../../api/generated/model";
import { useCategoryIndexSuspense, useUserInfoSuspense } from "../../api/generated/toodl";
import { TodoStoreBody } from "../../api/generated/toodlApi.zod";
import { useCurrentList } from "../../context/CurrentListState";
import { useCategoryPredictor } from "../../hooks/useCategoryPredictor";
import { useTodoOptimisticMutations } from "../../hooks/useTodoOptimisticMutations";
import { useZodForm } from "../../hooks/useZodForm";

const CreateTodoForm: FC<{ activeTodos: TodoResponse[]; disabled?: boolean }> = ({ activeTodos, disabled = false }) => {
  const { data: user } = useUserInfoSuspense();
  const { data: categories } = useCategoryIndexSuspense();
  const currentList = useCurrentList();
  const isShoppingList = currentList.list?.type === "SHOPPING";

  const { createTodo } = useTodoOptimisticMutations();
  const { handlePredict, isPredicting } = useCategoryPredictor(isShoppingList, (categoryId) =>
    form.setFieldValue("categoryId", categoryId),
  );

  const form = useZodForm(TodoStoreBody, {
    defaultValues: {
      done: false,
      subject: "",
      startTime: new Date().toISOString(),
      categoryId: null,
    },
    onSubmit: ({ value }) => {
      const firstTodo = activeTodos[0];
      const newPosition = generateKeyBetween(null, firstTodo?.position || null);

      createTodo({
        data: {
          ...value,
          done: false,
          listId: currentList.list?.id,
          position: newPosition,
        },
      });
      form.reset({
        done: false,
        subject: "",
        startTime: new Date().toISOString(),
        categoryId: null,
      });
    },
  });

  const handleSubjectChange = (value: string) => {
    form.setFieldValue("subject", value);
    handlePredict(value);
  };

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      void form.handleSubmit();
    }
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        void form.handleSubmit();
      }}
    >
      <Grid container sx={{ mb: 5, justifyContent: "center", alignItems: "flex-end" }}>
        <form.Field name="subject">
          {(field) => (
            <TextField
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => handleSubjectChange(e.target.value)}
              multiline={true}
              error={!!field.state.meta.errors.length}
              disabled={disabled}
              helperText={field.state.meta.errors.map((e) => e?.message).join(", ")}
              variant="standard"
              label={`Wat moet er gebeuren, ${user.username}?`}
              onKeyDown={handleKeyDown}
              sx={{ maxWidth: "25rem", flexGrow: 1 }}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      {isPredicting && <CircularProgress size={20} sx={{ mr: 1 }} />}
                      <IconButton type="submit" edge="start" color="default">
                        <AddCircleIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
          )}
        </form.Field>
        {isShoppingList && (
          <Suspense fallback={null}>
            <FormControl variant="standard" sx={{ minWidth: 120, ml: 2 }}>
              <form.Field name="categoryId">
                {(field) => (
                  <Select
                    name={field.name}
                    value={field.state.value || ""}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value ? Number(e.target.value) : null)}
                    displayEmpty
                  >
                    <MenuItem value="">
                      <em>Geen categorie</em>
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
          </Suspense>
        )}
      </Grid>
    </form>
  );
};

export default CreateTodoForm;
