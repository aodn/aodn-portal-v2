import React, {
  Dispatch,
  FC,
  KeyboardEvent,
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
  POPUP_MIN_WIDTH_DESKTOP,
  POPUP_MIN_WIDTH_LAPTOP,
  POPUP_MIN_WIDTH_TABLET,
  POPUP_MIN_WIDTH_XL,
} from "./constants";
import DateRangeFilter from "../filter/DateRangeFilter";
import { useLocation } from "react-router-dom";
import { pageDefault, pageReferer } from "../common/constants";
import LocationFilter from "../filter/LocationFilter";
import Filters from "../filter/Filters";
import useBreakpoint from "../../hooks/useBreakpoint";
import useScrollToElement from "../../hooks/useScrollToElement";
import { HEADER_HEIGHT, HEADER_HEIGHT_MOBILE } from "../layout/constant";
import {
  clearComponentParam,
  ParameterState,
  unFlattenToParameterState,
  updateParameterStates,
  updateSearchText,
} from "../common/store/componentParamReducer";
import { useAppDispatch, useAppSelector } from "../common/store/hooks";
import ActiveFiltersChips from "./ActiveFiltersChips";

interface SearchbarProps {
  setShouldExpandSearchbar?: Dispatch<React.SetStateAction<boolean>>;
}

const Searchbar: FC<SearchbarProps> = ({ setShouldExpandSearchbar }) => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const searchInput = useAppSelector((state) => state.paramReducer.searchText);
  const { isMobile, isTablet } = useBreakpoint();
  const [open, setOpen] = useState(false);
  const [boxRef, setBoxRef] = useState<HTMLDivElement | null>(null);
  const [activeButton, setActiveButton] = useState<SearchbarButtonNames>(
    SearchbarButtonNames.Filter
  );
  const [shouldExpandAllButtons, setShouldExpandAllButtons] = useState<boolean>(
    location.pathname === pageDefault.landing
  );
  const [pendingSearch, setPendingSearch] = useState<boolean>(false);
  const { ref, width: searchbarWidth } = useElementSize();
  const redirectSearch = useRedirectSearch();
  const popperRef = useRef<any>(null);
  const params = useAppSelector((state) => state.paramReducer);
  const { scrollToElement } = useScrollToElement({
    ref: { current: boxRef },
    offset: (isMobile ? HEADER_HEIGHT_MOBILE : HEADER_HEIGHT) + 5,
  });

  const urlParamState: ParameterState | undefined = useMemo(() => {
    const param = location?.search?.substring(1);
    return param ? unFlattenToParameterState(param) : undefined;
  }, [location.search]);

  const boxRefCallback = useCallback((node: HTMLDivElement | null) => {
    if (node !== null) setBoxRef(node);
  }, []);

  const handleEnterPressed = useCallback(
    (
      event: KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>,
      isSearchbarFocused: boolean
    ) => {
      if (event.key === "Enter" && !isSearchbarFocused) {
        dispatch(updateSearchText(event.currentTarget.value));
        redirectSearch(pageReferer.COMPONENT_COMPLEX_TEXT_REFERER);
      }
    },
    [dispatch, redirectSearch]
  );

  const handleClickButton = useCallback(
    (button: SearchbarButtonNames) => {
      scrollToElement();
      if (open && button === activeButton) {
        setOpen(false);
      } else {
        setActiveButton(button);
        setOpen(true);
      }
    },
    [scrollToElement, open, activeButton]
  );

  const handleClosePopup = useCallback(() => setOpen(false), []);

  const handleClickAway = useCallback(
    (event: MouseEvent | TouchEvent) => {
      if (!boxRef?.contains(event.target as Node)) {
        setOpen(false);
      }
    },
    [boxRef]
  );

  // Sync URL to Redux on initial load/navigation
  useEffect(() => {
    if (urlParamState) {
      dispatch(updateParameterStates(urlParamState));
    } else if (location.pathname === pageDefault.landing) {
      // Only clear if we are explicitly on the landing page
      dispatch(clearComponentParam());
    }
  }, [dispatch, urlParamState, location.pathname]);

  useEffect(() => {
    if (open && popperRef.current) {
      popperRef.current.update();
    }
  }, [params, open]);

  return (
    <Box width="100%" ref={boxRefCallback}>
      <Paper
        id="searchbar-paper"
        ref={ref}
        elevation={0}
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          height: "100%",
          border: `${border.sm} ${color.blue.dark}`,
          borderRadius: borderRadius.small,
          backgroundColor: { xs: "transparent", sm: "#fff" },
          paddingY: "1px",
        }}
      >
        <InputWithSuggester
          handleEnterPressed={handleEnterPressed}
          handleScrollToTop={scrollToElement}
          setPendingSearch={setPendingSearch}
          setActiveButton={setActiveButton}
          setShouldExpandSearchbar={setShouldExpandSearchbar}
          setShouldExpandAllButtons={setShouldExpandAllButtons}
          suggesterWidth={searchbarWidth}
          containerRef={boxRef}
        />
        <SearchbarButtonGroup
          pendingSearch={pendingSearch}
          activeButton={activeButton}
          handleClickButton={handleClickButton}
          shouldExpandAllButtons={shouldExpandAllButtons}
          shouldShrinkAllButtons={isMobile}
          isPopupOpen={open}
          sx={{
            pr: gap.md,
            width: "auto",
          }}
        />
      </Paper>
      <ActiveFiltersChips />
      <ClickAwayListener onClickAway={handleClickAway}>
        <Popper
          popperRef={popperRef}
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
            width: searchbarWidth,
            borderRadius: borderRadius.small,
            zIndex: 99,
            ...(isMobile
              ? { minWidth: searchbarWidth }
              : isTablet
                ? { minWidth: POPUP_MIN_WIDTH_TABLET }
                : {}),
          }}
          sx={{
            ...(!isMobile &&
              !isTablet && {
                minWidth: {
                  md: `min(${POPUP_MIN_WIDTH_LAPTOP}px, calc(100vw - 32px))`,
                  lg: `min(${POPUP_MIN_WIDTH_DESKTOP}px, calc(100vw - 48px))`,
                  xl: `min(${POPUP_MIN_WIDTH_XL}px, calc(100vw - 64px))`,
                },
              }),
          }}
          open={open}
          anchorEl={boxRef}
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
                <Fade in={true} key={activeButton} timeout={200}>
                  <Box>
                    {activeButton === SearchbarButtonNames.Date && (
                      <DateRangeFilter />
                    )}
                    {activeButton === SearchbarButtonNames.Location && (
                      <LocationFilter handleClosePopup={handleClosePopup} />
                    )}
                    {activeButton === SearchbarButtonNames.Filter && (
                      <Filters handleClosePopup={handleClosePopup} />
                    )}
                  </Box>
                </Fade>
              </Paper>
            </Fade>
          )}
        </Popper>
      </ClickAwayListener>
    </Box>
  );
};

export default Searchbar;
