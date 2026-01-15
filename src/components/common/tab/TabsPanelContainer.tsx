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
 * DO NOT unmount children here, we need to keep child status, the way we do it is use zIndex instead of hidden
 * the reason if one of the component contains map, when it is visible, map renders again and causes unnecessary
 * api call. Use zIndex to hide it at back avoid this issue.
 */
const TabPanel = ({ children, value, index, ...other }: TabPanelProps) => {
  return (
    <Box
      role="tabpanel"
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      sx={{
        p: padding.medium,
        position: "absolute",
        zIndex: value === index ? 1 : -1,
        pointerEvents: value === index ? "auto" : "none",
      }}
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
    <>
      <StyledTabs
        value={value}
        onChange={handleChange}
        aria-label="tabsPanelContainer"
        data-testid="tabs-panel-container"
        sx={{ ...sx, px: isAboveDesktop ? "10px" : "8px" }}
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
      <Box
        sx={{
          ...sx,
          position: "relative",
          flex: 1,
          minHeight: "70vh",
        }}
      >
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
    </>
  );
};

export default TabsPanelContainer;
