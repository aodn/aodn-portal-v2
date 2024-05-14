import { styled } from "@mui/system";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

import { margin } from "./constants";

const StyledDateTimePicker = styled(DateTimePicker)(({ theme }) => ({
  borderRadius: "4px",
  backgroundColor: "#fff",
  margin: `${margin["nil"]} ${margin["doubleLeft"]}`,
  "& fieldset": {
    border: "none",
  },
  boxShadow: "2px 2px 4px 0px rgba(0, 0, 0, 0.15)",
  fontSize: "18px",
  display: "flex",

  "& input": {
    padding: "2px",
    textAlign: "center",
  },
  "& .MuiInputBase-root": {
    padding: "8px 16px",
  },
}));

export default StyledDateTimePicker;
