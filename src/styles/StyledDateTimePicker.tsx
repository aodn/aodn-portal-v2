import { styled } from "@mui/system";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { Dayjs } from "dayjs";
import { fontColor, fontWeight, margin, padding } from "./constants";

const StyledDateTimePicker = styled(DateTimePicker<Dayjs>)(({ theme }) => ({
  borderRadius: "4px",
  backgroundColor: "#fff",
  "& fieldset": {
    border: "none",
  },
  boxShadow: "2px 2px 4px 0px rgba(0, 0, 0, 0.15)",
  "& input": {
    fontSize: "12px",
    color: `${fontColor.gray.dark}`,
    fontWeight: `${fontWeight.regular}`,
    padding: 0,
    textAlign: "center",
  },
  "& .MuiInputBase-root": {
    padding: "6px 10px 6px 0px",
  },
  "& .MuiInputAdornment-root": {
    margin: 0,
  },
}));

export default StyledDateTimePicker;
