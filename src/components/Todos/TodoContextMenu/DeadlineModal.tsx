import { Box, Modal } from "@mui/material";
import { StaticDateTimePicker } from "@mui/x-date-pickers";
import { add } from "date-fns";
import { useEffect, useState, type FC } from "react";
import { Controller } from "react-hook-form";
import type { TodoResponse } from "../../../api/generated/model";
import { useTodoUpdate } from "../../../api/generated/toodl";
import { useZodForm } from "../../../hooks/useZodForm";
import { updateSchema } from "../../../schemas/todo";
import DestroyModal from "./DestroyModal";

interface Props {
  todo: TodoResponse;
  visible: boolean;
  onDismissed: () => void;
}

const DeadlineModal: FC<Props> = ({ visible, onDismissed, todo }) => {
  const { handleSubmit, control, reset } = useZodForm({
    schema: updateSchema,
    defaultValues: {
      ...todo,
      startTime: todo.startTime ? new Date(todo.startTime) : new Date(),
      endTime: todo.endTime ? new Date(todo.endTime) : undefined,
    },
  });

  useEffect(() => {
    reset({
      ...todo,
      startTime: todo.startTime ? new Date(todo.startTime) : new Date(),
      endTime: todo.endTime ? new Date(todo.endTime) : undefined,
    });
  }, [todo, reset]);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const smallScreen = window.screen.width < 1280;

  const updateTodoMutation = useTodoUpdate();

  const onSubmit = handleSubmit((data) => {
    onDismissed();
    const startTime = data.startTime ?? new Date();
    const endTime = add(startTime, { hours: 1 });

    updateTodoMutation.mutate({
      todoId: todo.id,
      data: {
        ...data,
        enableDeadline: true,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
      },
    });
  });

  return (
    <>
      <DestroyModal
        todo={todo}
        visible={deleteModalOpen}
        onDismissed={() => {
          setDeleteModalOpen(false);
          onDismissed();
        }}
      />
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
            width: "auto",
            overflow: "hidden",
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
          }}
        >
          <Controller
            control={control}
            name="startTime"
            render={({ field: { onChange, value } }) => (
              <StaticDateTimePicker
                value={value}
                onChange={onChange}
                onAccept={async () => await onSubmit()}
                onClose={onDismissed}
                orientation={smallScreen ? "portrait" : "landscape"}
              />
            )}
          />
        </Box>
      </Modal>
    </>
  );
};

export default DeadlineModal;
