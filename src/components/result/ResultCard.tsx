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
    title: string,
    status: string,
    imageUrl: string,
    description: string
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
                <SlightRoundButton startIcon={<WhereToVoteIcon/>} size="small" >Add to Map</SlightRoundButton>
                <SlightRoundButton startIcon={<DownloadIcon/>} size="small" >Download</SlightRoundButton>
                <SlightRoundButton startIcon={<SellIcon/>} size="small" >Tags</SlightRoundButton>
                <SlightRoundButton startIcon={<MoreHorizIcon/>} size="small">More</SlightRoundButton>
            </CardActions>
        </Card>
    );
};

export default ResultCard;