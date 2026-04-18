import { Box, Button, FormControl, FormLabel, MenuItem, Modal, Typography } from "@mui/material";
import { type FC } from "react";
import { useListStore } from "../../api/generated/toodl";
import { ListStoreBody } from "../../api/generated/toodlApi.zod";
import { useZodForm } from "../../hooks/useZodForm";
import { ZodInput } from "../Form/ZodInput";
import { ZodSelect } from "../Form/ZodSelect";
import { ZodTextField } from "../Form/ZodTextField";

interface Props {
  visible: boolean;
  onDismissed: () => void;
}

const CreateListModal: FC<Props> = ({ visible, onDismissed }) => {
  const createListMutation = useListStore();

  const form = useZodForm(ListStoreBody, {
    defaultValues: {
      name: "",
      color: "#33AAFF",
      type: "REGULAR",
    },
    onSubmit: ({ value }) => {
      onDismissed();
      createListMutation.mutate({ data: value });
      form.reset();
    },
  });

  return (
    <Modal
      open={visible}
      onClose={onDismissed}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography variant="h6" component="h2">
          Lijst aanmaken
        </Typography>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            void form.handleSubmit();
          }}
          noValidate
        >
          <FormControl fullWidth sx={{ mt: 1 }}>
            <FormLabel>Naam</FormLabel>
            <form.Field name="name">
              {(field) => <ZodTextField field={field} variant="outlined" fullWidth />}
            </form.Field>
          </FormControl>
          <FormControl fullWidth sx={{ mt: 1 }}>
            <FormLabel>Kleur</FormLabel>
            <form.Field name="color">{(field) => <ZodInput field={field} type="color" fullWidth />}</form.Field>
          </FormControl>
          <FormControl fullWidth sx={{ mt: 1 }}>
            <FormLabel>Type</FormLabel>
            <form.Field name="type">
              {(field) => (
                <ZodSelect field={field} fullWidth>
                  <MenuItem value="REGULAR">Normaal</MenuItem>
                  <MenuItem value="SHOPPING">Winkel</MenuItem>
                </ZodSelect>
              )}
            </form.Field>
          </FormControl>
          <Box sx={{ textAlign: "center", mt: 2 }}>
            <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
              {([canSubmit, isSubmitting]) => (
                <Button type="submit" variant="contained" color="primary" disabled={!canSubmit || isSubmitting}>
                  {isSubmitting ? "Laden..." : "Maken"}
                </Button>
              )}
            </form.Subscribe>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default CreateListModal;
