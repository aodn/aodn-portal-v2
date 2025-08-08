import { styled, Tabs } from "@mui/material";
import rc8Theme from "../../../styles/themeRC8";

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
  backgroundColor: rc8Theme.palette.primary6,
  borderBottom: `1px solid ${rc8Theme.palette.grey600}`,
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
    borderBottom: `6px solid  ${rc8Theme.palette.primary2}`,
  },
});

export default StyledTabs;
