import { styled } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import {
  border,
  color,
  fontColor,
  fontFamily,
  fontSize,
  fontWeight,
  padding,
} from "../../../styles/constants";

const PlainDatePicker = styled(DatePicker)(() => ({
  border: `${border.sm} ${color.blue.darkSemiTransparent}`,
  borderRadius: "4px",
  backgroundColor: "#fff",
  width: "100%",
  "& fieldset": {
    border: "none",
  },
  "& input": {
    fontSize: fontSize.info,
    fontFamily: fontFamily.general,
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
