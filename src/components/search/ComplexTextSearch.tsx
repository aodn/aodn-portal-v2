import React, {
  Dispatch,
  FC,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Box, Button, Fade, Paper, Popper, Typography } from "@mui/material";
import AdvanceFilters from "../common/filters/AdvanceFilters";
import InputWithSuggester from "./InputWithSuggester";
import { border, borderRadius, color, padding } from "../../styles/constants";
import SearchbarButtonGroup, {
  SearchbarButtonNames,
} from "./SearchbarButtonGroup";
import useRedirectSearch from "../../hooks/useRedirectSearch";
import useElementSize from "../../hooks/useElementSize";
import FilterSection from "../common/filters/FilterSection";
import {
  ParameterState,
  updateDateTimeFilterRange,
  updateImosOnly,
  updateParameterVocabs,
  updateUpdateFreq,
} from "../common/store/componentParamReducer";
import store, { getComponentState } from "../common/store/store";
import { useAppDispatch } from "../common/store/hooks";
import { POPUP_MIN_WIDTH } from "./constants";
import DateRange from "../common/filters/DateRange";
import { useLocation } from "react-router-dom";
import { pageDefault } from "../common/constants";

interface ComplexTextSearchProps {
  setShouldExpandSearchbar?: Dispatch<React.SetStateAction<boolean>>;
}

const ComplexTextSearch: FC<ComplexTextSearchProps> = ({
  setShouldExpandSearchbar,
}) => {
  const location = useLocation();

  const dispatch = useAppDispatch();

  const [open, setOpen] = useState(false);

  const boxRef = useRef<HTMLDivElement>(null);

  const [activeButton, setActiveButton] = useState<SearchbarButtonNames>(
    SearchbarButtonNames.Filter
  );

  const [shouldExpandAllButtons, setShouldExpandAllButtons] = useState<boolean>(
    location.pathname === pageDefault.landing
  );

  const componentParam = getComponentState(store.getState());
  // State used to store the provisional filter options selected,
  // only dispatch to redux when 'apply' button is hit
  const [filter, setFilter] = useState<ParameterState>(componentParam);

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

  // TODO: always need to clear the filter on close if not hit 'apply'
  const handleClosePopup = useCallback(() => setOpen(false), [setOpen]);

  // TODO: implement DataDeliveryModeFilter and DepthFilter when backend supports this query
  const handleApplyFilter = useCallback(
    (filter: ParameterState) => {
      // Must use await so that it happen one by one, otherwise the update will be messed
      if (filter.dateTimeFilterRange) {
        dispatch(updateDateTimeFilterRange(filter.dateTimeFilterRange));
      } else {
        dispatch(updateDateTimeFilterRange({}));
      }
      if (filter.parameterVocabs) {
        dispatch(updateParameterVocabs(filter.parameterVocabs));
      } else {
        dispatch(updateParameterVocabs([]));
      }
      if (filter.isImosOnlyDataset) {
        dispatch(updateImosOnly(filter.isImosOnlyDataset));
      } else {
        dispatch(updateImosOnly(false));
      }
      if (filter.updateFreq) {
        dispatch(updateUpdateFreq(filter.updateFreq));
      } else {
        dispatch(updateUpdateFreq(undefined));
      }
      setFilter({});
    },
    [dispatch]
  );

  useEffect(() => {
    if (componentParam) {
      setFilter(componentParam);
    }
  }, [componentParam, setFilter]);

  return (
    <Box width="100%" ref={boxRef}>
      <Paper
        ref={ref}
        elevation={0}
        sx={{
          display: "flex",
          alignItems: "center",
          height: "100%",
          border: `${border.xs} ${color.gray.extraLight}`,
          borderRadius: borderRadius.small,
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
        />
      </Paper>
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
          width: searchbarWidth,
          minWidth: POPUP_MIN_WIDTH,
          borderRadius: borderRadius.small,
          zIndex: 99,
        }}
        open={open}
        anchorEl={boxRef.current}
        placement="bottom-end"
        transition
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={200}>
            <Paper
              elevation={1}
              sx={{
                borderRadius: borderRadius.small,
                bgcolor: color.blue.xLight,
              }}
            >
              {activeButton === SearchbarButtonNames.Date && (
                <DateRange
                  filter={filter}
                  setFilter={setFilter}
                  handleApplyFilter={handleApplyFilter}
                />
              )}
              {activeButton === SearchbarButtonNames.Area && (
                <Box>
                  <FilterSection
                    title="Area"
                    toolTip="Filter by area"
                    isTitleOnlyHeader
                  >
                    <Typography>Location Placeholder</Typography>
                  </FilterSection>
                </Box>
              )}
              {activeButton === SearchbarButtonNames.Filter && (
                <AdvanceFilters
                  handleCloseFilter={handleClosePopup}
                  filter={filter}
                  setFilter={setFilter}
                  handleApplyFilter={handleApplyFilter}
                />
              )}
            </Paper>
          </Fade>
        )}
      </Popper>
    </Box>
  );
};

export default ComplexTextSearch;
