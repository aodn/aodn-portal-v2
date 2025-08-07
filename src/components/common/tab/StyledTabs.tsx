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
  borderBottom: `1px solid ${rc8Theme.palette.grey600}`,
  "& .MuiTabs-indicator": {
    display: "flex",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  "& .MuiTabs-indicatorSpan": {
    position: "absolute",
    bottom: "0",
    width: 0,
    height: 0,
    borderLeft: "5px solid transparent",
    borderRight: "5px solid transparent",
    borderBottom: `5px solid  ${rc8Theme.palette.primary2}`,
  },
});

export default StyledTabs;
