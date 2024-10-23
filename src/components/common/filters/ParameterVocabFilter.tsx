import React, {
  useEffect,
  useState,
  useCallback,
  FC,
  Dispatch,
  SetStateAction,
} from "react";
import { Box, SxProps, Theme } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { fetchParameterVocabsWithStore } from "../store/searchReducer";
import { Vocab, ParameterState } from "../store/componentParamReducer";
import { StyledToggleButton } from "../buttons/StyledToggleButton";
import { StyledToggleButtonGroup } from "../buttons/StyledToggleButtonGroup";
import { useAppDispatch } from "../store/hooks";

interface ParameterVocabFilterProps {
  filter: ParameterState;
  setFilter: Dispatch<SetStateAction<ParameterState>>;
  sx?: SxProps<Theme>;
}

const ParameterVocabFilter: FC<ParameterVocabFilterProps> = ({
  filter,
  setFilter,
  sx,
}) => {
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
              .map((vocab) => JSON.stringify(vocab)) // Convert to string for Set deduplication
          )
        )
          .map((vocabString) => JSON.parse(vocabString)) // Convert back to object
          .sort((a, b) => a.label.localeCompare(b.label)); // localeCompare() is better for handling of international characters eg. non-English text

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

export default ParameterVocabFilter;
