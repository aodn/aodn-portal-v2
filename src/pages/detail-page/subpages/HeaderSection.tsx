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
import imosLogoWithTitle from "@/assets/logos/imos_logo_with_title.png";
import OrganizationLogo from "../../../components/logo/OrganizationLogo";
import useRedirectSearch from "../../../hooks/useRedirectSearch";
import useBreakpoint from "../../../hooks/useBreakpoint";

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

const HeaderSection = () => {
  const { isUnderLaptop } = useBreakpoint();
  const redirectSearch = useRedirectSearch();
  const { collection } = useDetailPageContext();

  const title = collection?.title;

  // TODO: on click user goes back to search page where has results based on previous search params
  const onGoBack = useCallback(() => {
    redirectSearch("HeaderSection", true, false);
  }, [redirectSearch]);

  // TODO: implement the goNext and goPrevious function
  // This will require the entire search results (their ids and indexes) based on search params
  // and current-collection-index

  const renderButton = useCallback((icon: JSX.Element) => {
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
        <IconButton>{icon}</IconButton>
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
        onClick={onGoBack}
        data-testid="go-back-button"
      >
        {!isUnderLaptop && renderButton(buttons.goBack.icon)}
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
          {/*TODO: hide the below 2 buttons now, for better demonstration. Can uncommented them when implementing them*/}
          {/*{renderButton(buttons.goToPrevious.icon)}*/}
          {/*{renderButton(buttons.goToNext.icon)}*/}
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
          {collection && (
            <OrganizationLogo
              logo={collection.findIcon()}
              sx={{
                width: "100%",
                height: "60px",
                paddingX: padding.extraSmall,
              }}
              defaultImageSrc={imosLogoWithTitle}
            />
          )}
        </Grid>
      </Grid>
    </Card>
  );
};

export default HeaderSection;
