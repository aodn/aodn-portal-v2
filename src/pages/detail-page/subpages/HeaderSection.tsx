import { FC, ReactNode, useCallback, useMemo } from "react";
import { useLocation } from "react-router-dom";
import {
  Box,
  Grid,
  Paper,
  Stack,
  SxProps,
  Tooltip,
  Typography,
} from "@mui/material";
import ReplyIcon from "@mui/icons-material/Reply";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import { useDetailPageContext } from "../context/detail-page-context";
import imosLogoWithTitle from "@/assets/logos/imos_logo_with_title.png";
import OrganizationLogo from "../../../components/logo/OrganizationLogo";
import useRedirectSearch from "../../../hooks/useRedirectSearch";
import useBreakpoint from "../../../hooks/useBreakpoint";
import useRedirectHome from "../../../hooks/useRedirectHome";
import {
  border,
  borderRadius,
  color,
  fontSize,
  padding,
} from "../../../styles/constants";
import ShareButtonMenu from "../../../components/menu/ShareButtonMenu";
import DataUsageIcon from "@mui/icons-material/DataUsage";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import { pageReferer } from "../../../components/common/constants";
import { capitalizeFirstLetter } from "../../../utils/StringUtils";
import rc8Theme from "../../../styles/themeRC8";
import InfoCard from "../../../components/info/InfoCard";
import { InfoStatusType } from "../../../components/info/InfoDefinition";

enum Status {
  onGoing = "onGoing",
  completed = "completed",
}

interface HeaderButtonProps {
  children: ReactNode;
  onClick?: () => void;
  sx?: SxProps;
}

const HeaderButton: FC<HeaderButtonProps> = ({ children, onClick, sx }) => (
  <Paper
    elevation={3}
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: borderRadius.small,
      cursor: "pointer",
      minWidth: "40px",
      minHeight: "40px",
      height: { xs: "auto", sm: "100%" },
      ...sx,
    }}
    onClick={onClick}
  >
    {children}
  </Paper>
);

const renderGoBackButton = (onClick: () => void, referer: string) => {
  const tip =
    referer !== pageReferer.SEARCH_PAGE_REFERER
      ? "Back to Home"
      : "Return to search results";
  return (
    <Box
      aria-label="go-back button"
      sx={{
        position: { xs: "unset", md: "absolute" },
        left: { xs: "unset", md: "-50px" },
        top: { xs: "unset", md: "5%" },
      }}
      onClick={onClick}
      data-testid="return-button"
    >
      <HeaderButton>
        <Tooltip title={tip} placement="top">
          <ReplyIcon
            sx={{
              color: color.brightBlue.dark,
            }}
          />
        </Tooltip>
      </HeaderButton>
    </Box>
  );
};

const renderShareButton = ({ hideText }: { hideText: boolean }) => (
  <HeaderButton>
    <ShareButtonMenu hideText={hideText} />
  </HeaderButton>
);

const RoundCard = ({ children, sx }: { children: ReactNode; sx: SxProps }) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        maxHeight: "30px",
        borderRadius: borderRadius.small,
        padding: padding.extraSmall,
        ...sx,
      }}
    >
      {children}
    </Box>
  );
};

const renderOnGoingStatus = () => (
  <RoundCard sx={{ border: `${border.xs} ${color.success.main}` }}>
    <DataUsageIcon sx={{ fontSize: "16px" }} color="success" />
    <Typography
      padding={0}
      paddingX={padding.extraSmall}
      fontSize={fontSize.label}
      color={color.success.main}
    >
      On Going
    </Typography>
  </RoundCard>
);

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
      paddingX={padding.extraSmall}
      variant="title1Medium"
      color={rc8Theme.palette.text1}
    >
      Completed
    </Typography>
  </RoundCard>
);

const renderSubTitle = (
  pace: string | undefined,
  startDate: string | undefined,
  endDate: string | undefined,
  status: string | undefined
) => (
  <Stack flexDirection="row" flexWrap="wrap" gap={1}>
    {pace &&
      pace.toLowerCase() !== "other" &&
      !(pace.toLowerCase() === "completed" && status === Status.completed) && (
        <RoundCard
          sx={{
            bgcolor: color.pace,
          }}
        >
          <Typography
            padding={0}
            variant="title1Medium"
            color={rc8Theme.palette.text1}
          >
            {capitalizeFirstLetter(pace)}
          </Typography>
        </RoundCard>
      )}
    {startDate && (
      <RoundCard
        sx={{
          border: `${border.xs} ${color.gray.extraLight}`,
          backgroundColor: color.blue.extraLightSemiTransparent,
        }}
      >
        <Typography
          padding={0}
          paddingRight={padding.small}
          variant="title1Medium"
          color={rc8Theme.palette.text1}
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
            variant="title1Medium"
            color={rc8Theme.palette.text1}
          >
            {endDate}
          </Typography>
        )}
      </RoundCard>
    )}
    {status && status === Status.completed
      ? renderCompletedStatus()
      : renderOnGoingStatus()}
  </Stack>
);

const HeaderSection = () => {
  const location = useLocation();
  const { isUnderLaptop, isTablet, isMobile } = useBreakpoint();
  const { collection, isCollectionNotFound } = useDetailPageContext();
  const redirectHome = useRedirectHome();
  const redirectSearch = useRedirectSearch();

  const [title, pace, status, startDate, endDate] = useMemo(() => {
    const title = collection?.title;
    const pace = collection?.getPace();
    const status = collection?.getStatus();
    const extent = collection?.getExtent();

    let startDate = undefined;
    let endDate = undefined;
    if (extent) {
      const [s, e] = extent.getOverallTemporal();
      startDate = s;
      endDate = e;
    }

    return [title, pace, status, startDate, endDate];
  }, [collection]);

  const onGoBack = useCallback(
    (referer: string) => {
      if (referer !== pageReferer.SEARCH_PAGE_REFERER) {
        redirectHome(pageReferer.DETAIL_PAGE_REFERER, true);
      } else {
        redirectSearch(pageReferer.DETAIL_PAGE_REFERER, true, false);
      }
    },
    [redirectHome, redirectSearch]
  );

  const referer = useMemo(
    () => location.state?.referer,
    [location.state?.referer]
  );
  return (
    <Box
      display="flex"
      flexDirection={{ xs: "column", sm: "row" }}
      gap={1}
      width="100%"
      height="100%"
    >
      {isMobile && (
        <Stack
          direction="row"
          gap={1}
          justifyContent="space-between"
          width="100%"
        >
          {renderGoBackButton(() => onGoBack(referer), referer)}
          {!isCollectionNotFound &&
            renderShareButton({
              hideText: isMobile,
            })}
        </Stack>
      )}
      <Paper
        aria-label="header"
        elevation={3}
        sx={{
          position: "relative",
          padding: isCollectionNotFound ? 0 : padding.medium,
          backgroundColor: "white",
          borderRadius: borderRadius.small,
          flex: 1,
        }}
      >
        {!isUnderLaptop && renderGoBackButton(() => onGoBack(referer), referer)}
        {isCollectionNotFound && (
          <InfoCard
            infoContent={{
              body: "There is no matching record. Please return to the search page.",
            }}
            status={InfoStatusType.ERROR}
            sx={{ boxShadow: "unset", width: "100%", height: "140px" }} // Fixed height as per design
            contentSx={{
              padding: 0,
              px: 2,
              textAlign: "center",
              ...rc8Theme.typography.title1Medium,
            }}
          />
        )}
        {!isCollectionNotFound && (
          <Grid container spacing={1}>
            <Grid
              item
              xs={12}
              sm={10}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "start",
                flexDirection: "column",
              }}
              gap={isMobile ? 0 : 1}
            >
              <Typography
                variant="heading3"
                aria-label="collection title"
                color={rc8Theme.palette.text2}
                sx={{
                  p: 0,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: "3",
                  WebkitBoxOrient: "vertical",
                }}
              >
                {title}
              </Typography>
              {!isMobile && renderSubTitle(pace, startDate, endDate, status)}
            </Grid>
            <Grid
              item
              xs={4}
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
            {isMobile && (
              <Grid item xs={8} sm={12}>
                {renderSubTitle(pace, startDate, endDate, status)}
              </Grid>
            )}
          </Grid>
        )}
      </Paper>
      {isTablet && (
        <Box display="flex" flexDirection="column" gap={1}>
          {renderGoBackButton(() => onGoBack(referer), referer)}
          {!isCollectionNotFound &&
            renderShareButton({
              hideText: isMobile,
            })}
        </Box>
      )}
      {!isUnderLaptop && !isCollectionNotFound && (
        <Box height="100%">
          {renderShareButton({
            hideText: isMobile,
          })}
        </Box>
      )}
    </Box>
  );
};

export default HeaderSection;
