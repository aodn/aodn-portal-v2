import { useCallback, useEffect, useState } from "react";
import {
  Grid,
  Box,
  SxProps,
  Theme,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { useDispatch } from "react-redux";
import store, { AppDispatch } from "../store/store";
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

  const handleChange = useCallback(
    (event, newAlignment) => {
      // Now given the newAlignment value, we need to find the categories object
      // from there we can get the leaf node of what values to set for categories search
      const selected: Array<Category> = categories.filter((c) =>
        newAlignment.includes(c.label)
      );
      const childSelected = new Array<Category>();

      selected.forEach((s) => {
        s.narrower?.forEach((l) => childSelected.push(l));
      });

      dispatch(updateCategories(childSelected));
      setValues(newAlignment);
    },
    [dispatch, categories]
  );

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
        minHeight: "90px",
        ...props.sx,
      }}
    >
      <Grid item xs={12}>
        Category Vocabulary
      </Grid>
      <Grid item xs={12}>
        <ToggleButtonGroup
          sx={{
            display: "grid",
            gridTemplateColumns: "auto auto auto auto",
            gridGap: "50px",
            padding: "10px",
          }}
          value={values}
          exclusive={false}
          onChange={handleChange}
        >
          {categories.map((v) => (
            <ToggleButton
              sx={{
                boxShadow: "1px 1px 10px 1px #d4d4d4",
              }}
              value={v.label}
              key={v.label}
            >
              {v.label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Grid>
    </Grid>
  );
};

export default CategoryVocabFilter;
