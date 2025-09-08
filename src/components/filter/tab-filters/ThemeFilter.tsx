import React, { useEffect, useState, useCallback, FC } from "react";
import { Box, SxProps } from "@mui/material";
import {
  updateParameterVocabs,
  Vocab,
} from "../../common/store/componentParamReducer";
import { useAppDispatch } from "../../common/store/hooks";
import { fetchParameterVocabsWithStore } from "../../common/store/searchReducer";
import { StyledToggleButtonGroup } from "../../common/buttons/StyledToggleButtonGroup";
import { StyledToggleButton } from "../../common/buttons/StyledToggleButton";
import { TabFilterType } from "../Filters";
import rc8Theme from "../../../styles/themeRC8";

interface ThemeFilterProps extends TabFilterType {
  sx?: SxProps;
}

const ThemeFilter: FC<ThemeFilterProps> = ({ filters, setFilters, sx }) => {
  const dispatch = useAppDispatch();
  const [allVocabs, setAllVocabs] = useState<Vocab[]>([]);
  const [buttonLabels, setButtonLabels] = useState<string[]>([]);

  const handleChange = useCallback(
    (_: React.MouseEvent<HTMLElement>, newAlignment: string[]) => {
      const selected: Vocab[] = allVocabs.filter((vocab) =>
        newAlignment.includes(vocab.label)
      );
      setFilters((prevFilter) => ({
        ...prevFilter,
        parameterVocabs: selected,
      }));
      dispatch(updateParameterVocabs(selected));
    },
    [allVocabs, dispatch, setFilters]
  );

  useEffect(() => {
    dispatch(fetchParameterVocabsWithStore(null))
      .unwrap()
      .then((vocabs: Array<Vocab>) => {
        // Extract second level vocabs and remove duplicates
        const secondLevelVocabs = Array.from(
          new Set(
            vocabs
              .flatMap((rootVocab) => rootVocab.narrower || [])
              // Convert to string for Set deduplication
              .map((vocab) => JSON.stringify(vocab))
          )
        )
          // Convert back to object
          .map((vocabString) => JSON.parse(vocabString))
          // localeCompare() is better for handling of international characters eg. non-English text
          .sort((a, b) => a.label.localeCompare(b.label));

        setAllVocabs(secondLevelVocabs);
        setButtonLabels(secondLevelVocabs.map((vocab) => vocab.label));
      })
      .catch((error) =>
        console.error("Error fetching parameterVocabs:", error)
      );
  }, [dispatch]);

  return (
    <Box sx={{ ...sx }}>
      <StyledToggleButtonGroup
        value={filters.parameterVocabs?.map((vocab) => vocab.label) || []}
        onChange={handleChange}
        sx={{
          gap: "14px 12px",
          "& .MuiToggleButton-root": {
            borderRadius: "6px",
            textTransform: "capitalize",
            ...rc8Theme.typography.title2Regular,
            color: rc8Theme.palette.text1,
            bgcolor: rc8Theme.palette.primary6,
            px: "24px",
            py: "8px",
            "&:hover": {
              bgcolor: rc8Theme.palette.primary1,
              color: "#fff",
            },
            "&.Mui-selected": {
              border: "none",
              bgcolor: rc8Theme.palette.primary1,
              color: "#fff",
              "&:hover": {
                bgcolor: rc8Theme.palette.primary1,
              },
            },
          },
        }}
      >
        {buttonLabels.map((label) => (
          <StyledToggleButton value={label} key={label} aria-label={label}>
            {label}
          </StyledToggleButton>
        ))}
      </StyledToggleButtonGroup>
    </Box>
  );
};

export default ThemeFilter;
