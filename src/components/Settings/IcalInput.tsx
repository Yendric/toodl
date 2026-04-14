import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box,
  FormControl,
  FormGroup,
  FormHelperText,
  IconButton,
  InputAdornment,
  OutlinedInput,
  Button,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { type FC } from "react";

interface Props {
  value: string[] | undefined;
  onChange: (value: string[]) => void;
  errors?: string[];
}

const IcalInput: FC<Props> = ({ value = [], onChange, errors }) => {
  function addIcal() {
    onChange([...value, ""]);
  }

  function deleteIcal(removeIndex: number) {
    onChange(value.filter((_, index) => index !== removeIndex));
  }

  function setIcal(editIndex: number, newValue: string) {
    onChange(value.map((old, index) => (index === editIndex ? newValue : old)));
  }

  return (
    <Box sx={{ mb: 2 }}>
      <FormGroup>
        {value.map((ical, index) => (
          <FormControl fullWidth key={index} sx={{ mb: 1 }}>
            <OutlinedInput
              size="small"
              placeholder="https://example.com/calendar.ics"
              value={ical}
              onChange={(event) => setIcal(index, event.target.value)}
              error={!!errors?.[index]}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton aria-label="Verwijder rij" edge="end" onClick={() => deleteIcal(index)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              }
            />
            {errors?.[index] && <FormHelperText error={true}>{errors[index]}</FormHelperText>}
          </FormControl>
        ))}
      </FormGroup>
      <Button startIcon={<AddIcon />} onClick={addIcal} size="small" variant="outlined" sx={{ mt: 1 }}>
        iCal toevoegen
      </Button>
    </Box>
  );
};

export default IcalInput;
