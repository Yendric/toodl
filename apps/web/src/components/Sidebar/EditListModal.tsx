import { Box, Button, FormControl, FormLabel, MenuItem, Modal, Tab, Tabs, Typography } from "@mui/material";
import { useState, type FC } from "react";
import { type ListResponse } from "../../api/generated/model";
import { useListUpdate } from "../../api/generated/toodl";
import { ListUpdateBody } from "../../api/generated/toodlApi.zod";
import { useZodForm } from "../../hooks/useZodForm";
import { ZodInput } from "../Form/ZodInput";
import { ZodSelect } from "../Form/ZodSelect";
import { ZodTextField } from "../Form/ZodTextField";
import ShareListPanel from "./ShareListPanel";

interface Props {
  list: ListResponse;
  visible: boolean;
  onDismissed: () => void;
  onDeleteRequest: () => void;
}

const EditListModal: FC<Props> = ({ visible, onDismissed, onDeleteRequest, list }) => {
  const [tab, setTab] = useState<"general" | "share">("general");
  const updateListMutation = useListUpdate();

  const form = useZodForm(ListUpdateBody, {
    defaultValues: {
      name: list.name,
      color: list.color,
      type: list.type,
    },
    onSubmit: ({ value }) => {
      updateListMutation.mutate(
        { listId: list.id, data: value },
        {
          onSuccess: () => {
            onDismissed();
          },
        },
      );
    },
  });

  const handleClose = () => {
    onDismissed();
    setTab("general");
  };

  return (
    <Modal
      open={visible}
      onClose={handleClose}
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
          Lijst {list.name} bewerken
        </Typography>

        <Tabs value={tab} onChange={(_, value: "general" | "share") => setTab(value)} sx={{ mb: 1 }}>
          <Tab label="Algemeen" value="general" />
          <Tab label="Delen" value="share" />
        </Tabs>

        {tab === "general" ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
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
                  <Button
                    type="submit"
                    sx={{ mr: 1 }}
                    variant="contained"
                    color="primary"
                    disabled={!canSubmit || isSubmitting}
                  >
                    {isSubmitting ? "Laden..." : "Opslaan"}
                  </Button>
                )}
              </form.Subscribe>
              <Button type="button" onClick={onDeleteRequest} variant="contained" color="error">
                Verwijderen
              </Button>
            </Box>
          </form>
        ) : (
          <ShareListPanel list={list} />
        )}
      </Box>
    </Modal>
  );
};

export default EditListModal;
