import { FC, ReactNode } from "react";
import { Button, SxProps } from "@mui/material";
import StyledBadge, { Position } from "../common/badge/StyledBadge";
import {
  borderRadius,
  color,
  fontColor,
  fontSize,
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
  containerSx?: SxProps;

  "data-testid"?: string | undefined;
}

const defaultButtonSx: SxProps = {
  height: "100%",
  minHeight: "38px",
  width: "100%",
  minWidth: "38px",
  color: fontColor.blue.medium,
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
  showText,
  buttonSx,
  containerSx,
  "data-testid": testId,
}) => {
  return (
    <StyledBadge
      badgeContent={badgeContent}
      variant={dotBadge ? "dot" : "standard"}
      position={Position.TopRight}
      sx={{ padding: 0, ...containerSx }}
    >
      <Button
        fullWidth
        sx={{
          "& .MuiButton-startIcon": {
            marginRight: showText ? gap.md : 0,
            marginLeft: 0,
          },
          fontSize: fontSize.info,
          ...defaultButtonSx,
          ...buttonSx,
        }}
        startIcon={icon}
        onClick={onClick}
        data-testid={testId}
      >
        {showText && text}
      </Button>
    </StyledBadge>
  );
};

export default SearchbarExpandableButton;
