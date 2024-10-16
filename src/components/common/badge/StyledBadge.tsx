import { Badge, BadgeProps, styled, SxProps } from "@mui/material";
import { fontColor } from "../../../styles/constants";

export enum Position {
  topRight = "topRight",
  right = "right",
  left = "left",
}

type PositionStyle = {
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
};

const badgePosition: Record<Position, PositionStyle> = {
  right: { top: "50%", right: " -10%" },
  topRight: { top: " 15%", right: " 10%" },
  left: { top: " 50px", left: " -10%" },
};

interface StyledBadgeProps {
  sx?: SxProps;
  position?: Position;
  color?: string;
}

const StyledBadge = styled(Badge)<StyledBadgeProps>(
  ({ sx, position = Position.left, color = fontColor.blue.dark }) => ({
    "& .MuiBadge-badge": {
      padding: "0 4px",
      border: `2px solid ${color}`,
      color: "white",
      backgroundColor: color,
      ...badgePosition[position],
      ...sx,
    },
  })
);

export default StyledBadge;
