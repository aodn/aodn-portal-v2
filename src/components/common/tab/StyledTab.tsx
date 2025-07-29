import { styled, Tab, TabProps } from "@mui/material";
import StyledBadge, { Position } from "../badge/StyledBadge";
import rc8Theme from "../../../styles/themeRC8";

interface StyledTabProps extends TabProps {
  showBadge?: boolean;
  badgePosition?: Position;
  badgeColor?: string;
}

const StyledTab = styled((props: StyledTabProps) => {
  const {
    showBadge = false,
    badgePosition = Position.TopRight,
    badgeColor = rc8Theme.palette.secondary1,
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
          ...rc8Theme.typography.title1Medium,
          py: 0,
          px: "24px",
          my: "20px",
          mx: "6px",
        }}
      />
    </StyledBadge>
  );
})(() => ({
  textTransform: "none",
  color: rc8Theme.palette.text1,
  border: `1px solid  ${rc8Theme.palette.primary2}`,
  borderRadius: "40px",
  "&.Mui-selected": {
    color: "#fff",
    backgroundColor: rc8Theme.palette.primary2,
  },
  " &:hover": {
    backgroundColor: rc8Theme.palette.primary2,
    color: "#fff",
  },
}));

export default StyledTab;
