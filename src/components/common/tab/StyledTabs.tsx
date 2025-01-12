import { styled, Tabs } from "@mui/material";
import { border, color, padding } from "../../../styles/constants";

interface StyledTabsProps {
  children?: React.ReactNode;
  value: number;
  onChange: (event: React.SyntheticEvent, newValue: number) => void;
}

const StyledTabs = styled((props: StyledTabsProps) => (
  <Tabs
    {...props}
    orientation="horizontal"
    variant="scrollable"
    scrollButtons="auto"
    TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
  />
))({
  borderBottom: `${border.xs} ${color.tabPanel.divider}`,
  "& .MuiTabs-indicator": {
    display: "flex",
    justifyContent: "center",
    backgroundColor: "transparent",
    height: "5px",
    paddingTop: padding.medium,
  },
  "& .MuiTabs-indicatorSpan": {
    position: "absolute",
    bottom: "0",
    width: 0,
    height: 0,
    borderLeft: "5px solid transparent",
    borderRight: "5px solid transparent",
    borderBottom: `5px solid  ${color.tabPanel.divider}`,
  },
});

export default StyledTabs;
