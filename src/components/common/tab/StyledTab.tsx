import { styled, Tab, TabProps } from "@mui/material";
import {
  border,
  borderRadius,
  color,
  fontColor,
  fontWeight,
  margin,
} from "../../../styles/constants";
import StyledBadge, { Position } from "../badge/StyledBadge";

interface StyledTabProps extends TabProps {
  showBadge?: boolean;
  badgePosition?: Position;
  badgeColor?: string;
}

const StyledTab = styled((props: StyledTabProps) => {
  const {
    showBadge = false,
    badgePosition = Position.TopRight,
    badgeColor = color.brightBlue.dark,
    ...tabProps
  } = props;

  return (
    <StyledBadge
      variant="dot"
      position={badgePosition}
      badgeColor={badgeColor}
      invisible={!showBadge}
    >
      <Tab {...tabProps} sx={{ margin: `${margin.xlg} ${margin.lg}` }} />
    </StyledBadge>
  );
})(() => ({
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

export default StyledTab;
