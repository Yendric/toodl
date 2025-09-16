import { Box, Button, Checkbox, FormLabel, Modal, Stack, TextField, Typography } from "@mui/material";
import { MobileDateTimePicker } from "@mui/x-date-pickers";
import { useEffect, useState, type FC } from "react";
import { Controller } from "react-hook-form";
import { useUpdateTodo } from "../../../api/todo/updateTodo";
import { useZodForm } from "../../../hooks/useZodForm";
import { updateSchema } from "../../../schemas/todo";
import { type LocalTodo } from "../../../types/Todo";
import DestroyModal from "./DestroyModal";

interface Props {
  todo: LocalTodo;
  visible: boolean;
  onDismissed: () => void;
}

const EditModal: FC<Props> = ({ visible, onDismissed, todo }) => {
  const {
    handleSubmit,
    register,
    control,
    reset,
    watch,
    formState: { errors },
  } = useZodForm({ schema: updateSchema, defaultValues: todo });

  useEffect(() => {
    reset(todo);
  }, [todo]);

  const [destroyModalOpen, setDestroyModalOpen] = useState(false);

  const updateTodoMutation = useUpdateTodo();

  const onSubmit = handleSubmit((data) => {
    onDismissed();
    updateTodoMutation.mutate({ ...todo, ...data });
  });

  return (
    <>
      <DestroyModal todo={todo} visible={destroyModalOpen} onDismissed={() => setDestroyModalOpen(false)} />
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

          <form onSubmit={onSubmit} noValidate>
            <Stack sx={{ marginTop: "1rem", marginBottom: "1rem" }} spacing={1}>
              <div>
                <FormLabel>Onderwerp</FormLabel>
                <TextField
                  multiline={true}
                  inputProps={register("subject")}
                  error={!!errors.subject}
                  helperText={errors.subject?.message}
                  variant="outlined"
                  size="small"
                  fullWidth
                />
              </div>
              <div>
                <FormLabel>Omschrijving</FormLabel>
                <TextField
                  multiline={true}
                  inputProps={register("description")}
                  error={!!errors.description}
                  helperText={errors.description?.message}
                  variant="outlined"
                  size="small"
                  fullWidth
                  rows={2}
                />
              </div>
              <div>
                <FormLabel>Locatie</FormLabel>
                <TextField
                  inputProps={register("location")}
                  error={!!errors.location}
                  helperText={errors.location?.message}
                  variant="outlined"
                  size="small"
                  fullWidth
                />
              </div>
              <div>
                <FormLabel>Deadline inschakelen</FormLabel>
                <Checkbox {...register("enableDeadline")} defaultChecked={todo.enableDeadline ?? false} />
              </div>
              {watch("enableDeadline") && (
                <div>
                  <FormLabel>Start & eindtijd</FormLabel>
                  <div>
                    <Controller
                      control={control}
                      name="startTime"
                      render={({ field: { onChange, value } }) => (
                        <MobileDateTimePicker
                          value={value}
                          onChange={onChange}
                          slotProps={{ textField: { size: "small", variant: "outlined" } }}
                          format="dd/MM/yy HH:mm"
                        />
                      )}
                    />
                    <Controller
                      control={control}
                      name="endTime"
                      render={({ field: { onChange, value } }) => (
                        <MobileDateTimePicker
                          value={value}
                          onChange={onChange}
                          slotProps={{ textField: { size: "small", variant: "outlined" } }}
                          format="dd/MM/yy HH:mm"
                        />
                      )}
                    />
                  </div>
                </div>
              )}
            </Stack>
            <Box sx={{ mt: 1 }}>
              <Button type="submit" sx={{ mr: 1 }} variant="contained" color="primary">
                Opslaan
              </Button>
              <Button
                type="button"
                onClick={() => {
                  setDestroyModalOpen(true);
                  onDismissed();
                }}
                variant="contained"
                color="error"
              >
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
