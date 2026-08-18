import CheckIcon from "@mui/icons-material/Check";
import CircleIcon from "@mui/icons-material/Circle";
import CloseIcon from "@mui/icons-material/Close";
import { Divider, IconButton, List, ListItem, ListItemIcon, ListItemText, Typography } from "@mui/material";
import type { FC } from "react";
import { useShareAccept, useShareInvitations, useShareLeave } from "../../api/generated/toodl";

const SidebarInvitations: FC = () => {
  const { data: invitations } = useShareInvitations();
  const acceptMutation = useShareAccept();
  const declineMutation = useShareLeave();

  if (!invitations?.length) return null;

  return (
    <>
      <Divider />
      <List
        subheader={
          <Typography variant="overline" sx={{ ml: 2, color: "text.secondary" }}>
            Uitnodigingen
          </Typography>
        }
      >
        {invitations.map((invitation) => (
          <ListItem
            key={invitation.id}
            secondaryAction={
              <>
                <IconButton
                  size="small"
                  aria-label="accepteren"
                  onClick={() => acceptMutation.mutate({ listId: invitation.listId })}
                >
                  <CheckIcon fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  aria-label="weigeren"
                  onClick={() => declineMutation.mutate({ listId: invitation.listId })}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </>
            }
          >
            <ListItemIcon>
              <CircleIcon sx={{ color: invitation.listColor }} />
            </ListItemIcon>
            <ListItemText primary={invitation.listName} secondary={`van ${invitation.ownerUsername}`} />
          </ListItem>
        ))}
      </List>
    </>
  );
};

export default SidebarInvitations;
