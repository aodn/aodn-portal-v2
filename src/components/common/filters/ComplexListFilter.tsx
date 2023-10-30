import * as React from 'react';
import {Grid, List, ListItem, ListItemIcon, ListSubheader, Box, IconButton, Collapse} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import {border, borderRadius, filterList} from "../constants";
import grey from "../colors/grey";
import {useEffect, useState} from "react";
import {FilterGroup, Filter, getAllFilters} from "./api";

interface ExpandableControl {
    showHide: Map<string, boolean>
}

const createListItem = (item: Filter) =>
    <ListItem
        sx={{backgroundColor: grey['filterGroupItem']}}
        secondaryAction={
            <IconButton edge={'end'}>
                <AddIcon/>
            </IconButton>
        }
    >
        {item.name}
    </ListItem>



const ComplexListFilter = () => {
    const [filterGroup, setFilterGroup] = useState<Array<FilterGroup>>(getAllFilters())
    const [showHideListItem, setShowHideListItem] = useState<ExpandableControl | null>(null);

    useEffect(() =>{
        // Init the show hide iff filterGroup value changed
        setShowHideListItem((prevState) => {

            const e: ExpandableControl = {
                showHide: new Map<string, boolean>()
            };

            filterGroup.forEach(v => {
                e.showHide.set(v.name, v.filters.length > filterList['filterListMaxDisplay']);
            });

            return e;
        });
    }, [filterGroup])

    return(
        <Grid container spacing={2}>
            <Grid item xs={12}>
                {
                    filterGroup && filterGroup.map(value =>
                        <List
                            sx={{
                                backgroundColor: grey['filterGroup'],
                                border: border['listFilterBorder'],
                                borderRadius: borderRadius['filter'],
                                marginBottom: '10px'}}
                        >
                            <ListSubheader sx={{backgroundColor: grey['filterGroup']}}>
                                {value.name}
                            </ListSubheader>
                                <>
                                    {
                                        // Display only the first few items, can expand the list if needed
                                        value.filters.slice(0, filterList['filterListMaxDisplay']).map(f =>
                                            createListItem(f)
                                        )
                                    }
                                    <ListItem
                                        sx={{
                                            backgroundColor: grey['filterGroupItem'],
                                            display: showHideListItem?.showHide.get(value.name) ? 'flex' : 'none'
                                        }}
                                    >
                                        <ListItemIcon>
                                            <IconButton
                                                edge={'start'}
                                                onClick={(event ) => {
                                                    setShowHideListItem((prevState) => {
                                                        prevState?.showHide.set(value.name, !prevState?.showHide.get(value.name));
                                                        return prevState;
                                                    });
                                                }}
                                            >
                                                <UnfoldMoreIcon/>
                                            </IconButton>
                                        </ListItemIcon>
                                        all ({value.filters.length - filterList['filterListMaxDisplay']})
                                    </ListItem>
                                    <Collapse
                                        key={value.name + '-collapse-id'}
                                        in={!showHideListItem?.showHide.get(value.name)}
                                        timeout='auto'
                                        unmountOnExit
                                    >
                                        <List component='li' disablePadding key={value.name + '-collapse-item-id'}>
                                            {value.filters.slice(filterList['filterListMaxDisplay']).map(item =>
                                                createListItem(item)
                                            )}
                                        </List>
                                    </Collapse>
                                </>
                        </List>
                    )
                }
            </Grid>
        </Grid>
    );
}

export default ComplexListFilter;