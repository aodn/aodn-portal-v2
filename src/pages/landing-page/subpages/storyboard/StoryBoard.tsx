import { useCallback } from "react";
import { Box, CardContent, Typography, Card, Stack } from "@mui/material";
//import RoundButton from "../common/buttons/RoundButton"; TODO
import YouTube, { YouTubeProps } from "react-youtube";
import useBreakpoint from "../../../../hooks/useBreakpoint";
import {
  STORYBOARD_VIDEO_WIDTH_LAPTOP,
  STORYBOARD_VIDEO_WIDTH_MOBILE,
  STORYBOARD_VIDEO_WIDTH_TABLET,
} from "./constants";

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
  const { isMobile, isTablet, isLaptop } = useBreakpoint();

  const getWidth = useCallback(() => {
    if (isMobile) {
      return STORYBOARD_VIDEO_WIDTH_MOBILE;
    } else if (isTablet) {
      return STORYBOARD_VIDEO_WIDTH_TABLET;
    } else if (isLaptop) {
      return STORYBOARD_VIDEO_WIDTH_LAPTOP;
    } else {
      return STORYBOARD_VIDEO_WIDTH_LAPTOP;
    }
  }, [isLaptop, isMobile, isTablet]);

  const onPlayerReady: YouTubeProps["onReady"] = (event) => {
    event.target.pauseVideo();
  };

  const opts: YouTubeProps["opts"] = {
    width: getWidth(),
    height: getWidth() * 0.56,
    playerVars: {
      //autoplay: 1,
    },
  };
  return (
    <Box sx={{ display: props?.isActive ? "flex" : "none" }}>
      <Stack
        direction={{ xs: "column", lg: "row" }}
        spacing={2}
        justifyContent="center"
        alignItems="center"
      >
        <Box>
          <Card>
            <YouTube
              videoId={props.url}
              opts={opts}
              style={{
                height: getWidth() * 0.56,
              }}
              onReady={onPlayerReady}
            />
          </Card>
        </Box>

        <Stack
          direction="column"
          display="flex"
          justifyContent="start"
          alignItems="start"
          maxWidth={{ xs: getWidth(), lg: "none" }}
        >
          <CardContent sx={{ flex: "1 0 auto" }}>
            {props.caption}
            <Typography
              color="text.secondary"
              style={{ lineHeightStep: "30px" }}
            >
              {props.content}
            </Typography>
          </CardContent>
        </Stack>
      </Stack>
    </Box>
  );
};

export default StoryBoard;
