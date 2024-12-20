import { Badge } from "@mui/material";
import { styled } from "@mui/material/styles";
import { color as colors } from "../../../styles/constants";

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
  left: { top: " 50px", left: " -10%" },
};

interface StyledBadgeProps {
  position?: Position;
  badgeColor?: string;
}

const StyledBadge = styled(Badge)<StyledBadgeProps>(
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
