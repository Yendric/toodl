import CircleIcon from "@mui/icons-material/Circle";
import { ListItemButton, ListItemIcon, ListItemText, Typography } from "@mui/material";
import { useRef, useState, type FC, type MouseEvent, type TouchEvent } from "react";
import { Link } from "react-router";
import type { ListResponse } from "../../api/generated/model";
import { useCurrentList } from "../../context/CurrentListState";
import { triggerHaptic } from "../../helpers/haptic";
import DestroyListModal from "./DestroyListModal";
import EditListModal from "./EditListModal";

type Props = {
  list: ListResponse;
};

const SidebarItem: FC<Props> = ({ list }) => {
  const currentList = useCurrentList();
  const [modalMode, setModalMode] = useState<"hidden" | "edit" | "delete">("hidden");
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);

  const startLongPress = (e: TouchEvent | MouseEvent) => {
    // We only use this for touch events, mouse events are handled by onContextMenu
    if ("touches" in e) {
      longPressTimer.current = setTimeout(() => {
        triggerHaptic();
        setModalMode("edit");
        longPressTimer.current = null;
      }, 500);
    }
  };

  const cancelLongPress = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const handleContextMenu = (e: MouseEvent) => {
    e.preventDefault();
    triggerHaptic();
    setModalMode("edit");
  };

  return (
    <>
      <Link to={`/todos?${new URLSearchParams({ list: list.id.toString() })}`} viewTransition>
        <ListItemButton
          selected={currentList.list?.id === list.id}
          key={list.id}
          onDoubleClick={() => setModalMode("edit")}
          onContextMenu={handleContextMenu}
          onTouchStart={startLongPress}
          onTouchEnd={cancelLongPress}
          onTouchMove={cancelLongPress}
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
