import React from 'react'
import grey from "../common/colors/grey";
import {Card, CardContent, CardMedia, Grid, Typography, CardActionArea, CardActions, List, ListItem} from "@mui/material";
import {borderRadius, frameBorder} from "../common/constants";
import WhereToVoteIcon from '@mui/icons-material/WhereToVote';
import DownloadIcon from '@mui/icons-material/Download';
import SellIcon from '@mui/icons-material/Sell';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import SlightRoundButton from '../common/buttons/SlightRoundButton';
import { FixedSizeList, ListChildComponentProps } from 'react-window';

export interface ResultCardContent {
    item: number,
    uuid: string,
    title: string,
    status: string,
    imageUrl: string,
    description: string
}

interface ResultCardProps {
    content: ResultCardContent,
    onAddToMap: ((event: React.MouseEvent<HTMLButtonElement, MouseEvent>, uuid: string) => void) | undefined,
    onDownload: ((event: React.MouseEvent<HTMLButtonElement, MouseEvent>, uuid: string) => void) | undefined,
    onTags: ((event: React.MouseEvent<HTMLButtonElement, MouseEvent>, uuid: string) => void) | undefined,
    onMore: ((event: React.MouseEvent<HTMLButtonElement, MouseEvent>, uuid: string) => void) | undefined,
}

const ResultCard = (props: ResultCardProps) => {
    return(
        <Card sx={{
            border: frameBorder,
            borderRadius: borderRadius['filter'],
            backgroundColor: grey['resultCard']
        }}>
            <CardActionArea>
                <CardContent>
                    <Typography component="div" sx={{ marginBottom: '10px'}}>
                        <Grid container>
                            <Grid item xs={11}>{props.content.title}</Grid>
                            <Grid item xs={1}>
                                <div 
                                    style={{
                                        textAlign: 'center',
                                        color: 'white',
                                        backgroundColor: grey['resultCardNumber'],
                                        border: frameBorder,
                                        borderRadius: borderRadius['circle'],
                                    }}>
                                    {props.content.item}
                                </div>
                            </Grid>
                        </Grid>                    
                    </Typography>
                    <Typography variant="body2">
                        <Grid container spacing={1}>
                            <Grid item xs={3}><CardMedia sx={{display: 'flex', width: '100%', height: '100px'}} component='img' image={props.content.imageUrl} /></Grid>
                            <Grid item xs={9}>
                                {props.content.description.substring(0, 180) + '...'}
                            </Grid>
                        </Grid>                    
                    </Typography>
                </CardContent>
            </CardActionArea>
            <CardActions>
                <SlightRoundButton 
                    startIcon={<WhereToVoteIcon/>} 
                    size="small" 
                    onClick={(event) => props?.onAddToMap && props.onAddToMap(event, props.content.uuid)} 
                    disabled={props.onAddToMap === undefined}
                >
                        Add to Map
                </SlightRoundButton>
                <SlightRoundButton 
                    startIcon={<DownloadIcon/>} 
                    size="small" 
                    onClick={(event) => props?.onDownload && props.onDownload(event, props.content.uuid)} 
                    disabled={props.onDownload === undefined}
                >
                    Download
                </SlightRoundButton>
                <SlightRoundButton 
                    startIcon={<SellIcon/>} 
                    size="small"
                    onClick={(event) => props?.onTags && props.onTags(event, props.content.uuid)} 
                    disabled={props.onTags === undefined}
                >
                    Tags
                </SlightRoundButton>
                <SlightRoundButton 
                    startIcon={<MoreHorizIcon/>} 
                    size="small"
                    onClick={(event) => props?.onMore && props.onMore(event, props.content.uuid)} 
                    disabled={props.onMore === undefined}
                >
                    More
                </SlightRoundButton>
            </CardActions>
        </Card>
    );
};

interface ResultCardsProps {
    contents: Array<ResultCardContent>,
    onAddToMap: ((event: React.MouseEvent<HTMLButtonElement, MouseEvent>, uuid: string) => void) | undefined;
    onDownload: ((event: React.MouseEvent<HTMLButtonElement, MouseEvent>, uuid: string) => void) | undefined;
    onTags: ((event: React.MouseEvent<HTMLButtonElement, MouseEvent>, uuid: string) => void) | undefined;
    onMore: ((event: React.MouseEvent<HTMLButtonElement, MouseEvent>, uuid: string) => void) | undefined;
}

// This function is use to control which item to render in the long list
const renderRows = (props: ResultCardsProps, child: ListChildComponentProps) => {

    // The style must pass to the listitem else incorrect rendering
    const { index, style } = child;

    return (
        <ListItem style={style}>
            <ResultCard
                content={props.contents[index]}
                onAddToMap={props.onAddToMap}
                onDownload={props.onDownload}
                onTags={props.onTags}
                onMore={props.onMore}
            />
        </ListItem>
    );
}
const ResultCards = (props: ResultCardsProps) => {
    return(
        <FixedSizeList
            height={700}
            width={"100%"}
            itemSize={270}
            itemCount={props.contents.length}
            overscanCount={10}
        >
            {(child: ListChildComponentProps) => renderRows(props, child)}
        </FixedSizeList>
    );
};

export {
    ResultCards,
    ResultCard
};
