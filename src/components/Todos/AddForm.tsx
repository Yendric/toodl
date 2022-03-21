import { FormEvent, useState, FC } from "react";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import MobileDateTimePicker from "@mui/lab/MobileDateTimePicker";
import { useTodo } from "../../context/TodoState";
import { useCurrentList } from "../../context/CurrentListState";

const AddForm: FC = () => {
  const [subject, setSubject] = useState("");
  const [startTime, setStartTime] = useState<Date>(new Date());
  const { create } = useTodo();
  const { currentList } = useCurrentList();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!subject) return;
    create({
      subject,
      startTime,
      done: false,
      listId: currentList?.id,
    });
    setSubject("");
    setStartTime(new Date());
  }

  return (
    <form onSubmit={handleSubmit}>
      <Grid container justifyContent="center">
        <MobileDateTimePicker
          renderInput={(props) => <TextField style={{ marginTop: "16px" }} {...props} variant="standard" />}
          disablePast
          value={startTime}
          onChange={(date) => setStartTime(date as Date)}
          inputFormat="dd/MM/yyyy HH:mm"
          cancelText="Annuleer"
          todayText="Vandaag"
        />
        <TextField
          variant="standard"
          value={subject}
          onChange={(e) => {
            setSubject(e.target.value);
          }}
          label="Todo..."
        />
        <Fab style={{ margin: "0 0 0 1rem" }} type="submit" color="primary" aria-label="add">
          <AddIcon />
        </Fab>
      </Grid>
    </form>
  );
};

export default AddForm;
