import React, {
  useEffect,
  useState,
  useCallback,
  FC,
  Dispatch,
  SetStateAction,
} from "react";
import { Grid, SxProps, Theme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { fetchParameterVocabsWithStore } from "../store/searchReducer";
import { Vocab, ParameterState } from "../store/componentParamReducer";
import { StyledToggleButton } from "../buttons/StyledToggleButton";
import { StyledToggleButtonGroup } from "../buttons/StyledToggleButtonGroup";

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
  const dispatch = useDispatch<AppDispatch>();
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
        // TODO: needs to fix somewhere around here to adapt with the new response from OGC API for list of parameter vocabs
        // the JSON response structure is similar but not exactly the same in the past
        console.log(vocabs);
        // If the item does not have broader terms, that means it is the root level
        const root = vocabs.filter((i) => i.broader?.length === 0);

        // Now we need to go one level lower as this is a requirement to display second level instead of top level
        let child = new Array<Vocab>();
        root
          .filter((i) => i?.narrower?.length !== 0)
          .forEach((i) => i?.narrower?.forEach((j) => child.push(j)));

        // Now sort by child
        child = child.sort((a, b) =>
          a.label < b.label ? -1 : a.label > b.label ? 1 : 0
        );

        setParameterVocabs(child);
      })
      .catch((error) =>
        console.error("Error fetching parameterVocabs:", error)
      );
  }, [dispatch]);

  return (
    <Grid container sx={sx}>
      <Grid item xs={12}>
        <StyledToggleButtonGroup
          value={filter.parameterVocabs?.map((c) => c.label) || []}
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
