import React from 'react'
import grey from "../common/colors/grey";
import {Card, CardContent, CardMedia, Grid, Typography, CardActionArea, CardActions, ListItem} from "@mui/material";
import {borderRadius, border} from "../common/constants";
import WhereToVoteIcon from '@mui/icons-material/WhereToVote';
import DownloadIcon from '@mui/icons-material/Download';
import SellIcon from '@mui/icons-material/Sell';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import SlightRoundButton from '../common/buttons/SlightRoundButton';
import { FixedSizeList, ListChildComponentProps } from 'react-window';
import { useSelector } from 'react-redux/es/hooks/useSelector';
import { OGCCollection, OGCCollections, CollectionsQueryType } from '../common/store/searchReducer';
import { RootState, searchQueryResult } from "../common/store/store";

interface ResultCardProps {
    item: number,
    content : OGCCollection,
    onAddToMap: ((event: React.MouseEvent<HTMLButtonElement, MouseEvent>, stac: OGCCollection) => void) | undefined,
    onDownload: ((event: React.MouseEvent<HTMLButtonElement, MouseEvent>, stac: OGCCollection) => void) | undefined,
    onTags: ((event: React.MouseEvent<HTMLButtonElement, MouseEvent>, stac: OGCCollection) => void) | undefined,
    onMore: ((event: React.MouseEvent<HTMLButtonElement, MouseEvent>, stac: OGCCollection) => void) | undefined,
}

const findThumbnail = (c : OGCCollection) : string => {
    return 'https://warcontent.com/wp-content/uploads/2021/03/substring-javascript-5.png'
}

const ResultCard = (props: ResultCardProps) => {

    return(
        <Card sx={{
            border: border['frameBorder'],
            borderRadius: borderRadius['filter'],
            backgroundColor: grey['resultCard']
        }}>
            <CardActionArea>
                <CardContent>
                    <Typography component="div" sx={{ marginBottom: '10px'}}>
                        <Grid container>
                            <Grid item xs={11}>{props.content.title?.substring(0, 90) + '...'}</Grid>
                            <Grid item xs={1}>
                                <div 
                                    style={{
                                        textAlign: 'center',
                                        color: 'white',
                                        backgroundColor: grey['resultCardNumber'],
                                        border: border['frameBorder'],
                                        borderRadius: borderRadius['circle'],
                                    }}>
                                    {props.item}
                                </div>
                            </Grid>
                        </Grid>                    
                    </Typography>
                    <Typography variant="body2">
                        <Grid container spacing={1}>
                            <Grid item xs={3}>
                                <CardMedia
                                    sx={{display: 'flex', width: '100%', height: '100px'}}
                                    component='img'
                                    image={findThumbnail(props.content)} />
                            </Grid>
                            <Grid item xs={9}>
                                {props.content.description?.substring(0, 180) + '...'}
                            </Grid>
                        </Grid>                    
                    </Typography>
                </CardContent>
            </CardActionArea>
            <CardActions>
                <SlightRoundButton 
                    startIcon={<WhereToVoteIcon/>} 
                    size="small" 
                    onClick={(event) => props?.onAddToMap && props.onAddToMap(event, props.content)}
                    disabled={props.onAddToMap === undefined}
                >
                        Add to Map
                </SlightRoundButton>
                <SlightRoundButton 
                    startIcon={<DownloadIcon/>} 
                    size="small" 
                    onClick={(event) => props?.onDownload && props.onDownload(event, props.content)}
                    disabled={props.onDownload === undefined}
                >
                    Download
                </SlightRoundButton>
                <SlightRoundButton 
                    startIcon={<SellIcon/>} 
                    size="small"
                    onClick={(event) => props?.onTags && props.onTags(event, props.content)}
                    disabled={props.onTags === undefined}
                >
                    Tags
                </SlightRoundButton>
                <SlightRoundButton 
                    startIcon={<MoreHorizIcon/>} 
                    size="small"
                    onClick={(event) => props?.onMore && props.onMore(event, props.content)}
                    disabled={props.onMore === undefined}
                >
                    More
                </SlightRoundButton>
            </CardActions>
        </Card>
    );
};

interface ResultCardsProps {
    onAddToMap: ((event: React.MouseEvent<HTMLButtonElement, MouseEvent>, stac: OGCCollection) => void) | undefined;
    onDownload: ((event: React.MouseEvent<HTMLButtonElement, MouseEvent>, stac: OGCCollection) => void) | undefined;
    onTags: ((event: React.MouseEvent<HTMLButtonElement, MouseEvent>, stac: OGCCollection) => void) | undefined;
    onMore: ((event: React.MouseEvent<HTMLButtonElement, MouseEvent>, stac: OGCCollection) => void) | undefined;
}

// This function is use to control which item to render in the long list
const renderRows = (props: ResultCardsProps, contents: OGCCollections, child: ListChildComponentProps) => {

    // The style must pass to the listitem else incorrect rendering
    const { index, style } = child;

    return (
        <ListItem style={style}>
            <ResultCard
                item={index + 1}
                content={contents.collections[index]}
                onAddToMap={props.onAddToMap}
                onDownload={props.onDownload}
                onTags={props.onTags}
                onMore={props.onMore}
            />
        </ListItem>
    );
} 
const ResultCards = (props: ResultCardsProps) => {

    const contents = useSelector<RootState, CollectionsQueryType>(searchQueryResult);

    return(
        <FixedSizeList
            height={700}
            width={"100%"}
            itemSize={270}
            itemCount={contents.result.collections.length}
            overscanCount={10}
        >
            {(child: ListChildComponentProps) => renderRows(props, contents.result, child)}
        </FixedSizeList>
    );
};

export {
    ResultCards,
    ResultCard
};
