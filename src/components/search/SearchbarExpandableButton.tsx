import { FC, ReactNode, cloneElement, isValidElement } from "react";
import { IconButton, SxProps } from "@mui/material";
import StyledBadge, { Position } from "../common/badge/StyledBadge";
import rc8Theme from "../../styles/themeRC8";
import useBreakpoint from "../../hooks/useBreakpoint";

interface SearchbarExpandableButtonProps {
  icon: ReactNode;
  iconProps?: Record<string, any>;
  text: string;
  onClick?: () => void;
  showText?: boolean;
  badgeContent?: number;
  dotBadge?: boolean;
  buttonSx?: SxProps;
  containerSx?: SxProps;
  "data-testid"?: string | undefined;
}

const SearchbarExpandableButton: FC<SearchbarExpandableButtonProps> = ({
  icon,
  iconProps = {},
  text,
  onClick = () => {},
  badgeContent,
  dotBadge,
  showText,
  buttonSx,
  containerSx,
  "data-testid": testId,
}) => {
  const { isUnderLaptop } = useBreakpoint();

  // Clone the custome icon element and add props
  const iconWithProps = isValidElement(icon)
    ? cloneElement(icon, { ...iconProps, ...icon.props })
    : icon;

  const defaultButtonSx: SxProps = {
    ...rc8Theme.typography.body1Medium,
    fontSize: isUnderLaptop ? "14px" : "16px",
    height: "42px",
    color: rc8Theme.palette.primary1,
    mx: "1px",
    backgroundColor: rc8Theme.palette.primary6,
    borderRadius: "8px",
    "&:hover": {
      backgroundColor: rc8Theme.palette.primary1,
      color: "#FFF",
      "&:hover": {
        backgroundColor: rc8Theme.palette.primary1,
        color: "#FFF",
        "& svg path": { fill: "#FFF" },
      },
    },
  };

  return (
    <StyledBadge
      badgeContent={badgeContent}
      variant={dotBadge ? "dot" : "standard"}
      position={Position.TopRight}
      sx={{ padding: 0, ...containerSx }}
      data-testid={`searchbar-button-badge-${text}`}
    >
      <IconButton
        sx={{
          gap: showText ? "12px" : 0,
          ...defaultButtonSx,
          ...buttonSx,
        }}
        onClick={onClick}
        data-testid={testId}
      >
        {iconWithProps}
        {showText && text}
      </IconButton>
    </StyledBadge>
  );
};

export default SearchbarExpandableButton;
