import { FC, useCallback, useRef } from "react";
import Box from "@mui/material/Box";
import { IconButton, Stack } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { color, gap, padding } from "../../../../styles/constants";
import {
  SMART_CARDS,
  SMART_PANEL_GAP,
  SMART_PANEL_HEIGHT,
  SMART_PANEL_CONTAINER_WIDTH_DESKTOP,
  SMART_PANEL_CONTAINER_WIDTH_LAPTOP,
  SMART_PANEL_CONTAINER_WIDTH_MOBILE,
  SMART_PANEL_CONTAINER_WIDTH_TABLET,
  SMART_PANEL_WIDTH,
  SCROLL_BUTTON_SIZE,
} from "./constants";
import SmartCard from "./SmartCard";
import useBreakpoint from "../../../../hooks/useBreakpoint";

interface SmartPanelProps {
  handleClickSmartCard: (value: string) => void;
}

const SmartPanel: FC<SmartPanelProps> = ({ handleClickSmartCard }) => {
  const { isAboveDesktop } = useBreakpoint();
  const boxRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(
    (scrollOffset: number) => {
      if (boxRef && boxRef.current) {
        boxRef.current.scrollTo({
          left: boxRef.current.scrollLeft + scrollOffset,
          behavior: "smooth",
        });
      }
    },
    [boxRef]
  );
  return (
    <Box display="flex" justifyContent="space-between" alignItems="center">
      {!isAboveDesktop && (
        <Box sx={{ pr: { sm: padding.small } }}>
          <IconButton onClick={() => handleScroll(-SMART_PANEL_WIDTH / 3)}>
            <ArrowBackIosNewIcon
              sx={{
                pr: gap.sm,
                height: SCROLL_BUTTON_SIZE,
                width: SCROLL_BUTTON_SIZE,
                color: color.gray.dark,
              }}
            />
          </IconButton>
        </Box>
      )}
      <Box
        ref={boxRef}
        sx={{
          width: {
            xs: SMART_PANEL_CONTAINER_WIDTH_MOBILE,
            sm: SMART_PANEL_CONTAINER_WIDTH_TABLET,
            md: SMART_PANEL_CONTAINER_WIDTH_LAPTOP,
            lg: SMART_PANEL_CONTAINER_WIDTH_DESKTOP,
          },
          height: SMART_PANEL_HEIGHT,
          "&::-webkit-scrollbar": {
            display: "none",
          },
          "-ms-overflow-style": "none",
          "scrollbar-width": "none",
          overflow: "hidden",
          overflowX: "scroll",
        }}
      >
        <Stack
          direction="row"
          flexWrap="wrap"
          gap={`${SMART_PANEL_GAP}px`}
          width={SMART_PANEL_WIDTH + 2}
        >
          {SMART_CARDS.map((item) => (
            <SmartCard
              key={item.title}
              cardData={item}
              handleClickSmartCard={handleClickSmartCard}
            />
          ))}
        </Stack>
      </Box>
      {!isAboveDesktop && (
        <Box sx={{ pl: { sm: padding.small } }}>
          <IconButton onClick={() => handleScroll(SMART_PANEL_WIDTH / 3)}>
            <ArrowForwardIosIcon
              sx={{
                pl: gap.sm,
                height: SCROLL_BUTTON_SIZE,
                width: SCROLL_BUTTON_SIZE,
                color: color.gray.dark,
              }}
            />
          </IconButton>
        </Box>
      )}
    </Box>
  );
};

export default SmartPanel;
