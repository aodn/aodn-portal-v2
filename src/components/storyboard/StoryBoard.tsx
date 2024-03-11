import * as React from "react";
import { Box, CardContent, Typography, Grid, Card } from "@mui/material";
//import RoundButton from "../common/buttons/RoundButton"; TODO
import YouTube, { YouTubeProps } from "react-youtube";

interface ButtonEvent {
  label: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement> | undefined) => void;
}

interface StoryBoardProps {
  url: string;
  caption: React.ReactNode;
  content: string;
  isActive?: boolean;
  buttons?: Array<ButtonEvent>;
}

const StoryBoard = (props: StoryBoardProps) => {
  const onPlayerReady: YouTubeProps["onReady"] = (event) => {
    event.target.pauseVideo();
  };

  const opts: YouTubeProps["opts"] = {
    width: "480",
    height: "270",
    playerVars: {
      //autoplay: 1,
    },
  };
  return (
    <Box sx={{ display: props?.isActive ? "flex" : "none" }}>
      <Grid container spacing={3} justifyContent="center">
        <Grid item xs="auto" justifyContent="center">
          <Card>
            <YouTube
              videoId={props.url}
              opts={opts}
              style={{
                height: "270px",
              }}
              onReady={onPlayerReady}
            />
          </Card>
        </Grid>
        <Grid item xs={5}>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <CardContent sx={{ flex: "1 0 auto" }}>
              {props.caption}
              <Typography
                variant="body1"
                color="text.secondary"
                component="div"
                style={{ lineHeightStep: "30px" }}
              >
                {props.content}
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                component="div"
                style={{ lineHeightStep: "30px" }}
              >
                &nbsp;
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                component="div"
                style={{ lineHeightStep: "30px" }}
              >
                &nbsp;
              </Typography>
              {/* <Grid container spacing={3}>
                        {props.buttons &&
                            props.buttons?.map((button) => {
                                return (
                                    <Grid key={button.label} item xs='auto'>
                                        <RoundButton variant="outlined" size="small" onClick={button.onClick}>{button.label}</RoundButton>
                                    </Grid>
                                );
                            }
                        )}
                    </Grid> */}
            </CardContent>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StoryBoard;
