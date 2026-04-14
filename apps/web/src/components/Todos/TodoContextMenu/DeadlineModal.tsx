import { Box, Modal } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { StaticDateTimePicker } from "@mui/x-date-pickers";
import { type FC } from "react";
import type { TodoResponse } from "../../../api/generated/model";
import { useTodoUpdate } from "../../../api/generated/toodl";
import { TodoUpdateBody } from "../../../api/generated/toodlApi.zod";
import { useZodForm } from "../../../hooks/useZodForm";

interface Props {
  todo: TodoResponse;
  visible: boolean;
  onDismissed: () => void;
}

const DeadlineModal: FC<Props> = ({ visible, onDismissed, todo }) => {
  const updateTodoMutation = useTodoUpdate();
  const smallScreen = useMediaQuery("(max-width:1279px)");

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
          enableDeadline: true,
        },
      });
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
          width: "auto",
          overflow: "hidden",
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
        }}
      >
        <form.Field name="startTime">
          {(field) => (
            <StaticDateTimePicker
              value={new Date(field.state.value ?? new Date())}
              onChange={(val) => field.handleChange((val ?? new Date()).toISOString())}
              onAccept={() => void form.handleSubmit()}
              onClose={onDismissed}
              orientation={smallScreen ? "portrait" : "landscape"}
            />
          )}
        </form.Field>
      </Box>
    </Modal>
  );
};

export default DeadlineModal;
