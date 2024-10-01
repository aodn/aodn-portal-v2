import { styled, Tab, TabProps } from "@mui/material";
import {
  border,
  borderRadius,
  color,
  fontColor,
  fontWeight,
  margin,
} from "../../../styles/constants";

const StyledTab = styled((props: TabProps) => (
  <Tab
    disableRipple
    {...props}
    sx={{ margin: `${margin.xxlg} ${margin.lg}` }}
  />
))(() => ({
  textTransform: "none",
  fontWeight: fontWeight.regular,
  color: fontColor.gray.dark,
  border: `${border.xs}  ${color.tabPanel.tabOnFocused}`,
  borderRadius: borderRadius.xxlg,
  "&.Mui-selected": {
    color: "#fff",
    backgroundColor: color.tabPanel.tabOnFocused,
  },
  " &:hover": {
    backgroundColor: color.tabPanel.tabOnHover,
    color: "#fff",
  },
}));

export default StyledTab;
