import { useCallback, useEffect, useState } from "react";
import { Grid, SxProps, Theme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";
import { fetchParameterCategoriesWithStore } from "../store/searchReducer";
import { Category, updateCategories } from "../store/componentParamReducer";
import { StyledToggleButton } from "../../../styles/StyledToggleButton";
import { StyledToggleButtonGroup } from "../../../styles/StyledToggleButtonGroup";

interface CategoryVocabFilterProps {
  sx?: SxProps<Theme>;
}

const CategoryVocabFilter = (props: CategoryVocabFilterProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const [categories, setCategories] = useState<Array<Category>>([]);

  // Because the categories using in this component have duplicate labels. They should be combined so need this state
  // to store the labels of the buttons
  const [buttonLabels, setButtonLabels] = useState<string[]>([]);

  const selectedCategories: Category[] | undefined = useSelector(
    (state: RootState) => state.paramReducer.categories
  );

  const selectedCategoryStrs = selectedCategories
    ? [...new Set(selectedCategories.map((c) => c.label))]
    : [];

  const handleChange = useCallback(
    (_: any, newAlignment: any) => {
      // Now given the newAlignment value, we need to find the categories object
      // from there we can get the leaf node of what values to set for categories search
      const selected: Array<Category> = categories.filter((c) =>
        newAlignment.includes(c.label)
      );
      const childSelected = new Array<Category>();

      selected.forEach((selectedCategory) => {
        if (selectedCategory.label) {
          childSelected.push(selectedCategory);
        }
      });

      dispatch(updateCategories(childSelected));
    },
    [dispatch, categories]
  );

  useEffect(() => {
    // remove all items whose label is already in the labels array

    const labels = [...new Set(categories.map((c) => c.label))];
    setButtonLabels(labels);
  }, [categories]);

  useEffect(() => {
    dispatch(fetchParameterCategoriesWithStore(null))
      .unwrap()
      .then((categories: Array<Category>) => {
        // If the item do not have a broader terms, that means it is the root level
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
      });
  }, [dispatch]);

  return (
    <Grid container sx={{ ...props.sx }}>
      <Grid item xs={12}>
        <StyledToggleButtonGroup
          value={selectedCategoryStrs}
          exclusive={false}
          onChange={handleChange}
        >
          {buttonLabels.map((label) => (
            <StyledToggleButton value={label} key={label}>
              {label}
            </StyledToggleButton>
          ))}
        </StyledToggleButtonGroup>
      </Grid>
    </Grid>
  );
};

export default CategoryVocabFilter;
