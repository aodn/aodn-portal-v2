import React from "react";
import { List, ListItem, ListItemText, ListItemSecondaryAction, IconButton } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import { StacCollection } from "../../../common/store/searchReducer";

interface ItemsOnMapControlProps {
    // Contain UUID and its description for each item
    stac: Array<StacCollection>;
}

const itemId = 'display-items-on-map';

const createListItem = (uuid: string, description: string) => {
    return (
        <ListItem id={itemId + uuid}>
            <ListItemText primary={description} />
            <ListItemSecondaryAction>
                <IconButton edge="end" aria-label="delete">
                    <ClearIcon />
                </IconButton>
            </ListItemSecondaryAction>
        </ListItem>
    );
}

const ItemsOnMapControl = (props: ItemsOnMapControlProps) => {

    return (
        <List
            id={itemId} 
            sx={{ width: '100%', bgcolor: 'background.paper' }}>
            {
                props.stac.map((i) => {
                    return createListItem(i.id, i.description);
                })
            }
        </List>
    );
}

export default ItemsOnMapControl;