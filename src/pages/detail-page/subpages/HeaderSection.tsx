import { ReactElement, ReactNode, useCallback, useMemo } from "react";
import { useLocation } from "react-router-dom";
import {
  Box,
  Card,
  Grid,
  IconButton,
  Paper,
  SxProps,
  Typography,
  useTheme,
} from "@mui/material";
import ReplyIcon from "@mui/icons-material/Reply";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import ContentCopy from "@mui/icons-material/ContentCopy";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import { useDetailPageContext } from "../context/detail-page-context";
import imosLogoWithTitle from "@/assets/logos/imos_logo_with_title.png";
import OrganizationLogo from "../../../components/logo/OrganizationLogo";
import useRedirectSearch from "../../../hooks/useRedirectSearch";
import useBreakpoint from "../../../hooks/useBreakpoint";
import useRedirectHome from "../../../hooks/useRedirectHome";
import useCopyToClipboard from "../../../hooks/useCopyToClipboard";
import { SEARCH_PAGE_REFERER } from "../../search-page/constants";
import {
  border,
  borderRadius,
  color,
  fontColor,
  fontSize,
  fontWeight,
  gap,
  margin,
  padding,
} from "../../../styles/constants";
import ShareButtonMenu, {
  ShareMenuItem,
} from "../../../components/menu/ShareButtonMenu";
import DataUsageIcon from "@mui/icons-material/DataUsage";
import dayjs from "dayjs";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import { dateDefault } from "../../../components/common/constants";

interface ButtonWithIcon {
  label: string;
  icon: ReactElement;
}

type ButtonName = "goBack" | "goToNext" | "goToPrevious";

enum Status {
  onGoing = "onGoing",
  completed = "completed",
}

const RoundCard = ({ children, sx }: { children: ReactNode; sx: SxProps }) => {
  return (
    <Card
      elevation={0}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: borderRadius.medium,
        padding: padding.extraSmall,
        ...sx,
      }}
    >
      {children}
    </Card>
  );
};

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

const renderCompletedStatus = () => (
  <RoundCard
    sx={{
      border: `${border.xs} ${color.gray.extraLight}`,
      backgroundColor: color.blue.extraLightSemiTransparent,
    }}
  >
    <DoneAllIcon sx={{ fontSize: "18px" }} color="primary" />
    <Typography
      padding={0}
      paddingLeft={padding.small}
      color={color.blue.dark}
      fontSize={fontSize.label}
    >
      Completed
    </Typography>
  </RoundCard>
);

const renderButton = (icon: ReactElement) => (
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

// Render the go back button next to the header
const renderNavigateButtons = (
  isUnderLaptop: boolean,
  clickHandler: () => void
) => {
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
};

const HeaderSection = () => {
  const location = useLocation();
  const theme = useTheme();
  const { isUnderLaptop, isMobile } = useBreakpoint();
  const { collection } = useDetailPageContext();
  const { isCopied, copyToClipboard, resetCopyState } = useCopyToClipboard();
  const redirectHome = useRedirectHome();
  const redirectSearch = useRedirectSearch();

  const title = useMemo(() => collection?.title, [collection?.title]);
  const copyUrl = window.location.href;

  const period: (string | null)[][] | undefined = collection?.extent?.temporal
    .interval ?? [
    ["", ""],
    ["", ""],
  ];

  let startDate: string | undefined;
  let endDate: string | undefined;
  if (period && period[0][0]) {
    startDate = dayjs(period[0][0]).format(dateDefault.DISPLAY_FORMAT);
  }
  if (period && period[0][1]) {
    endDate = dayjs(period[0][1]).format(dateDefault.DISPLAY_FORMAT);
  }

  const shareItems: ShareMenuItem[] = useMemo(
    () => [
      {
        name: "Copy Link",
        icon: isCopied ? (
          <DoneAllIcon fontSize="small" color="primary" />
        ) : (
          <ContentCopy fontSize="small" color="primary" />
        ),
        handler: () => copyToClipboard(copyUrl),
      },
    ],
    [copyToClipboard, copyUrl, isCopied]
  );

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

  const renderOnGoingStatus = useCallback(
    () => (
      <RoundCard sx={{ border: `${border.xs} ${theme.palette.success.main}` }}>
        <DataUsageIcon sx={{ fontSize: "16px" }} color="success" />
        <Typography
          padding={0}
          paddingLeft={padding.small}
          fontSize={fontSize.label}
          color={theme.palette.success.main}
        >
          On Going
        </Typography>
      </RoundCard>
    ),
    [theme.palette.success.main]
  );

  const renderSubTitle = useCallback(
    (
      startDate: string,
      endDate: string | undefined,
      status: Status,
      pace: string | undefined
    ) => {
      return (
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            fontSize: fontSize.label,
            margin: `${margin.lg} ${margin.lg} 0`,
            gap: gap.md,
          }}
        >
          {pace && (
            <>
              <Box>
                <RoundCard
                  sx={{
                    border: `${border.xs} ${theme.palette.success.main}`,
                  }}
                >
                  <Typography
                    padding={0}
                    fontSize={fontSize.label}
                    color={theme.palette.success.main}
                  >
                    {pace}
                  </Typography>
                </RoundCard>
              </Box>
            </>
          )}
          <Box sx={{ paddingLeft: padding.medium }}>Period:</Box>
          <Box>
            <RoundCard
              sx={{
                border: `${border.xs} ${color.gray.extraLight}`,
                backgroundColor: color.blue.extraLightSemiTransparent,
              }}
            >
              <Typography
                padding={0}
                paddingRight={padding.small}
                fontSize={fontSize.label}
              >
                {startDate}
              </Typography>
              <KeyboardDoubleArrowRightIcon
                sx={{
                  fontSize: fontSize.label,
                  color: color.gray.light,
                }}
              />
              {endDate && (
                <Typography
                  padding={0}
                  paddingLeft={padding.small}
                  fontSize={fontSize.label}
                >
                  {endDate}
                </Typography>
              )}
            </RoundCard>
          </Box>
          <Box>
            {status &&
              (status === Status.completed
                ? renderCompletedStatus()
                : renderOnGoingStatus())}
          </Box>
        </Box>
      );
    },
    [renderOnGoingStatus, theme.palette.success.main]
  );

  return (
    <Box display="flex" flexDirection="row" gap={1} width="100%">
      <Paper
        aria-label="header"
        elevation={3}
        sx={{
          position: "relative",
          padding: padding.medium,
          backgroundColor: "white",
          borderRadius: borderRadius.small,
          flex: 1,
        }}
      >
        <Grid container>
          <Grid
            item
            xs={9}
            sm={10}
            sx={{
              display: "flex",
              justifyContent: "start",
              alignItems: "center",
            }}
          >
            <Grid container>
              <Grid item xs={isUnderLaptop ? 0 : 1}>
                {renderNavigateButtons(!isUnderLaptop, () =>
                  onGoBack(location.state?.referer)
                )}
              </Grid>
              <Grid item xs={isUnderLaptop ? 10 : 12}>
                <Typography
                  aria-label="collection title"
                  fontSize={
                    isMobile
                      ? fontSize.detailPageHeadingMobile
                      : fontSize.detailPageHeading
                  }
                  fontWeight={fontWeight.bold}
                  color={fontColor.gray.dark}
                  sx={{
                    p: 0,
                    paddingX: padding.small,
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
              <Grid item xs={isUnderLaptop ? 10 : 12}>
                {startDate &&
                  collection &&
                  renderSubTitle(
                    startDate,
                    endDate,
                    collection.getStatus() as Status,
                    collection.getPace()
                  )}
              </Grid>
            </Grid>
          </Grid>
          <Grid
            item
            xs={3}
            sm={2}
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "flex-start",
            }}
          >
            {collection && (
              <OrganizationLogo
                logo={collection.findIcon()}
                sx={{
                  height: isMobile ? "50px" : "80px",
                  paddingX: padding.extraSmall,
                }}
                defaultImageSrc={imosLogoWithTitle}
              />
            )}
          </Grid>
        </Grid>
      </Paper>
      <Paper
        aria-label="share button"
        elevation={3}
        sx={{
          backgroundColor: "white",
          borderRadius: borderRadius.small,
        }}
      >
        <ShareButtonMenu menuItems={shareItems} onClose={resetCopyState} />
      </Paper>
    </Box>
  );
};

export default HeaderSection;
