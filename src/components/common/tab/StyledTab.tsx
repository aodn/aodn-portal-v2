import { styled, Tab, TabProps } from "@mui/material";
import StyledBadge, { Position } from "../badge/StyledBadge";
import { portalTheme } from "../../../styles";

interface StyledTabProps extends TabProps {
  showBadge?: boolean;
  badgePosition?: Position;
  badgeColor?: string;
  isMobileText?: boolean;
}

const StyledTab = styled((props: StyledTabProps) => {
  const {
    showBadge = false,
    badgePosition = Position.TopRight,
    badgeColor = portalTheme.palette.secondary1,
    isMobileText = false,
    ...tabProps
  } = props;

  const isIconOnly = !!tabProps.icon && !tabProps.label;

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
          py: "10.5px",
          px: "22px",
          my: "20px",
          mx: "6px",
          ...(isIconOnly && {
            width: "39px",
            minWidth: "39px",
            maxWidth: "39px",
            height: "39px",
            minHeight: "39px",
            borderRadius: "50%",
            p: "9.5px",
          }),
          ...(isMobileText && {
            ...portalTheme.typography.body2Regular,
            fontSize: "14.4px",
            height: "39px",
            minHeight: "39px",
            py: "9.5px",
            px: "20px",
          }),
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
  "& .MuiTab-iconWrapper": {
    margin: 0,
  },
}));

export default StyledTab;
