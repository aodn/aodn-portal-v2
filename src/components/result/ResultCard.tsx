import React, { useState, useEffect } from 'react'
import {Card, CardContent, Grid, Typography} from "@mui/material";

interface ResultCardProps {
    title: string,
    status: string,
    imageUrl: string,
    description: string
}

const ResultCard = (props: ResultCardProps) => {
    return(
        <Card>
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    {props.title}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default ResultCard;