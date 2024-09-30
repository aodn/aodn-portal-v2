import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { padding } from "../../styles/constants";
import StyledTabs from "../common/tab/StyledTabs";
import StyledTab from "../common/tab/StyledTab";
import { useLocation } from "react-router-dom";
import { FC, SyntheticEvent, useEffect, useState } from "react";
import { TABS } from "../../pages/detail-page/subpages/ContentSection";
import { useDetailPageContext } from "../../pages/detail-page/context/detail-page-context";

export interface Tab {
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

const TabPanel = (props: TabPanelProps) => {
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
};

function a11yProps(index: number) {
  return {
    id: `tab-${index}`,
    "aria-controls": `tabpanel-${index}`,
  };
}

const TabsPanelContainer: FC<TabsPanelProps> = () => {
  const { isCollectionNotFound } = useDetailPageContext();
  // if no collection found, unfocus the tab
  useEffect(() => {
    if (isCollectionNotFound) {
      setValue(-1);
    }
  }, [isCollectionNotFound]);

  const location = useLocation();
  const pathname = location.pathname;

  const params = new URLSearchParams(location.search);
  const uuid = params.get("uuid");

  const [value, setValue] = useState(() => {
    const params = new URLSearchParams(location.search);

    const tabValue = params.get("tab");
    const index = TABS.findIndex((tab) => tab.value === tabValue);
    return index === -1 ? 0 : index;
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabValue = params.get("tab");
    const index = TABS.findIndex((tab) => tab.value === tabValue);
    if (index !== -1) {
      setValue(index);
    }
  }, [location]);

  const handleChange = (_: SyntheticEvent, newValue: number) => {
    setValue(newValue);
    // Update URL without navigating
    const newUrl = `${pathname}?uuid=${uuid}&tab=${TABS[newValue].value}`;
    window.history.pushState(null, "", newUrl);
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
        {TABS.map((tab, index) => (
          <StyledTab
            key={index}
            label={tab.label}
            {...a11yProps(index)}
            sx={{ textTransform: "none" }}
            disabled={isCollectionNotFound}
          />
        ))}
      </StyledTabs>
      {TABS.map((tab, index) => (
        <TabPanel key={index} value={value} index={index}>
          {tab.component}
        </TabPanel>
      ))}
    </Box>
  );
};

export default TabsPanelContainer;
