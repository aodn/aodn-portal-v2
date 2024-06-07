import {
  Box,
  Card,
  Grid,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import {
  borderRadius,
  fontColor,
  fontSize,
  fontWeight,
  padding,
} from "../../../styles/constants";
import { useCallback } from "react";
import ReplyIcon from "@mui/icons-material/Reply";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import { useDetailPageContext } from "../context/detail-page-context";

interface ButtonWithIcon {
  label: string;
  icon: JSX.Element;
}

type ButtonName = "goBack" | "goToNext" | "goToPrevious";

const buttons: Record<ButtonName, ButtonWithIcon> = {
  goBack: {
    label: "Go Back",
    icon: <ReplyIcon />,
  },
  goToNext: {
    label: "Go to Next",
    icon: <SkipNextIcon />,
  },
  goToPrevious: {
    label: "Go to Previous",
    icon: <SkipPreviousIcon />,
  },
};

const HeaderPanel = () => {
  const { collection } = useDetailPageContext();
  const title = collection?.title;
  const renderButton = useCallback((children: JSX.Element) => {
    return (
      <Paper
        elevation={3}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: borderRadius.small,
        }}
      >
        <IconButton>{children}</IconButton>
      </Paper>
    );
  }, []);

  return (
    <Card
      aria-label="header panel"
      elevation={3}
      sx={{
        position: "relative",
        padding: padding.medium,
        paddingX: padding.large,
        backgroundColor: "white",
        borderRadius: borderRadius.small,
        overflow: "visible",
      }}
    >
      <Box
        aria-label="go-back button"
        sx={{
          position: "absolute",
          left: "-50px",
          top: "5%",
        }}
      >
        {renderButton(buttons.goBack.icon)}
      </Box>
      <Box
        aria-label="go-previous & go-next button group"
        sx={{
          position: "absolute",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          right: "-50px",
          top: "5%",
        }}
      >
        <Stack spacing={1}>
          {renderButton(buttons.goToPrevious.icon)}
          {renderButton(buttons.goToNext.icon)}
        </Stack>
      </Box>
      <Grid container>
        <Grid
          item
          xs={10}
          sx={{
            display: "flex",
            justifyContent: "start",
            alignItems: "center",
          }}
        >
          <Typography
            aria-label="collection title"
            fontSize={fontSize.detailPageHeading}
            fontWeight={fontWeight.bold}
            color={fontColor.gray.dark}
            sx={{
              padding: 0,
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: "2",
              WebkitBoxOrient: "vertical",
            }}
          >
            {title}
          </Typography>
        </Grid>
        <Grid
          item
          xs={2}
          sx={{
            display: "flex",
            justifyContent: "right",
            alignItems: "center",
          }}
        >
          <img
            aria-label="collection image"
            src="logo/imos_logo_with_title.png"
            alt="imos_logo_with_title"
            style={{
              objectFit: "contain",
              height: "100%",
            }}
          />
        </Grid>
      </Grid>
    </Card>
  );
};

export default HeaderPanel;
