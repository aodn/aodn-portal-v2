import {
  Dispatch,
  FC,
  SyntheticEvent,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Box, Button, Typography } from "@mui/material";
import { OGCCollection } from "../common/store/OGCCollectionDefinitions";
import StyledAccordion from "../common/accordion/StyledAccordion";
import StyledAccordionSummary from "../common/accordion/StyledAccordionSummary";
import { color, fontColor, fontSize, fontWeight } from "../../styles/constants";
import StyledAccordionDetails from "../common/accordion/StyledAccordionDetails";
import BookmarkListCard from "./BookmarkListCard";
import BookmarkButton from "./BookmarkButton";
import { useBookmarkList } from "../../hooks/useBookmarkList";
import { BookmarkContext } from "../../pages/search-page/subpages/MapSection";
import { useSelector } from "react-redux";
import {
  selectBookmarkItems,
  selectTemporaryItem,
} from "../common/store/bookmarkListReducer";

interface BookmarkListAccordionGroupProps {
  setSelectedUuids: Dispatch<React.SetStateAction<string[]>>;
}

const BookmarkListAccordionGroup: FC<BookmarkListAccordionGroupProps> = ({
  setSelectedUuids,
}) => {
  const {
    items,
    temporaryItem,
    expandedItem,
    setExpandedItem,
    insertItem,
    removeItem,
  } = useBookmarkList();
  // const bookmarkFunctions = useContext(BookmarkContext);
  // console.log("in accordion group, bookmarkFunctions", bookmarkFunctions);

  // State to store accordion group list
  const [accordionGroupItems, setAccordionGroupItems] = useState<
    Array<OGCCollection>
  >([]);
  console.log("accordionGroupItems", accordionGroupItems);
  // State to store the mouse hover status
  const [hoverOnButton, setHoverOnButton] = useState<boolean>(false);

  const handleChange = useCallback(
    (item: OGCCollection, hoverOnRemoveButton: boolean) =>
      (_: SyntheticEvent, newExpanded: boolean) => {
        if (hoverOnRemoveButton) return;
        setExpandedItem(newExpanded ? item : undefined);
        setSelectedUuids(newExpanded ? [item.id] : []);
      },
    [setExpandedItem, setSelectedUuids]
  );

  const handleRemove = useCallback(
    (item: OGCCollection) => {
      setExpandedItem(expandedItem?.id === item.id ? undefined : expandedItem);
      removeItem(item.id);
    },
    [expandedItem, removeItem, setExpandedItem]
  );

  useEffect(() => {
    setAccordionGroupItems(() => {
      console.log("setAccordionGroupItems");
      if (items) {
        const existingIds = new Set(items.map((item) => item.id));

        if (temporaryItem) {
          if (!existingIds.has(temporaryItem.id)) {
            return [temporaryItem, ...items];
          }
          return [...items];
        }
        return [...items];
      } else if (temporaryItem) {
        return [temporaryItem];
      }
      return [];
    });
  }, [items, temporaryItem]);

  return (
    <>
      {accordionGroupItems.map((item) => (
        <StyledAccordion
          key={item.id}
          expanded={expandedItem?.id === item.id}
          onChange={handleChange(item, hoverOnButton)}
        >
          <StyledAccordionSummary>
            <Box
              display="flex"
              flexDirection="row"
              justifyContent="space-between"
              flexWrap="nowrap"
              alignItems="center"
              width="100%"
            >
              <Box
                onMouseEnter={() => setHoverOnButton(true)}
                onMouseLeave={() => setHoverOnButton(false)}
              >
                <BookmarkButton
                  dataset={item}
                  onClickBookmark={() => insertItem(item)}
                />
              </Box>

              <Typography
                color={fontColor.gray.dark}
                fontSize={fontSize.label}
                fontWeight={fontWeight.bold}
                sx={{
                  padding: 0,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: "2",
                  WebkitBoxOrient: "vertical",
                }}
              >
                {item.title}
              </Typography>
              <Button
                sx={{
                  minWidth: "15px",
                  maxWidth: "15px",
                  color: color.gray.dark,
                  fontSize: fontSize.icon,
                  fontWeight: fontWeight.bold,
                  " &:hover": {
                    color: color.blue.dark,
                    fontSize: fontSize.info,
                  },
                }}
                onClick={() => handleRemove(item)}
                onMouseEnter={() => setHoverOnButton(true)}
                onMouseLeave={() => setHoverOnButton(false)}
              >
                X
              </Button>
            </Box>
          </StyledAccordionSummary>
          <StyledAccordionDetails>
            <BookmarkListCard collection={item} />
          </StyledAccordionDetails>
        </StyledAccordion>
      ))}
    </>
  );
};

export default BookmarkListAccordionGroup;
