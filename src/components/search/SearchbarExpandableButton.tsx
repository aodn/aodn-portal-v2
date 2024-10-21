import { FC, ReactNode } from "react";
import { Button, SxProps } from "@mui/material";
import StyledBadge, { Position } from "../common/badge/StyledBadge";
import {
  borderRadius,
  color,
  fontColor,
  gap,
  padding,
} from "../../styles/constants";

interface SearchbarExpandableButtonProps {
  icon: ReactNode;
  text: string;
  onClick?: () => void;
  showText?: boolean;
  badgeContent?: number;
  dotBadge?: boolean;
  buttonSx?: SxProps;
}

const defaultButtonSx: SxProps = {
  height: "100%",
  color: fontColor.blue.medium,
  minWidth: "38px",
  paddingX: padding.small,
  backgroundColor: color.blue.xLight,
  borderRadius: borderRadius.small,
  "&:hover": { backgroundColor: color.blue.light },
};

const SearchbarExpandableButton: FC<SearchbarExpandableButtonProps> = ({
  icon,
  text,
  onClick = () => {},
  badgeContent,
  dotBadge,
  showText = true,
  buttonSx,
}) => {
  return (
    <StyledBadge
      badgeContent={badgeContent}
      variant={dotBadge ? "dot" : "standard"}
      position={Position.TopRight}
    >
      <Button
        fullWidth
        sx={{
          "& .MuiButton-startIcon": {
            marginRight: showText ? gap.md : 0,
            marginLeft: 0,
          },
          ...defaultButtonSx,
          ...buttonSx,
        }}
        startIcon={icon}
        onClick={onClick}
      >
        {showText && text}
      </Button>
    </StyledBadge>
  );
};

export default SearchbarExpandableButton;
