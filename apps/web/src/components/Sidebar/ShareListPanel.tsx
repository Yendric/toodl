import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box,
  Button,
  Chip,
  FormControl,
  FormLabel,
  IconButton,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
} from "@mui/material";
import type { FC } from "react";
import { type ListResponse, type SharePermission } from "../../api/generated/model";
import { useShareDestroy, useShareIndexForList, useShareStore, useShareUpdate } from "../../api/generated/toodl";
import { ShareStoreBody } from "../../api/generated/toodlApi.zod";
import { useZodForm } from "../../hooks/useZodForm";
import { ZodSelect } from "../Form/ZodSelect";
import { ZodTextField } from "../Form/ZodTextField";

interface Props {
  list: ListResponse;
}

const ShareListPanel: FC<Props> = ({ list }) => {
  const { data: shares } = useShareIndexForList(list.id);
  const createShareMutation = useShareStore();
  const updateShareMutation = useShareUpdate();
  const destroyShareMutation = useShareDestroy();

  const form = useZodForm(ShareStoreBody, {
    defaultValues: {
      email: "",
      permission: "READ" as SharePermission,
    },
    onSubmit: ({ value }) => {
      createShareMutation.mutate(
        { listId: list.id, data: value },
        {
          onSuccess: () => {
            form.reset();
          },
        },
      );
    },
  });

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          void form.handleSubmit();
        }}
        noValidate
      >
        <FormControl fullWidth sx={{ mt: 1 }}>
          <FormLabel>E-mailadres</FormLabel>
          <form.Field name="email">
            {(field) => <ZodTextField field={field} type="email" variant="outlined" size="small" fullWidth />}
          </form.Field>
        </FormControl>
        <FormControl fullWidth sx={{ mt: 1 }}>
          <FormLabel>Rechten</FormLabel>
          <form.Field name="permission">
            {(field) => (
              <ZodSelect field={field} size="small" fullWidth>
                <MenuItem value="READ">Lezen</MenuItem>
                <MenuItem value="WRITE">Bewerken</MenuItem>
              </ZodSelect>
            )}
          </form.Field>
        </FormControl>
        <Box sx={{ textAlign: "center", mt: 2 }}>
          <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
            {([canSubmit, isSubmitting]) => (
              <Button type="submit" variant="contained" color="primary" disabled={!canSubmit || isSubmitting}>
                {isSubmitting ? "Laden..." : "Uitnodigen"}
              </Button>
            )}
          </form.Subscribe>
        </Box>
      </form>

      {!!shares?.length && (
        <List dense sx={{ mt: 2 }}>
          {shares.map((share) => (
            <ListItem
              key={share.id}
              disableGutters
              secondaryAction={
                <>
                  <Select
                    size="small"
                    value={share.permission}
                    onChange={(e) =>
                      updateShareMutation.mutate({
                        shareId: share.id,
                        data: { permission: e.target.value },
                      })
                    }
                    sx={{ mr: 1 }}
                  >
                    <MenuItem value="READ">Lezen</MenuItem>
                    <MenuItem value="WRITE">Bewerken</MenuItem>
                  </Select>
                  <IconButton
                    edge="end"
                    aria-label="verwijderen"
                    onClick={() => destroyShareMutation.mutate({ shareId: share.id })}
                  >
                    <DeleteIcon />
                  </IconButton>
                </>
              }
            >
              <ListItemText
                primary={share.email}
                slotProps={{ primary: { sx: { wordBreak: "break-all", pr: 1 } } }}
                secondary={share.status === "PENDING" ? <Chip label="In afwachting" size="small" /> : null}
              />
            </ListItem>
          ))}
        </List>
      )}
    </>
  );
};

export default ShareListPanel;
