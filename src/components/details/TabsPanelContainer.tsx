import { FC, Fragment, SyntheticEvent, useCallback, useState } from "react";
import { Card, CardContent, Divider, Paper, useTheme } from "@mui/material";
import { TabsList as BaseTabsList } from "@mui/base/TabsList";
import { Tab as BaseTab, tabClasses } from "@mui/base/Tab";
import { Tabs } from "@mui/base/Tabs";
import { styled } from "@mui/system";
import {
  borderRadius,
  color,
  fontWeight,
  padding,
} from "../../styles/constants";

interface Tab {
  label: string;
  value: string;
  component: JSX.Element;
}
interface TabsPanelProps {
  tabs: Tab[];
}
const CardWithTabsPanel: FC<TabsPanelProps> = ({ tabs }) => {
  const [currentTabIndex, setCurrentTabIndex] = useState<number>(0);
  const handleTabsChange = useCallback(
    (
      _: SyntheticEvent<Element, Event> | null,
      value: string | number | null
    ): void => {
      if (value === null || typeof value === "string") return;
      setCurrentTabIndex(value);
    },
    []
  );

  const theme = useTheme();
  return (
    <Card
      arial-label="container with tabs-panel"
      elevation={0}
      sx={{
        backgroundColor: "white",
        borderRadius: borderRadius.medium,
      }}
    >
      <Tabs onChange={handleTabsChange} value={currentTabIndex}>
        <TabsList arial-label="tabs-panel">
          {tabs.map((tab, idx) => (
            <Fragment key={idx}>
              <Tab key={idx} value={idx} sx={{ textTransform: "none" }}>
                {tab.label}
              </Tab>
              {idx !== tabs.length - 1 && (
                <Divider orientation="vertical" variant="middle" flexItem />
              )}
            </Fragment>
          ))}
        </TabsList>
      </Tabs>
      <Paper
        arial-label="container for tab content"
        elevation={3}
        sx={{
          borderRadius: `0 0 ${borderRadius.small} ${borderRadius.small}`,
        }}
      >
        <CardContent>{tabs[currentTabIndex].component}</CardContent>
      </Paper>
    </Card>
  );
};

export default CardWithTabsPanel;

const Tab = styled(BaseTab)(
  ({ theme }) => `
  font-family: ${theme.typography};
  color: #000;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: ${fontWeight.medium};
  letter-spacing: 1px;
  background-color: transparent;
  width: 100%;
  padding: 10px 12px;
  border: none;
  border-radius: ${borderRadius.small} ${borderRadius.small} 0 0;
  display: flex;
  justify-content: center;

  &:hover {
    background-color: ${theme.palette.secondary.light};
  }

  &.${tabClasses.selected} {
    background-color:${color.tabPanel.tabOnFocused};
    color: #fff;
  }
`
);

const TabsList = styled(BaseTabsList)(
  () => `
  background-color: ${color.tabPanel.background};
  border-radius:${borderRadius.small} ${borderRadius.small} 0 0 ;
  display: flex;
  align-items: center;
  justify-content: center;
  align-content: space-between;
  padding:${padding.extraSmall};
  padding-bottom: 0;
;
  `
);
