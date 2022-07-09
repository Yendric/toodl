import { ListItem, ListItemIcon, ListItemText } from "@mui/material";
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
          <CircleIcon sx={{ color: list.color }} />
        </ListItemIcon>
        <ListItemText primary={list.name} />
      </ListItem>
      <EditListModal visible={modalVisible} onDismissed={() => setModalVisible(false)} list={list} />
    </>
  );
};

export default SidebarItem;
