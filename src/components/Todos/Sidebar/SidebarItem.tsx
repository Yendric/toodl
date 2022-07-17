import { ListItem, ListItemIcon, ListItemText, Typography } from "@mui/material";
import { FC, MouseEvent, useState } from "react";
import CircleIcon from "@mui/icons-material/Circle";
import IList from "../../../types/IList";
import { useCurrentList } from "../../../context/CurrentListState";
import EditListModal from "./EditListModal";

type Props = {
  list: IList;
};

const SidebarItem: FC<Props> = ({ list }) => {
  const currentList = useCurrentList();
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <>
      <ListItem
        selected={currentList.list?.id === list.id}
        button
        key={list.id}
        onClick={() => currentList.setList(list)}
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
                marginTop: "0.15em",
              }}
            >
              {list.name.charAt(0)}
            </Typography>
          </div>
        </ListItemIcon>
        <ListItemText primary={list.name} />
      </ListItem>
      <EditListModal visible={modalVisible} onDismissed={() => setModalVisible(false)} list={list} />
    </>
  );
};

export default SidebarItem;
