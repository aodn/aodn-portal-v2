import {
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListSubheader,
  IconButton,
  Collapse,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import UnfoldMoreIcon from "@mui/icons-material/UnfoldMore";
import grey from "../colors/grey";
import { useCallback, useEffect, useState } from "react";
import { FilterGroup, Filter, getAllFilters } from "./api";
import { border, borderRadius, filterList } from "../../../styles/constants";

const createListItem = (item: Filter) => (
  <ListItem
    sx={{ backgroundColor: grey["filterGroupItem"] }}
    secondaryAction={
      <IconButton edge={"end"}>
        <AddIcon />
      </IconButton>
    }
  >
    {item.name}
  </ListItem>
);

const initShowHideListItem = (filterGroup: Array<FilterGroup>) => {
  const i = new Map<string, boolean>();

  filterGroup.forEach((v) => {
    i.set(v.name, v.filters.length > filterList["filterListMaxDisplay"]);
  });

  return i;
};

const ComplexListFilter = () => {
  const [filterGroup, setFilterGroup] = useState<Array<FilterGroup>>();
  const [showHideListItem, setShowHideListItem] =
    useState<Map<string, boolean>>();

  useEffect(() => {
    const f = getAllFilters();
    setFilterGroup(f);
    setShowHideListItem(initShowHideListItem(f));
  }, []);

  const toggleShowHide = useCallback(
    (name: string) => {
      setShowHideListItem((prevState) => {
        // Must clone a new copy otherwise React update will not trigger
        const newMap = new Map<string, boolean>(prevState);
        newMap?.set(name, !newMap.get(name));
        return newMap;
      });
    },
    [setShowHideListItem]
  );

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        {filterGroup &&
          filterGroup.map((value) => (
            <List
              key={value.name}
              sx={{
                backgroundColor: grey["filterGroup"],
                border: border["buttonBorder"],
                borderRadius: borderRadius["filter"],
                marginBottom: "10px",
              }}
            >
              <ListSubheader sx={{ backgroundColor: grey["filterGroup"] }}>
                {value.name}
              </ListSubheader>
              <>
                {
                  // Display only the first few items, can expand the list if needed
                  value.filters
                    .slice(0, filterList["filterListMaxDisplay"])
                    .map((f) => createListItem(f))
                }
                <ListItem
                  sx={{
                    backgroundColor: grey["filterGroupItem"],
                    display: showHideListItem?.get(value.name)
                      ? "flex"
                      : "none",
                  }}
                >
                  <ListItemIcon>
                    <IconButton
                      edge={"start"}
                      // onClick={(event) => {
                      //   toggleShowHide(value.name);
                      // }}
                    >
                      <UnfoldMoreIcon />
                    </IconButton>
                  </ListItemIcon>
                  all (
                  {value.filters.length - filterList["filterListMaxDisplay"]})
                </ListItem>
                {
                  // TODO: Not working properly
                }
                <Collapse
                  key={value.name + "-collapse-id"}
                  in={!showHideListItem?.get(value.name)}
                  timeout="auto"
                  unmountOnExit
                >
                  <List
                    component="li"
                    disablePadding
                    key={value.name + "-collapse-item-id"}
                  >
                    {value.filters
                      .slice(filterList["filterListMaxDisplay"])
                      .map((item) => createListItem(item))}
                  </List>
                </Collapse>
              </>
            </List>
          ))}
      </Grid>
    </Grid>
  );
};

export default ComplexListFilter;
