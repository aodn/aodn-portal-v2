import { FC, ReactNode, cloneElement, isValidElement } from "react";
import { IconButton, SxProps } from "@mui/material";
import StyledBadge, { Position } from "../common/badge/StyledBadge";
import { portalTheme } from "../../styles";
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
  const { isMobile, isUnderLaptop } = useBreakpoint();

  // Clone the custome icon element and add props
  const iconWithProps = isValidElement(icon)
    ? cloneElement(icon, { ...iconProps, ...icon.props })
    : icon;

  const defaultButtonSx: SxProps = {
    ...portalTheme.typography.body1Medium,
    fontSize: isMobile ? "12px" : isUnderLaptop ? "14px" : "16px",
    height: "42px",
    color: portalTheme.palette.primary1,
    backgroundColor: portalTheme.palette.primary6,
    borderRadius: "8px",
    "&:hover": {
      backgroundColor: portalTheme.palette.primary1,
      color: "#FFF",
      "&:hover": {
        backgroundColor: portalTheme.palette.primary1,
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
          gap: showText ? (isMobile ? "4px" : "12px") : 0,
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
