import { FC, ReactNode, useCallback, useMemo, useState } from "react";
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
import { useDetailPageContext } from "../context/detail-page-context";
import imosLogoWithTitle from "@/assets/logos/imos_logo_with_title.png";
import OrganizationLogo from "../../../components/icon/OrganizationLogo";
import useRedirectSearch from "../../../hooks/useRedirectSearch";
import useBreakpoint from "../../../hooks/useBreakpoint";
import useRedirectHome from "../../../hooks/useRedirectHome";
import {
  border,
  borderRadius,
  color,
  fontColor,
  fontSize,
  fontWeight,
  padding,
} from "@/styles/constants";
import ShareButtonMenu from "../../../components/menu/ShareButtonMenu";
import DataUsageIcon from "@mui/icons-material/DataUsage";
import { TemporalIcon } from "@/assets/icons/details/temporal";
import { pageReferer } from "@/components/common/constants";
import { portalTheme } from "../../../styles";
import InfoCard from "../../../components/info/InfoCard";
import { InfoStatusType } from "@/components/info/InfoDefinition";
import { DataTestId } from "@/components/map/mapbox/constants";
import { ReplyIcon } from "@/assets/icons/details/back";
import LabelChip from "../../../components/common/label/LabelChip";
import AIGenStarIcon from "../../../components/icon/AIGenStarIcon";

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
      borderRadius: "8px",
      cursor: "pointer",
      minWidth: { xs: "40px", md: "30px", lg: "40px" },
      minHeight: { xs: "40px", md: "30px", lg: "40px" },
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
        left: { xs: "unset", md: "-42px", lg: "-50px" },
        top: { xs: "unset", md: "5%" },
      }}
      onClick={onClick}
      data-testid={DataTestId.HeaderSection.ReturnButton}
    >
      <HeaderButton>
        <Tooltip title={tip} placement="top">
          <ReplyIcon />
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

const renderAiFrequencyTooltip = () => (
  <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
    <AIGenStarIcon
      color={portalTheme.palette.primary1}
      width={20}
      height={20}
    />
    <Typography
      sx={{
        ...portalTheme.typography.body2Regular,
        width: "153px",
        height: "46px",
        color: portalTheme.palette.text1,
        padding: 0,
      }}
    >
      The data status is grouped by AI models.
    </Typography>
  </Box>
);

const renderSubTitle = (
  startDate: string | undefined,
  endDate: string | undefined,
  scope: string | undefined,
  aiUpdateFrequency: string | undefined,
  isSmallMobile: boolean
) => (
  <Stack flexDirection="row" flexWrap="wrap" gap={1}>
    {startDate && (
      <RoundCard
        sx={{
          backgroundColor: "transparent",
        }}
      >
        <Typography
          padding={0}
          paddingRight={padding.small}
          variant="title1Medium"
          color={portalTheme.palette.text1}
          sx={{ fontSize: isSmallMobile ? "14px" : undefined }}
        >
          {startDate}
        </Typography>
        {endDate && (
          <>
            <TemporalIcon
              color={color.gray.light}
              width={fontSize.label}
              height={fontSize.label}
            />
            <Typography
              padding={0}
              paddingLeft={padding.small}
              variant="title1Medium"
              color={portalTheme.palette.text1}
              sx={{ fontSize: isSmallMobile ? "14px" : undefined }}
            >
              {endDate}
            </Typography>
          </>
        )}
      </RoundCard>
    )}
    {!startDate && !endDate && renderOnGoingStatus()}
    {scope && scope.toLowerCase() === "document" && (
      <RoundCard sx={{ backgroundColor: `${color.success.light}` }}>
        <LabelChip
          text={["Document"]}
          color={color.success.light}
          sx={{
            padding: 0,
            paddingX: padding.extraSmall,
            ...portalTheme.typography.title1Medium,
            color: fontColor.black.dark,
            fontWeight: fontWeight.regular,
          }}
        />
      </RoundCard>
    )}
    {aiUpdateFrequency &&
      aiUpdateFrequency.toLowerCase() !== "other" &&
      aiUpdateFrequency.toLowerCase() !== "completed" &&
      // parse 'both' into ['real-time', 'delayed'], render one chip per frequency
      (aiUpdateFrequency.toLowerCase() === "both"
        ? ["real-time", "delayed"]
        : [aiUpdateFrequency]
      ).map((freq, index) => (
        <Tooltip
          key={index}
          title={renderAiFrequencyTooltip()}
          placement="right-end"
          enterDelay={100}
          enterTouchDelay={0}
          slotProps={{
            popper: {
              modifiers: [{ name: "flip", enabled: false }],
            },
            tooltip: {
              sx: {
                maxWidth: "250px",
                padding: "9px",
                backgroundColor: "common.white",
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.25)",
              },
            },
          }}
        >
          <Box
            component="span"
            sx={{ display: "inline-flex" }}
            data-testid={DataTestId.HeaderSection.AiUpdateFrequencyChip}
          >
            <LabelChip
              text={[freq]}
              color={
                freq.toLowerCase() === "real-time"
                  ? portalTheme.palette.tag1
                  : portalTheme.palette.tag2
              }
              startIcon={
                <AIGenStarIcon
                  color={fontColor.blue.header}
                  width={16}
                  height={16}
                />
              }
              sx={{
                display: "flex",
                padding: "4px 16px 4px 10px",
                justifyContent: "center",
                alignItems: "center",
                gap: "8px",
                ...portalTheme.typography.title1Medium,
                color: portalTheme.palette.text1,
              }}
            />
          </Box>
        </Tooltip>
      ))}
  </Stack>
);

const HeaderSection = () => {
  const location = useLocation();
  const { isUnderLaptop, isTablet, isMobile, isSmallMobile } = useBreakpoint();
  const { collection, isCollectionNotFound } = useDetailPageContext();
  const redirectHome = useRedirectHome();
  const redirectSearch = useRedirectSearch();

  const [title, startDate, endDate, scope, aiUpdateFrequency] = useMemo(() => {
    const title = collection?.title;
    const extent = collection?.getExtent();
    const scope = collection?.getScope();
    const aiUpdateFrequency = collection?.getAiUpdateFrequency();

    let startDate = undefined;
    let endDate = undefined;
    if (extent) {
      const [s, e] = extent.getOverallTemporal();
      startDate = s;
      endDate = e;
    }

    return [title, startDate, endDate, scope, aiUpdateFrequency];
  }, [collection]);

  // Capture the referer only on first mount (lazy useState init runs once).
  // In-page navigations (main tabs or side-card "open" arrows) call navigate()
  // with a new location.state and would otherwise overwrite this — e.g.
  // Citation/Data Access side cards pass DETAIL_PAGE_REFERER, which made
  // "back" go to the landing page.
  const [initialReferer] = useState<string | undefined>(
    () => location.state?.referer
  );

  const onGoBack = useCallback(() => {
    if (initialReferer === pageReferer.SEARCH_PAGE_REFERER) {
      redirectSearch(pageReferer.DETAIL_PAGE_REFERER, true, false);
    } else {
      redirectHome(pageReferer.DETAIL_PAGE_REFERER, true);
    }
  }, [initialReferer, redirectHome, redirectSearch]);
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
          {renderGoBackButton(onGoBack, initialReferer ?? "")}
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
        {!isUnderLaptop && renderGoBackButton(onGoBack, initialReferer ?? "")}
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
              ...portalTheme.typography.title1Medium,
            }}
          />
        )}
        {!isCollectionNotFound && (
          <Grid container spacing={1}>
            <Grid
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "start",
                flexDirection: "column",
              }}
              gap={isMobile ? 0 : 1}
              size={{
                xs: 12,
                sm: 10,
              }}
            >
              {/* The collection title is the page's h1 (SEO); component only
                  changes the tag, not the styling. No aria-label here — it
                  would override the title as the heading's accessible name.
                  Carries a test id because it is not the only h1 on the page:
                  MarkdownRenderer also emits one per `#` in a description, so
                  selecting this by heading level is ambiguous */}
              <Typography
                variant="heading3"
                component="h1"
                data-testid={DataTestId.HeaderSection.PageTitle}
                color={portalTheme.palette.text2}
                sx={{
                  p: 0,
                }}
              >
                {title}
              </Typography>
              {!isMobile &&
                renderSubTitle(
                  startDate,
                  endDate,
                  scope,
                  aiUpdateFrequency,
                  isSmallMobile
                )}
            </Grid>
            <Grid
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "flex-start",
              }}
              size={{
                xs: 4,
                sm: 2,
              }}
            >
              {collection && (
                <OrganizationLogo
                  logo={collection.findIcon()}
                  sx={{
                    height: isMobile ? "56px" : "80px",
                    paddingX: padding.extraSmall,
                  }}
                  defaultImageSrc={imosLogoWithTitle}
                />
              )}
            </Grid>
            {isMobile && (
              <Grid
                size={{
                  xs: 8,
                  sm: 12,
                }}
              >
                {renderSubTitle(
                  startDate,
                  endDate,
                  scope,
                  aiUpdateFrequency,
                  isSmallMobile
                )}
              </Grid>
            )}
          </Grid>
        )}
      </Paper>
      {isTablet && (
        <Box display="flex" flexDirection="column" gap={1}>
          {renderGoBackButton(onGoBack, initialReferer ?? "")}
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
