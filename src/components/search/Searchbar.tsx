import React, { Dispatch, FC, useCallback, useRef, useState } from "react";
import { Box, Fade, Paper, Popper, ClickAwayListener } from "@mui/material";
import InputWithSuggester from "./InputWithSuggester";
import { border, borderRadius, color, gap } from "../../styles/constants";
import SearchbarButtonGroup, {
  SearchbarButtonNames,
} from "./SearchbarButtonGroup";
import useRedirectSearch from "../../hooks/useRedirectSearch";
import useElementSize from "../../hooks/useElementSize";
import { POPUP_MIN_WIDTH } from "./constants";
import DateRangeFilter from "../filter/DateRangeFilter";
import { useLocation } from "react-router-dom";
import { pageDefault } from "../common/constants";
import LocationFilter from "../filter/LocationFilter";
import Filters from "../filter/Filters";

interface SearchbarProps {
  setShouldExpandSearchbar?: Dispatch<React.SetStateAction<boolean>>;
}

const Searchbar: FC<SearchbarProps> = ({ setShouldExpandSearchbar }) => {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const [activeButton, setActiveButton] = useState<SearchbarButtonNames>(
    SearchbarButtonNames.Filter
  );
  const [shouldExpandAllButtons, setShouldExpandAllButtons] = useState<boolean>(
    location.pathname === pageDefault.landing
  );
  // set the default value to false to allow user do search without typing anything
  const [pendingSearch, setPendingSearch] = useState<boolean>(false);
  const { ref, width: searchbarWidth } = useElementSize();
  const redirectSearch = useRedirectSearch();

  const handleEnterPressed = useCallback(
    (
      event: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>,
      isSearchbarFocused: boolean
    ) => {
      // TODO: a more user-friendly way to execute 'enter' press function is to delay the search to wait for pendingSearch turn to true
      // instead of prevent user doing search if pendingSearch is false
      // considering the debounce (300ms) and fetchSuggesterOptions(quite fast according to experience with edge) is not very long
      // we may implement this later if gap is too big
      if (event.key === "Enter" && !isSearchbarFocused && !pendingSearch) {
        redirectSearch("ComplexTextSearch");
      }
    },
    [pendingSearch, redirectSearch]
  );

  const handleClickButton = useCallback(
    (button: SearchbarButtonNames) => {
      if (open) {
        // If clicking the same button that's currently active, just close the popup
        if (button === activeButton) {
          setOpen(false);
          return;
        }

        // If switching to a different button, close then reopen
        setOpen(false);
        setTimeout(() => {
          setOpen(true);
          setActiveButton(button);
        }, 200);
      } else {
        // If popup is closed, simply open it
        setOpen(true);
        setActiveButton(button);
      }
    },
    [open, activeButton]
  );

  const handleClosePopup = useCallback(() => setOpen(false), [setOpen]);

  const handleClickAway = useCallback((event: MouseEvent | TouchEvent) => {
    // Check if the click target is part of the search bar or buttons
    if (boxRef.current?.contains(event.target as Node)) {
      return;
    }
    setOpen(false);
  }, []);

  return (
    <Box width="100%" ref={boxRef}>
      <Paper
        ref={ref}
        elevation={0}
        sx={{
          display: "flex",
          alignItems: "center",
          height: "100%",
          border:
            location.pathname === pageDefault.search
              ? `${border.sm} ${color.brightBlue.semiTransparentDark}`
              : "none",
          borderRadius: borderRadius.small,
          paddingY: gap.md,
        }}
      >
        <InputWithSuggester
          handleEnterPressed={handleEnterPressed}
          setPendingSearch={setPendingSearch}
          setActiveButton={setActiveButton}
          setShouldExpandSearchbar={setShouldExpandSearchbar}
          setShouldExpandAllButtons={setShouldExpandAllButtons}
          suggesterWidth={searchbarWidth}
        />
        <SearchbarButtonGroup
          pendingSearch={pendingSearch}
          activeButton={activeButton}
          handleClickButton={handleClickButton}
          shouldExpandAllButtons={shouldExpandAllButtons}
          sx={{ pr: gap.md }}
        />
      </Paper>
      <ClickAwayListener onClickAway={handleClickAway}>
        <Popper
          modifiers={[
            {
              name: "offset",
              options: {
                offset: [0, 4],
              },
            },
            {
              name: "flip",
              enabled: false,
            },
          ]}
          style={{
            width:
              activeButton === SearchbarButtonNames.Location
                ? "300px"
                : searchbarWidth,
            minWidth:
              activeButton === SearchbarButtonNames.Location
                ? 0
                : POPUP_MIN_WIDTH,
            borderRadius: borderRadius.small,
            zIndex: 99,
          }}
          open={open}
          anchorEl={boxRef.current}
          placement="bottom-end"
          disablePortal
          transition
        >
          {({ TransitionProps }) => (
            <Fade {...TransitionProps} timeout={200}>
              <Paper
                elevation={location.pathname === pageDefault.search ? 2 : 1}
                sx={{
                  borderRadius: borderRadius.small,
                  bgcolor: "#fff",
                }}
              >
                {activeButton === SearchbarButtonNames.Date && (
                  <DateRangeFilter handleClosePopup={handleClosePopup} />
                )}
                {activeButton === SearchbarButtonNames.Location && (
                  <LocationFilter />
                )}
                {activeButton === SearchbarButtonNames.Filter && (
                  <Filters handleClosePopup={handleClosePopup} />
                )}
              </Paper>
            </Fade>
          )}
        </Popper>
      </ClickAwayListener>
    </Box>
  );
};

export default Searchbar;