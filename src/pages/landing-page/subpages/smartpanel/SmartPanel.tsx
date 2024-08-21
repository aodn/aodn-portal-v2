import { FC, useCallback, useRef } from "react";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import Box from "@mui/material/Box";
import { IconButton } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { color, gap } from "../../../../styles/constants";
import {
  DEFAULT_CARD_SIZE,
  DEFAULT_GAP,
  ITEM_DATA,
  SCROLL_DISTANCE,
  SMART_PANEL_HEIGHT,
  SMART_PANEL_WIDTH,
} from "./constants";
import { getItemCols, getItemRows } from "./utils";
import { LargeCard, MediumCard, SmallCard } from "./SmartCard";

const SmartPanel: FC = () => {
  const boxRef = useRef<HTMLDivElement>(null);
  const scroll = useCallback(
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
      <IconButton
        onClick={() => scroll(-SCROLL_DISTANCE)}
        sx={{
          backgroundColor: color.white.oneTenTransparent,
        }}
      >
        <ArrowBackIosNewIcon
          sx={{
            pr: gap.sm,
            height: 20,
            width: 20,
            color: "#fff",
          }}
        />
      </IconButton>
      <Box
        ref={boxRef}
        sx={{
          width: SMART_PANEL_WIDTH,
          height: SMART_PANEL_HEIGHT,
          overflow: "hidden",
        }}
      >
        <ImageList
          sx={{
            width: "fit-content",
            height: SMART_PANEL_HEIGHT,
            m: 0,
            p: 0,
            "&::-webkit-scrollbar": {
              display: "none",
            },
            "-ms-overflow-style": "none",
            "scrollbar-width": "none",
          }}
          variant="quilted"
          cols={18}
          rowHeight={DEFAULT_CARD_SIZE - DEFAULT_GAP}
          gap={DEFAULT_GAP}
        >
          {ITEM_DATA.map((item) => (
            <ImageListItem
              key={item.title}
              cols={getItemCols(item.type)}
              rows={getItemRows(item.type)}
              sx={{
                width: `${getItemCols(item.type) * DEFAULT_CARD_SIZE - DEFAULT_GAP}px`,
              }}
            >
              {item.type === "small" && (
                <SmallCard title={item.title} icon={item.icon} />
              )}
              {item.type === "medium" && (
                <MediumCard title={item.title} image={item.image} />
              )}
              {item.type === "large" && (
                <LargeCard
                  title={item.title}
                  image={item.image}
                  additionalInfo={item.additionalInfo}
                />
              )}
            </ImageListItem>
          ))}
        </ImageList>
      </Box>
      <IconButton
        onClick={() => scroll(SCROLL_DISTANCE)}
        sx={{ backgroundColor: color.white.oneTenTransparent }}
      >
        <ArrowForwardIosIcon
          sx={{ pl: gap.sm, height: 20, width: 20, color: "#fff" }}
        />
      </IconButton>
    </Box>
  );
};

export default SmartPanel;
