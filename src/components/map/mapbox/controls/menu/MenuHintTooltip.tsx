import React, { useRef, useState } from "react";
import { Box, Popper, Typography } from "@mui/material";
import { portalTheme } from "../../../../../styles";

interface MenuHintTooltipProps {
  hint: string;
  // If the associated menu is currently open then the hint is disabled. The tooltip will only show when the menu is closed.
  disable: boolean;
  children: React.ReactElement;
}

const MenuHintTooltip: React.FC<MenuHintTooltipProps> = ({
  hint,
  disable,
  children,
}) => {
  const [hovered, setHovered] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <Box
        ref={wrapperRef}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {children}
      </Box>
      <Popper
        open={hovered && !disable}
        anchorEl={wrapperRef.current}
        placement="left"
        disablePortal
        modifiers={[{ name: "offset", options: { offset: [0, 10] } }]}
      >
        <Box
          sx={{
            backgroundColor: portalTheme.palette.primary6,
            color: portalTheme.palette.primary2,
            padding: "2px 10px",
            borderRadius: "6px",
          }}
        >
          <Typography
            sx={{
              ...portalTheme.typography.body2Regular,
              padding: 0,
              textWrap: "nowrap",
            }}
          >
            {hint}
          </Typography>
        </Box>
      </Popper>
    </>
  );
};

export default MenuHintTooltip;
