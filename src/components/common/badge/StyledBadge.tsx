import { Badge } from "@mui/material";
import { styled } from "@mui/material/styles";
import { color as colors } from "../../../styles/constants";
import { ComponentProps } from "react";

export enum Position {
  TopRight = "topRight",
  Right = "right",
  Left = "left",
}

type PositionStyle = {
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
};

const badgePosition: Record<Position, PositionStyle> = {
  right: { top: "50%", right: " -10%" },
  topRight: { top: " 20%", right: " 10%" },
  left: { top: "50%", left: " -10%" },
};

interface StyledBadgeProps {
  position?: Position;
  badgeColor?: string;
}

// Create a wrapper to filter out unwanted props, so that it will not show
// React does not recognize the badgeColor prop on a DOM element. If you
// intentionally want it to appear in the DOM as a custom attribute,
// spell it as lowercase badgecolor instead.
const BadgeWrapper = ({
  badgeColor,
  position,
  ...props
}: StyledBadgeProps & ComponentProps<typeof Badge>) => <Badge {...props} />;

const StyledBadge = styled(BadgeWrapper)<StyledBadgeProps>(
  ({ sx, position = Position.Left, badgeColor = colors.brightBlue.dark }) => ({
    "& .MuiBadge-badge": {
      padding: "0 2px",
      border: `2px solid ${badgeColor}`,
      color: "white",
      backgroundColor: badgeColor,
      ...badgePosition[position],
      ...sx,
    },
  })
);

export default StyledBadge;
