import React, {
  FC,
  SyntheticEvent,
  useCallback,
  useEffect,
  useState,
} from "react";
import Box from "@mui/material/Box";
import { padding } from "../../../styles/constants";
import StyledTabs from "./StyledTabs";
import StyledTab from "./StyledTab";
import { SxProps } from "@mui/system";
import useBreakpoint from "../../../hooks/useBreakpoint";

export interface Tab {
  label: string;
  value: string;
  component: React.ReactNode;
  showBadge?: boolean;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface TabsPanelContainerProps {
  tabs: Tab[];
  tabValue?: number;
  handleTabChange?: (newValue: number) => void;
  sx?: SxProps;
}
/**
 * DO NOT unmount children here, we need to keep child status
 */
const TabPanel = ({ children, value, index, ...other }: TabPanelProps) => {
  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      sx={{ p: padding.medium }}
      {...other}
    >
      {children}
    </Box>
  );
};

const a11yProps = (index: number) => ({
  id: `tab-${index}`,
  "aria-controls": `tabpanel-${index}`,
});

const TabsPanelContainer: FC<TabsPanelContainerProps> = ({
  tabs,
  tabValue = undefined,
  handleTabChange,
  sx,
}) => {
  const { isAboveDesktop } = useBreakpoint();
  const [value, setValue] = useState(tabValue ?? 0);

  const handleChange = useCallback(
    (_: SyntheticEvent, newValue: number) => {
      setValue(newValue);
      handleTabChange?.(newValue);
    },
    [handleTabChange]
  );

  useEffect(() => {
    if (tabValue) setValue(tabValue);
  }, [tabValue]);

  if (!tabs?.length) return;

  return (
    <Box
      sx={{
        ...sx,
      }}
    >
      <StyledTabs
        value={value}
        onChange={handleChange}
        aria-label="tabsPanelContainer"
        data-testid="tabs-panel-container"
        sx={{ px: isAboveDesktop ? "10px" : "8px" }}
      >
        {tabs.map((tab, index) => (
          <StyledTab
            key={index}
            label={tab.label}
            {...a11yProps(index)}
            sx={{ textTransform: "none" }}
            showBadge={tab.showBadge}
          />
        ))}
      </StyledTabs>
      {tabs.map((tab, index) => (
        <TabPanel
          key={index}
          value={value}
          index={index}
          data-testid={`tab-panel-${tab.label}`}
        >
          {tab.component}
        </TabPanel>
      ))}
    </Box>
  );
};

export default TabsPanelContainer;
