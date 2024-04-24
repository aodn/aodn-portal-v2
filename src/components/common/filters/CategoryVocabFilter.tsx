import { useCallback, useEffect, useState } from "react";
import {
  Box,
  Grid,
  SxProps,
  Theme,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store/store";
import { borderRadius } from "../constants";
import blue from "../colors/blue";
import { fetchParameterCategoriesWithStore } from "../store/searchReducer";
import { Category, updateCategories } from "../store/componentParamReducer";

interface CategoryVocabFilterProps {
  sx?: SxProps<Theme>;
}

const CategoryVocabFilter = (props: CategoryVocabFilterProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const [categories, setCategories] = useState<Array<Category>>([]);
  const [values, setValues] = useState<Array<string>>([]);

  // Because the categories using in this component have duplicate labels. They should be combined so need this state
  // to store the labels of the buttons
  const [buttonLabels, setButtonLabels] = useState<string[]>([]);

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
      setValues(newAlignment);
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
        const root = categories.filter((i) => i.broader.length === 0);

        // Now we need to go one level lower as this is a requirement to display second level instead of top level
        let child = new Array<Category>();
        root
          .filter((i) => i.narrower.length !== 0)
          .forEach((i) => i.narrower.forEach((j) => child.push(j)));

        // Now sort by child
        child = child.sort((a, b) =>
          a.label < b.label ? -1 : a.label > b.label ? 1 : 0
        );

        setCategories(child);
      });
  }, [dispatch]);

  return (
    <Grid
      container
      sx={{
        backgroundColor: blue["bgParam"],
        border: "none",
        borderRadius: borderRadius["filter"],
        justifyContent: "center",
        minHeight: "70px",
        ...props.sx,
      }}
    >
      <Grid item xs={12}>
        <Box display="flex" justifyContent="center" alignItems="center">
          Category Vocabulary
        </Box>
      </Grid>
      <Grid item xs={12}>
        <ToggleButtonGroup
          sx={{
            display: "grid",
            gridTemplateColumns: "auto auto auto auto",
            gridGap: "10px",
            padding: "10px",
          }}
          value={values}
          exclusive={false}
          onChange={handleChange}
        >
          {buttonLabels.map((label) => (
            <ToggleButton
              sx={{
                boxShadow: "1px 1px 10px 1px #d4d4d4",
              }}
              value={label}
              key={label}
            >
              {label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Grid>
    </Grid>
  );
};

export default CategoryVocabFilter;
