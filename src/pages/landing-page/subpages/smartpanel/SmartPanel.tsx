import { FC, useCallback, useMemo, useRef } from "react";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import Box from "@mui/material/Box";
import { IconButton } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { color, gap } from "../../../../styles/constants";
import {
  SMART_PANEL_CARD_SIZE,
  SMART_PANEL_GAP,
  ITEM_DATA,
  ItemType,
  SCROLL_DISTANCE,
  SMART_PANEL_HEIGHT,
  SMART_PANEL_WIDTH,
} from "./constants";
import {
  calculateImageListWidth,
  calculateTotalCols,
  getItemCols,
  getItemRows,
} from "./utils";
import SmallCard from "./components/SmallCard";
import MediumCard from "./components/MediumCard";
import LargeCard from "./components/LargeCard";

const SmartPanel: FC = () => {
  const boxRef = useRef<HTMLDivElement>(null);

  const imageListTotalCols = useMemo(() => calculateTotalCols(ITEM_DATA), []);
  const imageListWidth = useMemo(() => calculateImageListWidth(ITEM_DATA), []);

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
      <IconButton
        onClick={() => handleScroll(-SCROLL_DISTANCE)}
        sx={{
          backgroundColor: color.white.twoTenTransparent,
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
            width: imageListWidth,
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
          cols={imageListTotalCols}
          rowHeight={SMART_PANEL_CARD_SIZE}
          gap={SMART_PANEL_GAP}
        >
          {ITEM_DATA.map((item) => (
            <ImageListItem
              key={item.title}
              cols={getItemCols(item.type)}
              rows={getItemRows(item.type)}
              sx={{
                width:
                  item.type === ItemType.Small
                    ? SMART_PANEL_CARD_SIZE
                    : getItemCols(item.type) * SMART_PANEL_CARD_SIZE +
                      SMART_PANEL_GAP,
              }}
            >
              {item.type === "small" && <SmallCard cardData={item} />}
              {item.type === "medium" && <MediumCard cardData={item} />}
              {item.type === "large" && <LargeCard cardData={item} />}
            </ImageListItem>
          ))}
        </ImageList>
      </Box>
      <IconButton
        onClick={() => handleScroll(SCROLL_DISTANCE)}
        sx={{ backgroundColor: color.white.twoTenTransparent }}
      >
        <ArrowForwardIosIcon
          sx={{ pl: gap.sm, height: 20, width: 20, color: "#fff" }}
        />
      </IconButton>
    </Box>
  );
};

export default SmartPanel;