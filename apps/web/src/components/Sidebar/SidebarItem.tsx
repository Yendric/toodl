import CircleIcon from "@mui/icons-material/Circle";
import { ListItemButton, ListItemIcon, ListItemText, Typography } from "@mui/material";
import { useState, type FC, type MouseEvent } from "react";
import { Link } from "react-router";
import type { ListResponse } from "../../api/generated/model";
import { useCurrentList } from "../../context/CurrentListState";
import DestroyListModal from "./DestroyListModal";
import EditListModal from "./EditListModal";

type Props = {
  list: ListResponse;
};

const SidebarItem: FC<Props> = ({ list }) => {
  const currentList = useCurrentList();
  const [modalMode, setModalMode] = useState<"hidden" | "edit" | "delete">("hidden");

  return (
    <>
      <Link to={`/todos?${new URLSearchParams({ list: list.id.toString() })}`} viewTransition>
        <ListItemButton
          selected={currentList.list?.id === list.id}
          key={list.id}
          onDoubleClick={() => setModalMode("edit")}
          onContextMenu={(e: MouseEvent) => {
            e.preventDefault();
            setModalMode("edit");
          }}
        >
          <ListItemIcon>
            <div
              style={{
                fontSize: 16,
                position: "relative",
                display: "inline-flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <CircleIcon color="primary" sx={{ color: list.color }} />
              <Typography
                component="span"
                sx={{
                  position: "absolute",
                  textShadow: "1px 1px 2px rgb(0 0 0 / 48%)",
                  color: "white",
                }}
              >
                {list.name.charAt(0)}
              </Typography>
            </div>
          </ListItemIcon>
          <ListItemText primary={list.name} />
        </ListItemButton>
      </Link>
      <EditListModal
        key={list.id}
        list={list}
        visible={modalMode === "edit"}
        onDismissed={() => setModalMode("hidden")}
        onDeleteRequest={() => setModalMode("delete")}
      />
      <DestroyListModal list={list} visible={modalMode === "delete"} onDismissed={() => setModalMode("hidden")} />
    </>
  );
};

export default SidebarItem;
