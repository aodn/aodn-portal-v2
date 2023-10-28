import React from 'react'
import grey from "../common/colors/grey";
import {Card, CardContent, CardMedia, Grid, Typography, CardActionArea, CardActions} from "@mui/material";
import {borderRadius, frameBorder} from "../common/constants";
import WhereToVoteIcon from '@mui/icons-material/WhereToVote';
import DownloadIcon from '@mui/icons-material/Download';
import SellIcon from '@mui/icons-material/Sell';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import SlightRoundButton from '../common/buttons/SlightRoundButton';

interface ResultCardProps {
    item: number,
    uuid: string,
    title: string,
    status: string,
    imageUrl: string,
    description: string,
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
                            <Grid item xs={11}>{props.title}</Grid>
                            <Grid item xs={1}>
                                <div 
                                    style={{
                                        textAlign: 'center',
                                        color: 'white',
                                        backgroundColor: grey['resultCardNumber'],
                                        border: frameBorder,
                                        borderRadius: borderRadius['circle'],
                                    }}>
                                    {props.item}
                                </div>
                            </Grid>
                        </Grid>                    
                    </Typography>
                    <Typography variant="body2">
                        <Grid container spacing={1}>
                            <Grid item xs={3}><CardMedia sx={{display: 'flex', width: '100%', height: '100%'}} component='img' image={props.imageUrl} /></Grid>
                            <Grid item xs={9}>
                                {props.description.substring(0, 180) + '...'}
                            </Grid>
                        </Grid>                    
                    </Typography>
                </CardContent>
            </CardActionArea>
            <CardActions>
                <SlightRoundButton 
                    startIcon={<WhereToVoteIcon/>} 
                    size="small" 
                    onClick={(event) => props?.onAddToMap && props.onAddToMap(event, props.uuid)} 
                    disabled={props.onAddToMap === undefined}
                >
                        Add to Map
                </SlightRoundButton>
                <SlightRoundButton 
                    startIcon={<DownloadIcon/>} 
                    size="small" 
                    onClick={(event) => props?.onDownload && props.onDownload(event, props.uuid)} 
                    disabled={props.onDownload === undefined}
                >
                    Download
                </SlightRoundButton>
                <SlightRoundButton 
                    startIcon={<SellIcon/>} 
                    size="small"
                    onClick={(event) => props?.onTags && props.onTags(event, props.uuid)} 
                    disabled={props.onTags === undefined}
                >
                    Tags
                </SlightRoundButton>
                <SlightRoundButton 
                    startIcon={<MoreHorizIcon/>} 
                    size="small"
                    onClick={(event) => props?.onMore && props.onMore(event, props.uuid)} 
                    disabled={props.onMore === undefined}
                >
                    More
                </SlightRoundButton>
            </CardActions>
        </Card>
    );
};

interface ResultCardsProps {
    onAddToMap: ((event: React.MouseEvent<HTMLButtonElement, MouseEvent>, uuid: string) => void) | undefined;
    onDownload: ((event: React.MouseEvent<HTMLButtonElement, MouseEvent>, uuid: string) => void) | undefined;
    onTags: ((event: React.MouseEvent<HTMLButtonElement, MouseEvent>, uuid: string) => void) | undefined;
    onMore: ((event: React.MouseEvent<HTMLButtonElement, MouseEvent>, uuid: string) => void) | undefined;
}

const ResultCards = (props: ResultCardsProps) => {
    return(
        <Grid container direction={'column'}>
            <ResultCard
                title={'IMOS - ANMN South Australia (SA) Deep Slope Mooring (SAM1DS)'}
                status={'completed'}
                imageUrl={'https://warcontent.com/wp-content/uploads/2021/03/substring-javascript-5-1024x576.png.webp'}
                item={1}
                uuid={'uuid value'}
                onAddToMap={props.onAddToMap}
                onDownload={props.onDownload}
                onTags={props.onTags}
                onMore={props.onMore}
                description={'The data available from this mooring was designed to monitor particular oceanographic phenomena in coastal ocean waters. The mooring is located at Latitude:-36.52, Longitude:136.24 and trim the rest'}/>
        </Grid>
    );
};

export {
    ResultCards,
    ResultCard
};
