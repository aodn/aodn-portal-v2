import * as React from 'react';
import {DetailsProps} from "./DetailsPanel";
import {Card, Typography, CardContent, Box, CardMedia, Grid} from "@mui/material";
import {border, borderRadius, margin} from "../common/constants";
import grey from "../common/colors/grey";
import SlightRoundButton from "../common/buttons/SlightRoundButton";
import UndoIcon from '@mui/icons-material/Undo';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import {useNavigate} from "react-router-dom";

const DetailsHeaderButton = (props: DetailsProps) => {
    const navigate = useNavigate();
    
    return (
      <Grid container>
          <Grid item xs={6}>
              <SlightRoundButton
                  startIcon={<UndoIcon />}
                  sx={{minWidth: 200}}
                  onClick={() => navigate('/search')}
              >
                  Back to search
              </SlightRoundButton>
          </Grid>
          <Grid item xs={6}>
              <Box display="flex" justifyContent="flex-end">
                    <SlightRoundButton
                        startIcon={<FileDownloadIcon />}
                        endIcon={<ArrowDropDownIcon/> }
                        sx={{minWidth: 200}}
                    >
                        Downloads
                    </SlightRoundButton>
              </Box>
          </Grid>
      </Grid>
    );
}

const DetailsHeader = (props: DetailsProps) => {
    return (
        <Card sx={{
            border: border['frameBorder'],
            borderRadius: borderRadius['filter'],
            backgroundColor: grey['resultCard'],
            display: 'flex'
        }}>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
            }}>
                <CardContent sx={{ flex: '1 0 auto' }}>
                    <Typography variant="h5" component="h5">
                        {props.collection?.title}
                    </Typography>
                </CardContent>
            </Box>
            <CardMedia
                component="img"
                sx={{
                    width: 200,
                    marginTop: margin['top'],
                    marginBottom: margin['bottom'],
                    marginLeft: margin['left'],
                }}
                // TODO: should get link from collection
                image="/logo/imos_logo.png"
            />
        </Card>
    );
}

export {
    DetailsHeader,
    DetailsHeaderButton
};