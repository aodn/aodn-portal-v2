import {
  Box,
  Card,
  Grid,
  IconButton,
  Paper,
  SxProps,
  Typography,
} from "@mui/material";
import {
  borderRadius,
  fontColor,
  fontSize,
  fontWeight,
  padding,
} from "../../../styles/constants";
import { ReactElement, useCallback, useMemo } from "react";
import ReplyIcon from "@mui/icons-material/Reply";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import { useDetailPageContext } from "../context/detail-page-context";
import imosLogoWithTitle from "@/assets/logos/imos_logo_with_title.png";
import OrganizationLogo from "../../../components/logo/OrganizationLogo";
import useRedirectSearch from "../../../hooks/useRedirectSearch";
import useBreakpoint from "../../../hooks/useBreakpoint";
import useRedirectHome from "../../../hooks/useRedirectHome";
import { useLocation } from "react-router-dom";
import { SEARCH_PAGE_REFERER } from "../../search-page/constants";

interface ButtonWithIcon {
  label: string;
  icon: ReactElement;
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
  const location = useLocation();
  const { isUnderLaptop } = useBreakpoint();
  const { collection } = useDetailPageContext();
  const redirectHome = useRedirectHome();
  const redirectSearch = useRedirectSearch();

  const title = useMemo(() => collection?.title, [collection?.title]);

  // TODO: on click user goes back to search page where has results based on previous search params
  const onGoBack = useCallback(
    (referer: string) => {
      if (referer !== SEARCH_PAGE_REFERER) {
        redirectHome("HeaderSection", true);
      } else {
        redirectSearch("HeaderSection", true, false);
      }
    },
    [redirectHome, redirectSearch]
  );

  const renderButton = useCallback((icon: ReactElement) => {
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
  // Render the go back button next to the header
  const renderNavigateButtons = useCallback(
    (isUnderLaptop: boolean, clickHandler: () => void) => {
      const style: SxProps = {
        top: "5%",
      };
      if (isUnderLaptop) {
        style.position = "absolute";
        style.left = "-50px";
      }
      return (
        <Box
          aria-label="go-back button"
          sx={style}
          onClick={clickHandler}
          data-testid="go-back-button"
        >
          {renderButton(buttons.goBack.icon)}
        </Box>
      );
    },
    [renderButton]
  );

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
          {renderNavigateButtons(!isUnderLaptop, () =>
            onGoBack(location.state?.referer)
          )}
          <Typography
            aria-label="collection title"
            fontSize={fontSize.detailPageHeading}
            fontWeight={fontWeight.bold}
            color={fontColor.gray.dark}
            sx={{
              padding: 1,
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
