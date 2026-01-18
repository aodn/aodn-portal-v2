import { styled, Tabs } from "@mui/material";
import { portalTheme } from "../../../styles";

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
  borderBottom: `1px solid ${portalTheme.palette.grey600}`,
  "& .MuiTabs-indicator": {
    display: "flex",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  "& .MuiTabs-indicatorSpan": {
    position: "absolute",
    bottom: "0",
    width: "12px",
    height: "6px",
    borderLeft: "6px solid transparent",
    borderRight: "6px solid transparent",
    borderBottom: `6px solid  ${portalTheme.palette.primary2}`,
  },
});

export default StyledTabs;
