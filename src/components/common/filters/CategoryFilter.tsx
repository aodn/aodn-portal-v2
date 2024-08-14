import React, { useEffect, useState, useCallback } from "react";
import { Grid, SxProps, Theme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { fetchParameterCategoriesWithStore } from "../store/searchReducer";
import { Category, ParameterState } from "../store/componentParamReducer";
import { StyledToggleButton } from "../../../styles/StyledToggleButton";
import { StyledToggleButtonGroup } from "../../../styles/StyledToggleButtonGroup";

interface CategoryVocabFilterProps {
  filter: ParameterState;
  setFilter: React.Dispatch<React.SetStateAction<ParameterState>>;
  sx?: SxProps<Theme>;
}

const CategoryFilter: React.FC<CategoryVocabFilterProps> = ({
  filter,
  setFilter,
  sx,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [categories, setCategories] = useState<Category[]>([]);
  const [buttonLabels, setButtonLabels] = useState<string[]>([]);

  // Get selected categories from Redux store
  const selectedCategories = useSelector(
    (state: RootState) => state.paramReducer.categories
  );

  // Initialize local state with selected categories from Redux
  useEffect(() => {
    setFilter((prevFilter) => ({
      ...prevFilter,
      categories: selectedCategories,
    }));
  }, [selectedCategories, setFilter]);

  // Update the local filter state using the setFilter
  const handleChange = useCallback(
    (_: React.MouseEvent<HTMLElement>, newAlignment: string[]) => {
      const selected: Category[] = categories.filter((c) =>
        newAlignment.includes(c.label)
      );
      setFilter((prevFilter) => ({
        ...prevFilter,
        categories: selected,
      }));
    },
    [categories, setFilter]
  );

  // Remove all items whose label is already in the labels array
  useEffect(() => {
    const labels = [...new Set(categories.map((c) => c.label))];
    setButtonLabels(labels);
  }, [categories]);

  useEffect(() => {
    dispatch(fetchParameterCategoriesWithStore(null))
      .unwrap()
      .then((categories: Array<Category>) => {
        // If the item does not have broader terms, that means it is the root level
        const root = categories.filter((i) => i.broader?.length === 0);

        // Now we need to go one level lower as this is a requirement to display second level instead of top level
        let child = new Array<Category>();
        root
          .filter((i) => i?.narrower?.length !== 0)
          .forEach((i) => i?.narrower?.forEach((j) => child.push(j)));

        // Now sort by child
        child = child.sort((a, b) =>
          a.label < b.label ? -1 : a.label > b.label ? 1 : 0
        );

        setCategories(child);
      })
      .catch((error) => console.error("Error fetching categories:", error));
  }, [dispatch]);

  return (
    <Grid container sx={sx}>
      <Grid item xs={12}>
        <StyledToggleButtonGroup
          value={filter.categories?.map((c) => c.label) || []}
          onChange={handleChange}
          aria-label="category selection"
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

export default CategoryFilter;
