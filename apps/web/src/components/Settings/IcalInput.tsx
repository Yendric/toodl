import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box,
  FormControl,
  FormGroup,
  FormHelperText,
  IconButton,
  InputAdornment,
  OutlinedInput
} from "@mui/material";
import { type FC } from "react";
import { type FieldError } from "react-hook-form";

interface Props {
  value: string[] | undefined;
  onChange: (event: { target: { value: string[] } }) => void;
  error: FieldError[] | undefined;
}

const IcalInput: FC<Props> = ({ value, onChange, error }) => {
  function setIcals(icals: string[]) {
    onChange({ target: { value: icals } });
  }

  function addIcal() {
    if (value === undefined) return;
    setIcals([...value, ""]);
  }

  function deleteIcal(removeIndex: number) {
    if (value === undefined) return;
    setIcals(value.filter((_, index) => index != removeIndex));
  }

  function setIcal(editIndex: number, newValue: string) {
    if (value === undefined) return;
    setIcals(
      value.map((old, index) => {
        if (index === editIndex) {
          return newValue;
        } else {
          return old;
        }
      }),
    );
  }

  return (
    <Box sx={{ mb: 2, mt: -2 }}>
      <FormGroup>
        {value &&
          value.map((ical, index) => (
            <FormControl fullWidth key={index} sx={{ mb: 0.5 }}>
              <OutlinedInput
                sx={{ mr: 1 }}
                size="small"
                value={ical}
                onChange={(event) => setIcal(index, event.target.value)}
                error={error && !!error[index]}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton aria-label="Verwijder rij" edge="end" onClick={() => deleteIcal(index)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                }
              />
              {error && error[index] && (
                <FormHelperText color="red" error={true} component="p">
                  {error[index].message}
                </FormHelperText>
              )}
            </FormControl>
          ))}
      </FormGroup>
    </Box>
  );
};

export default IcalInput;
