import AddCircleIcon from "@mui/icons-material/AddCircle";
import { FormControl, IconButton, InputAdornment, MenuItem, Select } from "@mui/material";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { Suspense, type FC, type KeyboardEvent } from "react";
import { useCategoryIndexSuspense, useTodoStore, useUserInfoSuspense } from "../../api/generated/toodl";
import { useCurrentList } from "../../context/CurrentListState";
import { useZodForm } from "../../hooks/useZodForm";
import { storeSchema } from "../../schemas/todo";

const CategorySelect: FC<{ register: any }> = ({ register }) => {
  const { data: categories } = useCategoryIndexSuspense();

  return (
    <FormControl variant="standard" sx={{ minWidth: 120, ml: 2 }}>
      <Select {...register("categoryId")} defaultValue="" displayEmpty>
        <MenuItem value="">
          <em>Geen categorie</em>
        </MenuItem>
        {categories.map((cat) => (
          <MenuItem key={cat.id} value={cat.id}>
            {cat.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

const CreateTodoForm: FC<{ disabled?: boolean }> = ({ disabled = false }) => {
  const { data: user } = useUserInfoSuspense();
  const currentList = useCurrentList();
  const isShoppingList = currentList.list?.type === "SHOPPING";

  const {
    handleSubmit,
    register,
    setValue,
    reset,
    formState: { errors },
  } = useZodForm({
    schema: storeSchema,
    defaultValues: {
      done: false,
      subject: "",
      startTime: new Date(),
      categoryId: null,
    },
  });

  const createTodoMutation = useTodoStore();

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      onSubmit();
    }
  }

  const onSubmit = handleSubmit((todo) => {
    reset();
    setValue("startTime", new Date());

    createTodoMutation.mutate({
      data: {
        ...todo,
        done: false,
        listId: currentList.list?.id,
        startTime: new Date().toISOString(),
        endTime: todo.endTime?.toISOString(),
        categoryId: todo.categoryId || null,
      },
    });
  });

  return (
    <form onSubmit={onSubmit}>
      <Grid container sx={{ mb: 2, justifyContent: "center", alignItems: "flex-end" }}>
        <TextField
          {...register("subject")}
          multiline={true}
          error={!!errors.subject}
          disabled={disabled}
          helperText={errors.subject?.message}
          variant="standard"
          label={`Wat moet er gebeuren, ${user.username}?`}
          onKeyDown={handleKeyDown}
          sx={{ maxWidth: "25rem", flexGrow: 1 }}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton type="submit" edge="start" color="default">
                    <AddCircleIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }
          }}
        />
        {isShoppingList && (
          <Suspense fallback={null}>
            <CategorySelect register={register} />
          </Suspense>
        )}
      </Grid>
    </form>
  );
};

export default CreateTodoForm;
