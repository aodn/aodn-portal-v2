import { Box, Typography } from "@mui/material";
import { useMemo } from "react";
import CopyButton from "../../../../../components/common/buttons/CopyButton";
import { useDetailPageContext } from "../../../context/detail-page-context";
import { portalTheme } from "../../../../../styles";
import { trackCustomEvent } from "../../../../../analytics/customEventTracker";
import { AnalyticsEvent } from "../../../../../analytics/analyticsEvents";
import { resolveSuggestedCitation } from "@/utils/CitationUtils";
import { MediaType, RelationType } from "@/app/store/OGCCollectionDefinitions";

const LicenseStep = () => {
  const context = useDetailPageContext();

  const collection = context.collection;
  const license = collection?.getLicense();
  const licenseUrl = collection?.links?.find(
    (link) =>
      link.rel === RelationType.LICENSE && link.type === MediaType.TEXT_HTML
  )?.href;
  const licenseGraphic = collection?.links?.find(
    (link) =>
      link.rel === RelationType.LICENSE && link.type === MediaType.IMAGE_PNG
  )?.href;

  const usageConstraints = useMemo(() => {
    const citation = collection?.getCitation();
    const metadataConstraints = [
      ...(citation?.useLimitations ?? []),
      ...(citation?.otherConstraints ?? []).filter(
        (constraint) =>
          constraint.toLowerCase().trim() !== license?.toLowerCase().trim()
      ),
    ].filter(Boolean);

    return Array.from(new Set(metadataConstraints));
  }, [collection, license]);

  const citationText = useMemo(() => {
    const suggestedCitation = collection?.getCitation()?.suggestedCitation;
    return suggestedCitation
      ? resolveSuggestedCitation(
          suggestedCitation,
          collection?.id,
          collection?.title
        )
      : "";
  }, [collection]);

  const commonBodyStyles = {
    color: portalTheme.palette.text2,
    display: "block",
  };

  const headingStyles = {
    color: portalTheme.palette.text1,
    display: "block",
    mb: "12px",
  };

  return (
    <Box sx={{ mx: "6px" }}>
      <Typography
        variant="title1Medium"
        sx={{
          ...headingStyles,
        }}
      >
        Licence
      </Typography>

      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          flexDirection: { xs: "column", sm: "row" },
          gap: { xs: 2, sm: 0 },
        }}
      >
        <Box
          sx={{
            mr: { xs: 0, sm: 2 },
            flex: 1,
          }}
        >
          <Typography variant="body2Regular" sx={commonBodyStyles}>
            {license || "License not available"}
          </Typography>
          {licenseUrl && (
            <Box
              component="a"
              href={licenseUrl}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                ...commonBodyStyles,
                color: portalTheme.palette.primary1,
                textDecoration: "none",
                display: "block",
                whiteSpace: "normal",
                wordBreak: "break-all",
                overflowWrap: "anywhere",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              {licenseUrl}
            </Box>
          )}
        </Box>
        {licenseGraphic && (
          <Box
            component="img"
            src={licenseGraphic}
            alt="Licence graphic"
            sx={{
              maxWidth: "120px",
              height: "auto",
              alignSelf: { xs: "flex-start", sm: "auto" },
            }}
          />
        )}
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          mt: "20px",
          mb: "12px",
        }}
      >
        <Typography
          variant="title1Medium"
          sx={{
            ...headingStyles,
            mb: 0,
          }}
        >
          Suggested Citation
        </Typography>

        {citationText && (
          <CopyButton
            copyText={citationText}
            copyButtonConfig={{
              // Track copy citation button click
              onCopy: () =>
                trackCustomEvent(AnalyticsEvent.COPY_CITATION_CLICK),
            }}
          />
        )}
      </Box>

      <Box>
        <Typography
          variant="body2Regular"
          sx={{ color: portalTheme.palette.text1 }}
        >
          {citationText || "Suggested Citation not available"}
        </Typography>
      </Box>

      <Typography
        variant="title1Medium"
        gutterBottom
        sx={{
          ...headingStyles,
          mt: "28px",
        }}
      >
        Usage Constraints
      </Typography>

      {usageConstraints.length > 0 ? (
        usageConstraints.map((constraint) => (
          <Typography
            key={constraint}
            variant="body2Regular"
            sx={{ ...commonBodyStyles, mb: "12px" }}
          >
            {constraint}
          </Typography>
        ))
      ) : (
        <Typography variant="body2Regular" sx={commonBodyStyles}>
          Usage Constraints not available
        </Typography>
      )}
    </Box>
  );
};

export default LicenseStep;
