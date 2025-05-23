import React, {
  Dispatch,
  FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Box, Fade, Paper, Popper, ClickAwayListener } from "@mui/material";
import InputWithSuggester from "./InputWithSuggester";
import { border, borderRadius, color, gap } from "../../styles/constants";
import SearchbarButtonGroup, {
  SearchbarButtonNames,
} from "./SearchbarButtonGroup";
import useRedirectSearch from "../../hooks/useRedirectSearch";
import useElementSize from "../../hooks/useElementSize";
import {
  POPUP_MIN_WIDTH_LAPTOP,
  POPUP_MIN_WIDTH_MOBILE,
  POPUP_MIN_WIDTH_TABLET,
} from "./constants";
import DateRangeFilter from "../filter/DateRangeFilter";
import { useLocation } from "react-router-dom";
import { pageDefault } from "../common/constants";
import LocationFilter from "../filter/LocationFilter";
import Filters from "../filter/Filters";
import useBreakpoint from "../../hooks/useBreakpoint";
import useScrollToElement from "../../hooks/useScrollToElement";
import { HEADER_HEIGHT } from "../layout/constant";
import {
  ParameterState,
  unFlattenToParameterState,
  updateDateTimeFilterRange,
  updateFilterPolygon,
  updateHasData,
  updateImosOnly,
  updateParameterStates,
  updateParameterVocabs,
  updatePlatform,
  updateSearchText,
  updateUpdateFreq,
} from "../common/store/componentParamReducer";
import { useAppDispatch } from "../common/store/hooks";

interface SearchbarProps {
  setShouldExpandSearchbar?: Dispatch<React.SetStateAction<boolean>>;
}

const Searchbar: FC<SearchbarProps> = ({ setShouldExpandSearchbar }) => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { isMobile, isTablet } = useBreakpoint();
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const [activeButton, setActiveButton] = useState<SearchbarButtonNames>(
    SearchbarButtonNames.Filter
  );
  const [shouldExpandAllButtons, setShouldExpandAllButtons] = useState<boolean>(
    location.pathname === pageDefault.landing
  );
  // set the default value false to allow user do search without typing anything
  const [pendingSearch, setPendingSearch] = useState<boolean>(false);
  const { ref, width: searchbarWidth } = useElementSize();
  const redirectSearch = useRedirectSearch();
  const { scrollToElement } = useScrollToElement({
    ref: boxRef,
    offset: HEADER_HEIGHT + 5,
  });
  const paramState: ParameterState | undefined = useMemo(() => {
    // The first char is ? in the search string, so we need to remove it.
    const param = location?.search.substring(1);
    console.log("substring location.search====", param);
    if (param && param.length > 0) {
      return unFlattenToParameterState(param);
    }
    return undefined;
  }, [location?.search]);

  const handleScrollToTop = useCallback(() => {
    scrollToElement();
  }, [scrollToElement]);

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
      handleScrollToTop();
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
    [handleScrollToTop, open, activeButton]
  );

  const handleClosePopup = useCallback(() => setOpen(false), [setOpen]);

  const handleClickAway = useCallback((event: MouseEvent | TouchEvent) => {
    // Check if the click target is part of the search bar or buttons
    if (boxRef.current?.contains(event.target as Node)) {
      return;
    }
    setOpen(false);
  }, []);

  useEffect(() => {
    if (paramState) {
      console.log("page====", location.pathname);
      console.log("paramState====", paramState);
      dispatch(updateParameterStates(paramState));
    } else {
      console.log("no paramState,clear all the filters====");
      // clear filters
      dispatch(updateParameterVocabs([]));
      dispatch(updateImosOnly(undefined));
      dispatch(updateHasData(undefined));
      dispatch(updatePlatform([]));
      dispatch(updateUpdateFreq(undefined));

      // clear date range filter
      dispatch(updateDateTimeFilterRange({}));

      // clear location filter
      dispatch(updateFilterPolygon(undefined));

      // clear search text
      dispatch(updateSearchText(""));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, paramState]);

  return (
    <Box width="100%" ref={boxRef}>
      <Paper
        id="searchbar-paper"
        ref={ref}
        elevation={0}
        sx={{
          display: "flex",
          flexDirection: {
            xs: location.pathname === pageDefault.search ? "row" : "column",
            sm: "row",
          },
          alignItems: "center",
          height: "100%",
          border: `${border.sm} ${color.blue.dark}`,
          borderRadius: borderRadius.small,
          backgroundColor: { xs: "transparent", sm: "#fff" },
          paddingY: gap.md,
        }}
      >
        <InputWithSuggester
          handleEnterPressed={handleEnterPressed}
          handleScrollToTop={handleScrollToTop}
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
          shouldShrinkAllButtons={
            isMobile && location.pathname === pageDefault.search
          }
          isPopupOpen={open}
          sx={{
            pr: gap.md,
            width:
              isMobile && location.pathname === pageDefault.landing
                ? "100%"
                : "auto",
          }}
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
                : isMobile
                  ? POPUP_MIN_WIDTH_MOBILE
                  : isTablet
                    ? POPUP_MIN_WIDTH_TABLET
                    : POPUP_MIN_WIDTH_LAPTOP,
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
                data-testid="searchbar-popup"
              >
                {activeButton === SearchbarButtonNames.Date && (
                  <DateRangeFilter handleClosePopup={handleClosePopup} />
                )}
                {activeButton === SearchbarButtonNames.Location && (
                  <LocationFilter handleClosePopup={handleClosePopup} />
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
