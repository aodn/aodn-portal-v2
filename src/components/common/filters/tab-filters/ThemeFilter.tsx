import React, { useEffect, useState, useCallback, FC } from "react";
import { Box, SxProps, Theme } from "@mui/material";
import { useSelector } from "react-redux";
import { Vocab } from "../../store/componentParamReducer";
import { useAppDispatch } from "../../store/hooks";
import { RootState } from "../../store/store";
import { fetchParameterVocabsWithStore } from "../../store/searchReducer";
import { StyledToggleButtonGroup } from "../../buttons/StyledToggleButtonGroup";
import { StyledToggleButton } from "../../buttons/StyledToggleButton";
import { TabFilterType } from "../Filters";

interface ThemeFilterProps extends TabFilterType {
  sx?: SxProps;
}

const ThemeFilter: FC<ThemeFilterProps> = ({ filter, setFilter, sx }) => {
  const dispatch = useAppDispatch();
  const [parameterVocabs, setParameterVocabs] = useState<Vocab[]>([]);
  const [buttonLabels, setButtonLabels] = useState<string[]>([]);

  // Get selected parameterVocabs from Redux store
  const selectedParameterVocabs = useSelector(
    (state: RootState) => state.paramReducer.parameterVocabs
  );

  // Initialize local state with selected parameterVocabs from Redux
  useEffect(() => {
    setFilter((prevFilter) => ({
      ...prevFilter,
      parameterVocabs: selectedParameterVocabs,
    }));
  }, [selectedParameterVocabs, setFilter]);

  // Update the local filter state using the setFilter
  const handleChange = useCallback(
    (_: React.MouseEvent<HTMLElement>, newAlignment: string[]) => {
      const selected: Vocab[] = parameterVocabs.filter((vocab) =>
        newAlignment.includes(vocab.label)
      );
      setFilter((prevFilter) => ({
        ...prevFilter,
        parameterVocabs: selected,
      }));
    },
    [parameterVocabs, setFilter]
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

        setParameterVocabs(secondLevelVocabs);
        setButtonLabels(secondLevelVocabs.map((vocab) => vocab.label));
      })
      .catch((error) =>
        console.error("Error fetching parameterVocabs:", error)
      );
  }, [dispatch]);

  return (
    <Box sx={{ ...sx }}>
      <StyledToggleButtonGroup
        value={filter.parameterVocabs?.map((vocab) => vocab.label) || []}
        onChange={handleChange}
        aria-label="parameter vocab selection"
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
