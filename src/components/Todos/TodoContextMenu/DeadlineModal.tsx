import { Box, Modal } from "@mui/material";
import { StaticDateTimePicker } from "@mui/x-date-pickers";
import { add } from "date-fns";
import { FC, useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import { useUpdateTodo } from "../../../api/todo/updateTodo";
import { useZodForm } from "../../../hooks/useZodForm";
import { updateSchema } from "../../../schemas/todo";
import { LocalTodo } from "../../../types/Todo";
import DestroyModal from "./DestroyModal";

interface Props {
  todo: LocalTodo;
  visible: boolean;
  onDismissed: () => void;
}

const DeadlineModal: FC<Props> = ({ visible, onDismissed, todo }) => {
  const { handleSubmit, control, reset } = useZodForm({ schema: updateSchema, defaultValues: todo });

  useEffect(() => {
    reset(todo);
  }, [todo]);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const smallScreen = window.screen.width < 1280;

  const updateTodoMutation = useUpdateTodo();

  const onSubmit = handleSubmit((data) => {
    onDismissed();
    updateTodoMutation.mutate({
      ...todo,
      ...data,
      enableDeadline: true,
      endTime: add(data.startTime ?? new Date(), { hours: 1 }),
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
                onAccept={async (_) => await onSubmit()}
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
