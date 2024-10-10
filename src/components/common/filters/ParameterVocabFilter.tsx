import React, {
  useEffect,
  useState,
  useCallback,
  FC,
  Dispatch,
  SetStateAction,
} from "react";
import { Grid, SxProps, Theme } from "@mui/material";
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
      const selected: Vocab[] = parameterVocabs.filter((c) =>
        newAlignment.includes(c.label)
      );
      setFilter((prevFilter) => ({
        ...prevFilter,
        parameterVocabs: selected,
      }));
    },
    [parameterVocabs, setFilter]
  );

  // Remove all items whose label is already in the labels array
  useEffect(() => {
    const labels = [...new Set(parameterVocabs.map((c) => c.label))];
    setButtonLabels(labels);
  }, [parameterVocabs]);

  useEffect(() => {
    dispatch(fetchParameterVocabsWithStore(null))
      .unwrap()
      .then((vocabs: Array<Vocab>) => {
        // we only want second level of vocabs
        const secondLevelVocabs = vocabs
          .flatMap((rootVocab) => rootVocab.narrower)
          .filter((vocab) => vocab !== undefined)
          .sort((a, b) => (a.label < b.label ? -1 : a.label > b.label ? 1 : 0));

        setParameterVocabs(secondLevelVocabs);
      })
      .catch((error) =>
        console.error("Error fetching parameterVocabs:", error)
      );
  }, [dispatch]);

  return (
    <Grid container sx={{ ...sx }}>
      <Grid item xs={12}>
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
      </Grid>
    </Grid>
  );
};

export default ParameterVocabFilter;
