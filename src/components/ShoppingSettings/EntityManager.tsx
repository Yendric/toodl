import { Add, Delete } from "@mui/icons-material";
import { Box, Button, Card, CardContent, IconButton, List, ListItem, ListItemText, Typography } from "@mui/material";
import { type FC } from "react";
import { CategoryUpdateBody } from "../../api/generated/toodlApi.zod";
import { useZodForm } from "../../hooks/useZodForm";
import { ZodTextField } from "../Form/ZodTextField";

interface EntityManagerProps {
  title: string;
  label: string;
  items: Array<{ id: number; name: string }>;
  onAdd: (name: string, reset: () => void) => void;
  onDelete: (id: number) => void;
  isAdding?: boolean;
}

const EntityManager: FC<EntityManagerProps> = ({ title, label, items, onAdd, onDelete, isAdding }) => {
  const form = useZodForm(CategoryUpdateBody, {
    defaultValues: { name: "" },
    onSubmit: ({ value }) => {
      onAdd(value.name, () => form.reset());
    },
  });

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6">{title}</Typography>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            void form.handleSubmit();
          }}
        >
          <Box sx={{ display: "flex", mt: 1 }}>
            <form.Field name="name">
              {(field) => <ZodTextField field={field} size="small" label={label} fullWidth />}
            </form.Field>
            <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
              {([canSubmit, isSubmitting]) => (
                <Button
                  type="submit"
                  variant="contained"
                  disabled={!canSubmit || isSubmitting || isAdding}
                  sx={{ ml: 1 }}
                >
                  <Add />
                </Button>
              )}
            </form.Subscribe>
          </Box>
        </form>
        <List dense>
          {items.map((item) => (
            <ListItem
              key={item.id}
              secondaryAction={
                <IconButton edge="end" onClick={() => onDelete(item.id)}>
                  <Delete />
                </IconButton>
              }
            >
              <ListItemText primary={item.name} />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default EntityManager;
