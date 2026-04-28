import { styled, Tab, TabProps } from "@mui/material";
import StyledBadge, { Position } from "../badge/StyledBadge";
import { portalTheme } from "../../../styles";

interface StyledTabProps extends TabProps {
  showBadge?: boolean;
  badgePosition?: Position;
  badgeColor?: string;
}

const StyledTab = styled((props: StyledTabProps) => {
  const {
    showBadge = false,
    badgePosition = Position.TopRight,
    badgeColor = portalTheme.palette.secondary1,
    ...tabProps
  } = props;

  return (
    <StyledBadge
      variant="dot"
      position={badgePosition}
      badgeColor={badgeColor}
      invisible={!showBadge}
    >
      <Tab
        {...tabProps}
        sx={{
          ...portalTheme.typography.title1Medium,
          py: 0,
          px: "24px",
          my: "20px",
          mx: "6px",
        }}
      />
    </StyledBadge>
  );
})(({ theme }) => ({
  textTransform: "none",
  color: theme.palette.text1,
  border: `1px solid  ${theme.palette.primary2}`,
  borderRadius: "40px",
  "&.Mui-selected": {
    color: "#fff",
    backgroundColor: theme.palette.primary2,
  },
  " &:hover": {
    backgroundColor: theme.palette.primary2,
    color: "#fff",
  },
}));

export default StyledTab;
