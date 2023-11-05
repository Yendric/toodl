import CircleIcon from "@mui/icons-material/Circle";
import { ListItem, ListItemIcon, ListItemText, Typography } from "@mui/material";
import { FC, MouseEvent, useState } from "react";
import { Link } from "react-router-dom";
import { useCurrentList } from "../../../context/CurrentListState";
import { LocalList } from "../../../types/List";
import EditListModal from "./EditListModal";

type Props = {
  list: LocalList;
};

const SidebarItem: FC<Props> = ({ list }) => {
  const currentList = useCurrentList();
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <Link to={`?${new URLSearchParams({ list: list.id.toString() })}`}>
        <ListItem
          selected={currentList.list?.id === list.id}
          button
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
        </ListItem>
      </Link>
      <EditListModal visible={modalVisible} onDismissed={() => setModalVisible(false)} list={list} />
    </>
  );
};

export default SidebarItem;
