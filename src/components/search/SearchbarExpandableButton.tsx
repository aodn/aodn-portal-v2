import { FC, ReactNode } from "react";
import { Button, SxProps, Typography } from "@mui/material";
import StyledBadge, { Position } from "../common/badge/StyledBadge";
import {
  borderRadius,
  color,
  fontColor,
  gap,
  padding,
} from "../../styles/constants";
import rc8Theme from "../../styles/themeRC8";

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
      data-testid={`searchbar-button-badge-${text}`}
    >
      <Button
        sx={{
          borderRadius: "8px",
          bcolor: rc8Theme.palette.primary6,
          "& .MuiButton-startIcon": {
            marginRight: showText ? gap.md : 0,
            marginLeft: 0,
            py: "2px",
          },
          ...defaultButtonSx,
          ...buttonSx,
        }}
        startIcon={icon}
        onClick={onClick}
        data-testid={testId}
      >
        <Typography
          variant="title1Medium"
          color={rc8Theme.palette.primary1}
          sx={{ ml: "10px" }}
        >
          {showText && text}
        </Typography>
      </Button>
    </StyledBadge>
  );
};

export default SearchbarExpandableButton;
