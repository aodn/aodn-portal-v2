import React, { FC, SyntheticEvent, useCallback, useState } from "react";
import Box from "@mui/material/Box";
import { padding } from "@/styles/constants";
import StyledTabs from "@/components/common/tab/StyledTabs";
import StyledTab from "@/components/common/tab/StyledTab";
import { SxProps } from "@mui/system";
import useBreakpoint from "@/hooks/useBreakpoint";

export interface Tab {
  label: string;
  value: string;
  component: React.ReactNode;
  showBadge?: boolean;
  icon?: React.ReactNode;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
  mounted: boolean;
}

interface TabsPanelContainerProps {
  tabs: Tab[];
  tabValue?: number;
  handleTabChange?: (newValue: number) => void;
  sx?: SxProps;
  lazyMount?: boolean;
}
/**
 * Once mounted, keep children alive while hidden to preserve their state.
 * Lazy panels skip their first mount until selected, including direct links.
 */
const TabPanel: FC<TabPanelProps> = ({
  children,
  value,
  index,
  mounted,
  ...other
}) => {
  return (
    <Box
      role="tabpanel"
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      hidden={value !== index}
      sx={{
        p: padding.medium,
      }}
      {...other}
    >
      {mounted ? children : null}
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
  lazyMount = false,
}) => {
  const { isAboveDesktop, isMobile } = useBreakpoint();
  const [selectedValue, setSelectedValue] = useState(
    tabs[tabValue ?? 0]?.value
  );
  const [visitedValues, setVisitedValues] = useState(
    () => new Set([tabs[tabValue ?? 0]?.value])
  );
  const value =
    tabValue ??
    Math.max(
      0,
      tabs.findIndex((tab) => tab.value === selectedValue)
    );

  const handleChange = useCallback(
    (_: SyntheticEvent, newValue: number) => {
      setSelectedValue(tabs[newValue].value);
      setVisitedValues((visited) => new Set(visited).add(tabs[newValue].value));
      handleTabChange?.(newValue);
    },
    [handleTabChange, tabs]
  );

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
        {tabs.map((tab, index) => {
          const isSelected = index === value;
          const showIconOnly = isMobile && !isSelected && !!tab.icon;
          return (
            <StyledTab
              key={tab.value}
              label={showIconOnly ? undefined : tab.label}
              icon={showIconOnly ? (tab.icon as React.ReactElement) : undefined}
              aria-label={showIconOnly ? tab.label : undefined}
              {...a11yProps(index)}
              sx={{ textTransform: "none" }}
              showBadge={tab.showBadge}
              isMobileText={isMobile && !showIconOnly}
            />
          );
        })}
      </StyledTabs>
      <Box sx={sx}>
        {tabs.map((tab, index) => (
          <TabPanel
            key={tab.value}
            value={value}
            index={index}
            mounted={
              !lazyMount || value === index || visitedValues.has(tab.value)
            }
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
