import { Box, Typography } from "@mui/material";
import { useMemo } from "react";
import CopyButton from "../../components/common/buttons/CopyButton";
import { useDetailPageContext } from "../../pages/detail-page/context/detail-page-context";
import rc8Theme from "../../styles/themeRC8";
import { trackCustomEvent } from "../../analytics/customEventTracker";
import { AnalyticsEvent } from "../../analytics/analyticsEvents";

const LicenseContent = () => {
  const context = useDetailPageContext();

  const citationText = useMemo(
    () =>
      context.collection?.getCitation()?.suggestedCitation ||
      "IMOS [year-of-data-downloaded], [Title], [data-access-url], accessed [date-of-access]",
    [context.collection]
  );

  const commonBodyStyles = {
    color: rc8Theme.palette.text2,
    display: "block",
  };

  const headingStyles = {
    color: rc8Theme.palette.text1,
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
            Creative Commons Attribution 4.0 International License
          </Typography>
          <Box
            component="a"
            href="https://creativecommons.org/licenses/by/4.0/"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              ...commonBodyStyles,
              color: rc8Theme.palette.primary1,
              textDecoration: "none",
              display: "block",
              "&:hover": {
                textDecoration: "underline",
              },
            }}
          >
            http://creativecommons.org/licenses/by/4.0/
          </Box>
        </Box>
        <Box
          component="img"
          src="https://licensebuttons.net/l/by/4.0/88x31.png"
          alt="Creative Commons License"
          sx={{
            width: "120px",
            height: "42px",
            alignSelf: { xs: "flex-start", sm: "auto" },
          }}
        />
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
          sx={{ color: rc8Theme.palette.text1 }}
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

      <Typography
        variant="body2Regular"
        sx={{
          ...commonBodyStyles,
          mb: "22px",
        }}
      >
        Any users of IMOS data are required to clearly acknowledge the source of
        the material derived from IMOS in the format: &quot;Data was sourced
        from Australia&apos;s Integrated Marine Observing System (IMOS) - IMOS
        is enabled by the National Collaborative Research Infrastructure
        strategy (NCRIS).&quot; If relevant, also credit other organisations
        involved in collection of this particular datastream (as listed in
        &apos;credit&apos; in the metadata record).
      </Typography>

      <Typography variant="body2Regular" sx={commonBodyStyles}>
        If using data from the Ningaloo (TAN100) mooring, please add to the
        citation - &quot;Department of Jobs, Tourism, Science and Innovation
        (DJTSI), Western Australian Government&quot;.
      </Typography>

      <Typography variant="body2Regular" sx={commonBodyStyles}>
        If using data from the Ocean Reference Station 65m (ORS065) mooring,
        please add to the citation - &quot;Sydney Water Corporation&quot;.
      </Typography>

      <Typography variant="body2Regular" sx={commonBodyStyles}>
        Data, products and services from IMOS are provided &quot;as is&quot;
        without any warranty as to fitness for a particular purpose.
      </Typography>

      <Typography variant="body2Regular" sx={commonBodyStyles}>
        By using this data you are accepting the license agreement and terms
        specified above. You accept all risks and responsibility for losses,
        damages, costs and other consequences resulting directly or indirectly
        from using this site and any information or material available from it.
      </Typography>
    </Box>
  );
};

export default LicenseContent;
