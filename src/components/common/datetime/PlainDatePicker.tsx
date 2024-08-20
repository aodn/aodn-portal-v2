import { styled } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import {
  fontColor,
  fontSize,
  fontWeight,
  padding,
} from "../../../styles/constants";

const PlainDatePicker = styled(DatePicker)(() => ({
  borderRadius: "4px",
  boxShadow: "2px 2px 4px 0px rgba(0, 0, 0, 0.15)",
  backgroundColor: "#fff",
  width: "100%",
  "& fieldset": {
    border: "none",
  },
  "& input": {
    fontSize: fontSize.label,
    color: fontColor.gray.dark,
    fontWeight: fontWeight.regular,
    padding: 0,
    textAlign: "center",
  },
  "& .MuiInputBase-root": {
    padding: `${padding.extraSmall} ${padding.small}`,
  },
  "& .MuiInputAdornment-root": {
    margin: 0,
  },
}));

export default PlainDatePicker;
