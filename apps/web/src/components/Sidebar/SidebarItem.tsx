import CircleIcon from "@mui/icons-material/Circle";
import { ListItemButton, ListItemIcon, ListItemText, Typography } from "@mui/material";
import { useState, type FC, type MouseEvent } from "react";
import { Link } from "react-router-dom";
import type { ListResponse } from "../../api/generated/model";
import { useCurrentList } from "../../context/CurrentListState";
import EditListModal from "./EditListModal";

type Props = {
  list: ListResponse;
};

const SidebarItem: FC<Props> = ({ list }) => {
  const currentList = useCurrentList();
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <Link to={`/todos?${new URLSearchParams({ list: list.id.toString() })}`}>
        <ListItemButton
          selected={currentList.list?.id === list.id}
          key={list.id}
          onDoubleClick={() => setModalVisible(true)}
          onContextMenu={(e: MouseEvent) => {
            e.preventDefault();
            setModalVisible(true);
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
      <EditListModal visible={modalVisible} onDismissed={() => setModalVisible(false)} list={list} />
    </>
  );
};

export default SidebarItem;
