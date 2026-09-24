import { Box, Typography } from "@mui/material";
import { useMemo } from "react";
import CopyButton from "../../../../../components/common/buttons/CopyButton";
import { useDetailPageContext } from "../../../context/detail-page-context";
import { portalTheme } from "../../../../../styles";
import { trackCustomEvent } from "../../../../../analytics/customEventTracker";
import { AnalyticsEvent } from "../../../../../analytics/analyticsEvents";
import { resolveSuggestedCitation } from "@/utils/CitationUtils";
import { MediaType, RelationType } from "@/app/store/OGCCollectionDefinitions";

const IMOS_FALLBACK_CITATION =
  "IMOS [year-of-data-downloaded], [Title], [data-access-url], accessed [date-of-access]";
const EXTERNAL_FALLBACK_CITATION =
  "[Title], [data-access-url], accessed [date-of-access]";

const IMOS_USAGE_CONSTRAINTS = [
  `Any users of IMOS data are required to clearly acknowledge the source of
the material derived from IMOS in the format: "Data was sourced from
Australia's Integrated Marine Observing System (IMOS) - IMOS is enabled by the
National Collaborative Research Infrastructure strategy (NCRIS)." If relevant,
also credit other organisations involved in collection of this particular
datastream (as listed in 'credit' in the metadata record).`,
  `If using data from the Ningaloo (TAN100) mooring, please add to the citation -
"Department of Jobs, Tourism, Science and Innovation (DJTSI), Western
Australian Government".`,
  `If using data from the Ocean Reference Station 65m (ORS065) mooring, please
add to the citation - "Sydney Water Corporation".`,
  `Data, products and services from IMOS are provided "as is" without any
warranty as to fitness for a particular purpose.`,
  `By using this data you are accepting the licence agreement and terms
specified above. You accept all risks and responsibility for losses, damages,
costs and other consequences resulting directly or indirectly from using this
site and any information or material available from it.`,
];

const LicenseStep = () => {
  const context = useDetailPageContext();

  const collection = context.collection;
  const isImosOnly = collection?.isImosOnly() ?? false;
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

    if (metadataConstraints.length > 0) {
      return Array.from(new Set(metadataConstraints));
    }

    return isImosOnly ? IMOS_USAGE_CONSTRAINTS : [];
  }, [collection, isImosOnly, license]);

  const citationText = useMemo(() => {
    const suggestedCitation = collection?.getCitation()?.suggestedCitation;
    return resolveSuggestedCitation(
      suggestedCitation ||
        (isImosOnly ? IMOS_FALLBACK_CITATION : EXTERNAL_FALLBACK_CITATION),
      collection?.id,
      collection?.title
    );
  }, [collection, isImosOnly]);

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
            {license ||
              "No licence information is provided in this dataset's metadata."}
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

        <CopyButton
          copyText={citationText}
          copyButtonConfig={{
            // Track copy citation button click
            onCopy: () => trackCustomEvent(AnalyticsEvent.COPY_CITATION_CLICK),
          }}
        />
      </Box>

      <Box>
        <Typography
          variant="body2Regular"
          sx={{ color: portalTheme.palette.text1 }}
        >
          {citationText}
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
          No usage constraints are provided in this dataset&apos;s metadata.
        </Typography>
      )}
    </Box>
  );
};

export default LicenseStep;
