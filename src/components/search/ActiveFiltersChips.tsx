import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { Box, Chip, Typography, Button, Stack, useTheme } from "@mui/material";
import { useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../common/store/hooks";
import CloseIcon from "@mui/icons-material/Close";
import {
  clearComponentParam,
  SelectedStaticArea,
  updateDatasetGroup,
  updateDateTimeFilterRange,
  updateExcludeDocument,
  updateFilterPolygon,
  updateFilterStaticAreas,
  updateHasData,
  updateParameterVocabs,
  updatePlatform,
  updateStatus,
  updateUpdateFreq,
} from "../common/store/componentParamReducer";
import dayjs from "dayjs";
import { dateDefault, pageDefault, pageReferer } from "../common/constants";
import useRedirectSearch from "../../hooks/useRedirectSearch";
import { borderRadius, color } from "../../styles/constants";
import { TrashIcon } from "../../assets/icons/search/trash";
import {
  BoundaryName,
  BoundaryProperties,
  fetchAllenCoralAtlasOptions,
  fetchMarineEcoregionOptions,
  fetchMarineParkOptions,
} from "../map/mapbox/layers/StaticLayer";
import { DATA_SETTINGS } from "../filter/tab-filters/DataSettingsFilter";
import useElementSize from "../../hooks/useElementSize";

const ActiveFiltersChips: FC = () => {
  const dispatch = useAppDispatch();
  const redirectSearch = useRedirectSearch();
  const theme = useTheme();
  const params = useAppSelector((state) => state.paramReducer);
  const { pathname } = useLocation();
  const isSearchPage = pathname === pageDefault.search;

  const triggerRedirectIfOnSearchPage = useCallback(() => {
    if (isSearchPage) {
      redirectSearch(pageReferer.COMPONENT_COMPLEX_TEXT_REFERER);
    }
  }, [isSearchPage, redirectSearch]);

  const [marineEcoregion, setMarineEcoregion] = useState<BoundaryProperties[]>(
    []
  );
  const [marinePark, setMarinePark] = useState<BoundaryProperties[]>([]);
  const [allenCoralAtlas, setAllenCoralAtlas] = useState<BoundaryProperties[]>(
    []
  );

  useEffect(() => {
    // Cached value so will return fast
    fetchMarineEcoregionOptions().then(setMarineEcoregion);
    fetchMarineParkOptions().then(setMarinePark);
    fetchAllenCoralAtlasOptions().then(setAllenCoralAtlas);
  }, []);

  const handleClearAll = useCallback(() => {
    dispatch(clearComponentParam());
    triggerRedirectIfOnSearchPage();
  }, [dispatch, triggerRedirectIfOnSearchPage]);

  const activeFilters = useMemo(() => {
    const chips: Array<{ label: string; onDelete: () => void }> = [];

    // Date Range
    if (params.dateTimeFilterRange?.start || params.dateTimeFilterRange?.end) {
      const start = params.dateTimeFilterRange.start
        ? dayjs(params.dateTimeFilterRange.start).format(
            dateDefault.DISPLAY_FORMAT
          )
        : "...";
      const end = params.dateTimeFilterRange.end
        ? dayjs(params.dateTimeFilterRange.end).format(
            dateDefault.DISPLAY_FORMAT
          )
        : "...";
      chips.push({
        label: `Date: ${start} - ${end}`,
        onDelete: () => {
          dispatch(updateDateTimeFilterRange({}));
          triggerRedirectIfOnSearchPage();
        },
      });
    }

    // Location (Polygon)
    if (params.polygon) {
      chips.push({
        label: "Spatial Filter",
        onDelete: () => {
          dispatch(updateFilterPolygon(undefined));
          triggerRedirectIfOnSearchPage();
        },
      });
    }

    // Static Areas
    if (params.staticAreas && params.staticAreas.length > 0) {
      const getLabel = (area: SelectedStaticArea) => {
        switch (area.boundaryName) {
          case BoundaryName.MEOW:
            return (
              marineEcoregion.find(
                (opt) => String(opt.value) === String(area.value)
              )?.label || ""
            );
          case BoundaryName.AUSTRALIAN_MARINE_PARKS:
            return (
              marinePark.find((opt) => String(opt.value) === String(area.value))
                ?.label || ""
            );
          case BoundaryName.CORAL_ATLAS:
            return (
              allenCoralAtlas.find(
                (opt) => String(opt.value) === String(area.value)
              )?.label || ""
            );
        }
      };
      params.staticAreas.forEach((area) => {
        chips.push({
          label: `Area: ${getLabel(area)} (${area.boundaryName})`,
          onDelete: () => {
            dispatch(
              updateFilterStaticAreas(
                params.staticAreas!.filter(
                  (a) =>
                    a.boundaryName !== area.boundaryName ||
                    String(a.value) !== String(area.value)
                )
              )
            );
            triggerRedirectIfOnSearchPage();
          },
        });
      });
    }

    // Dataset Group
    if (params.datasetGroup) {
      chips.push({
        label: `Group: ${params.datasetGroup}`,
        onDelete: () => {
          dispatch(updateDatasetGroup(undefined));
          triggerRedirectIfOnSearchPage();
        },
      });
    }

    // Parameter Vocabs
    if (params.parameterVocabs && params.parameterVocabs.length > 0) {
      params.parameterVocabs.forEach((vocab) => {
        chips.push({
          label: vocab.label,
          onDelete: () => {
            dispatch(
              updateParameterVocabs(
                params.parameterVocabs!.filter((v) => v.label !== vocab.label)
              )
            );
            triggerRedirectIfOnSearchPage();
          },
        });
      });
    }

    // Platforms
    if (params.platform && params.platform.length > 0) {
      params.platform.forEach((p) => {
        chips.push({
          label: `Platform: ${p}`,
          onDelete: () => {
            dispatch(
              updatePlatform(params.platform!.filter((item) => item !== p))
            );
            triggerRedirectIfOnSearchPage();
          },
        });
      });
    }

    // Update Frequency
    if (params.updateFreq) {
      chips.push({
        label: `Delivery Mode: ${DATA_SETTINGS.dataDeliveryFrequency.find((f) => f.value === params.updateFreq)?.label || params.updateFreq}`,
        onDelete: () => {
          dispatch(updateUpdateFreq(undefined));
          triggerRedirectIfOnSearchPage();
        },
      });
    }

    // Status
    if (params.datasetStatus) {
      chips.push({
        label: `Status: ${DATA_SETTINGS.dataStatus.find((f) => f.value === params.datasetStatus)?.label || params.datasetStatus}`,
        onDelete: () => {
          dispatch(updateStatus(undefined));
          triggerRedirectIfOnSearchPage();
        },
      });
    }

    // Exclude document datasets
    if (params.excludeDocument) {
      chips.push({
        label: "Exclude Document",
        onDelete: () => {
          dispatch(updateExcludeDocument(false));
          triggerRedirectIfOnSearchPage();
        },
      });
    }

    // Downloadable datasets (hasCOData)
    if (params.hasCOData) {
      chips.push({
        label: "Downloadable datasets",
        onDelete: () => {
          dispatch(updateHasData(false));
          triggerRedirectIfOnSearchPage();
        },
      });
    }

    return chips;
  }, [
    params,
    dispatch,
    triggerRedirectIfOnSearchPage,
    marineEcoregion,
    marinePark,
    allenCoralAtlas,
  ]);

  const { ref: scrollRef, width: scrollWidth } = useElementSize();
  const [isScrollable, setIsScrollable] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Only enable drag-to-scroll affordance when the chips actually overflow.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) setIsScrollable(el.scrollWidth > el.clientWidth);
  }, [scrollRef, scrollWidth, activeFilters.length]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!isScrollable) return;
      setIsDragging(true);
      setStartX(e.pageX - e.currentTarget.getBoundingClientRect().left);
      setScrollLeft(e.currentTarget.scrollLeft);
    },
    [isScrollable]
  );

  const handleMouseLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.pageX - e.currentTarget.getBoundingClientRect().left;
      const walk = (x - startX) * 2; // Scroll speed
      e.currentTarget.scrollLeft = scrollLeft - walk;
    },
    [isDragging, startX, scrollLeft]
  );

  if (activeFilters.length === 0) return null;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        maxWidth: "100%",
        mt: 1,
        overflow: "hidden",
      }}
    >
      <Typography
        variant="body2"
        sx={{
          whiteSpace: "nowrap",
          mr: 1.5,
          color: color.gray.dark,
          display: { xs: "none", sm: "block" },
        }}
      >
        Added filters:
      </Typography>
      <Stack
        ref={scrollRef}
        direction="row"
        spacing={1}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        sx={{
          flex: 1,
          minWidth: 0,
          overflowX: "auto",
          py: 0.5,
          "&::-webkit-scrollbar": { display: "none" },
          msOverflowStyle: "none",
          scrollbarWidth: "none",
          cursor: isScrollable ? (isDragging ? "grabbing" : "grab") : "default",
          userSelect: "none", // Prevent text selection while dragging
          "& *": { cursor: isDragging ? "grabbing" : "inherit" },
        }}
      >
        {activeFilters.map((filter, index) => (
          <Chip
            key={`${filter.label}-${index}`}
            label={filter.label}
            onDelete={filter.onDelete}
            deleteIcon={<CloseIcon />}
            size="small"
            sx={{
              backgroundColor: theme.palette.primary5,
              borderRadius: borderRadius.small,
              "& .MuiChip-label": {
                color: theme.palette.text2,
              },
              "& .MuiChip-deleteIcon": {
                color: theme.palette.primary1,
                backgroundColor: "transparent",
                "&:hover": {
                  backgroundColor: "transparent",
                },
              },
            }}
          />
        ))}
      </Stack>
      <Button
        variant="text"
        size="small"
        onClick={handleClearAll}
        startIcon={<TrashIcon />}
        sx={{
          ml: 1,
          flexShrink: 0,
          whiteSpace: "nowrap",
          minWidth: "auto",
          textTransform: "none",
          color: theme.palette.primary1,
          "&:hover": { backgroundColor: "transparent", color: color.blue.dark },
        }}
        data-testid="clear-all-filters"
      >
        Clear all
      </Button>
    </Box>
  );
};

export default ActiveFiltersChips;
