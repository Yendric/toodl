import { Box, Button, FormLabel, Modal, Stack, Typography } from "@mui/material";
import { MobileDateTimePicker } from "@mui/x-date-pickers";
import { type FC } from "react";
import type { TodoResponse } from "../../../api/generated/model";
import { useTodoUpdate } from "../../../api/generated/toodl";
import { TodoUpdateBody } from "../../../api/generated/toodlApi.zod";
import { useZodForm } from "../../../hooks/useZodForm";
import { ZodCheckbox } from "../../Form/ZodCheckbox";
import { ZodTextField } from "../../Form/ZodTextField";

interface Props {
  todo: TodoResponse;
  visible: boolean;
  onDismissed: () => void;
  onDeleteClicked: () => void;
}

const EditModal: FC<Props> = ({ visible, onDismissed, onDeleteClicked, todo }) => {
  const updateTodoMutation = useTodoUpdate();

  const form = useZodForm(TodoUpdateBody, {
    defaultValues: {
      ...todo,
      startTime: todo.startTime ?? new Date().toISOString(),
      endTime: todo.endTime,
      categoryId: todo.categoryId || null,
    },
    onSubmit: ({ value }) => {
      onDismissed();
      updateTodoMutation.mutate({
        todoId: todo.id,
        data: {
          ...value,
          startTime: value.startTime,
          endTime: value.endTime,
        },
      });
    },
  });

  return (
    <>
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
            width: "max(70%, 400px)",
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" component="h2">
            Todo bewerken
          </Typography>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              void form.handleSubmit();
            }}
            noValidate
          >
            <Stack sx={{ marginTop: "1rem", marginBottom: "1rem" }} spacing={1}>
              <div>
                <FormLabel>Onderwerp</FormLabel>
                <form.Field name="subject">
                  {(field) => <ZodTextField field={field} multiline={true} variant="outlined" size="small" fullWidth />}
                </form.Field>
              </div>
              <div>
                <FormLabel>Omschrijving</FormLabel>
                <form.Field name="description">
                  {(field) => (
                    <ZodTextField field={field} multiline={true} variant="outlined" size="small" fullWidth rows={2} />
                  )}
                </form.Field>
              </div>
              <div>
                <FormLabel>Locatie</FormLabel>
                <form.Field name="location">
                  {(field) => <ZodTextField field={field} variant="outlined" size="small" fullWidth />}
                </form.Field>
              </div>
              <div>
                <FormLabel>Deadline inschakelen</FormLabel>
                <form.Field name="enableDeadline">{(field) => <ZodCheckbox field={field} />}</form.Field>
              </div>
              <form.Subscribe selector={(state) => [state.values.enableDeadline]}>
                {([enableDeadline]) =>
                  enableDeadline ? (
                    <div>
                      <FormLabel>Start & eindtijd</FormLabel>
                      <Stack direction="row" spacing={1}>
                        <form.Field name="startTime">
                          {(field) => (
                            <MobileDateTimePicker
                              value={new Date(field.state.value ?? new Date())}
                              onChange={(val) => field.handleChange(val?.toISOString() ?? new Date().toISOString())}
                              slotProps={{ textField: { size: "small", variant: "outlined" } }}
                              format="dd/MM/yy HH:mm"
                            />
                          )}
                        </form.Field>
                        <form.Field name="endTime">
                          {(field) => (
                            <MobileDateTimePicker
                              value={field.state.value ? new Date(field.state.value) : null}
                              onChange={(val) => field.handleChange(val?.toISOString() ?? new Date().toISOString())}
                              slotProps={{ textField: { size: "small", variant: "outlined" } }}
                              format="dd/MM/yy HH:mm"
                            />
                          )}
                        </form.Field>
                      </Stack>
                    </div>
                  ) : null
                }
              </form.Subscribe>
            </Stack>
            <Box sx={{ mt: 1 }}>
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
              <Button type="button" onClick={onDeleteClicked} variant="contained" color="error">
                Verwijderen
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>
    </>
  );
};

export default EditModal;
