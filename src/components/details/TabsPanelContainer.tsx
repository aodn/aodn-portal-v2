import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import {
  border,
  borderRadius,
  color,
  fontColor,
  fontWeight,
  margin,
  padding,
} from "../../styles/constants";
import { styled } from "@mui/material";

interface Tab {
  label: string;
  value: string;
  component: JSX.Element;
}

interface TabsPanelProps {
  tabs: Tab[];
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: padding.large }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `tab-${index}`,
    "aria-controls": `tabpanel-${index}`,
  };
}

const TabsPanelContainer: React.FC<TabsPanelProps> = ({ tabs }) => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box
      sx={{
        bgcolor: "#fff",
      }}
    >
      <StyledTabs
        value={value}
        onChange={handleChange}
        aria-label="tabsPanelContainer"
      >
        {tabs.map((tab, index) => (
          <StyledTab
            key={index}
            label={tab.label}
            {...a11yProps(index)}
            sx={{ textTransform: "none" }}
          />
        ))}
      </StyledTabs>
      {tabs.map((tab, index) => (
        <TabPanel key={index} value={value} index={index}>
          {tab.component}
        </TabPanel>
      ))}
    </Box>
  );
};

export default TabsPanelContainer;

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
    width: 0,
    height: 0,
    borderLeft: "5px solid transparent",
    borderRight: "5px solid transparent",
    borderBottom: `5px solid  ${color.tabPanel.divider}`,
  },
});

interface StyledTabProps {
  label: string;
}

const StyledTab = styled((props: StyledTabProps) => (
  <Tab
    disableRipple
    {...props}
    sx={{ margin: `${margin.xxlg} ${margin.lg}` }}
  />
))(({ theme }) => ({
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
