import { Box, Typography } from "@mui/material";
import {
  fontSize,
  fontFamily,
  fontWeight,
  fontColor,
  lineHeight,
} from "../../styles/constants";
import { useCallback, useMemo } from "react";
import CopyButton from "../../components/common/buttons/CopyButton";
import { useDetailPageContext } from "../../pages/detail-page/context/detail-page-context";
import { ContentCopy } from "@mui/icons-material";
import { ContentCopyIcon } from "../../assets/icons/content_copy";

const LicenseContent = () => {
  const { checkIfCopied, copyToClipboard } = useDetailPageContext();
  const context = useDetailPageContext();

  const citationText = useMemo(
    () =>
      context.collection?.getCitation()?.suggestedCitation ||
      "IMOS [year-of-data-downloaded], [Title], [data-access-url], accessed [date-of-access]",
    [context.collection]
  );

  const isCopied = useMemo(
    () => checkIfCopied(citationText),
    [checkIfCopied, citationText]
  );

  const handleCopy = useCallback(async () => {
    await copyToClipboard(citationText);
  }, [copyToClipboard, citationText]);

  const commonBodyStyles = {
    color: fontColor.gray.dark,
    fontFamily: fontFamily.openSans,
    fontSize: fontSize.info,
    lineHeight: lineHeight.body,
  };

  const headingStyles = {
    color: fontColor.gray.extraDark,
    fontFamily: fontFamily.openSans,
    fontWeight: fontWeight.bold,
    lineHeight: lineHeight.heading,
    mb: "12px",
  };

  return (
    <>
      <Typography
        variant="h6"
        gutterBottom
        sx={{
          ...headingStyles,
        }}
      >
        Licence
      </Typography>

      <Box sx={{ display: "flex", alignItems: "flex-start" }}>
        <Box sx={{ mr: 2, flex: 1 }}>
          <Typography
            variant="body2"
            sx={{
              ...commonBodyStyles,
              mb: 0.5,
            }}
          >
            Creative Commons Attribution 4.0 International License
          </Typography>
          <Box
            component="a"
            href="https://creativecommons.org/licenses/by/4.0/"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              ...commonBodyStyles,
              color: fontColor.blue.medium, // Override the common color
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
            width: "88px",
            height: "31px",
            flexShrink: 0,
          }}
        />
      </Box>

      <Typography
        variant="h6"
        gutterBottom
        sx={{
          ...headingStyles,
          mt: "24px",
        }}
      >
        Usage Constraints
      </Typography>

      <Typography
        variant="body2"
        sx={{
          ...commonBodyStyles,
          mb: 2,
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

      <Typography variant="body2" sx={commonBodyStyles}>
        If using data from the Ningaloo (TAN100) mooring, please add to the
        citation - &quot;Department of Jobs, Tourism, Science and Innovation
        (DJTSI), Western Australian Government&quot;.
      </Typography>

      <Typography variant="body2" sx={commonBodyStyles}>
        If using data from the Ocean Reference Station 65m (ORS065) mooring,
        please add to the citation - &quot;Sydney Water Corporation&quot;.
      </Typography>

      <Typography variant="body2" sx={commonBodyStyles}>
        Data, products and services from IMOS are provided &quot;as is&quot;
        without any warranty as to fitness for a particular purpose.
      </Typography>

      <Typography variant="body2" sx={commonBodyStyles}>
        By using this data you are accepting the license agreement and terms
        specified above. You accept all risks and responsibility for losses,
        damages, costs and other consequences resulting directly or indirectly
        from using this site and any information or material available from it.
      </Typography>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          mt: "24px",
          mb: "12px",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            ...headingStyles,
            mb: 0,
          }}
        >
          Suggested Citation
        </Typography>

        <CopyButton
          handleClick={handleCopy}
          hasBeenCopied={isCopied}
          copyText={citationText}
          copyButtonConfig={{
            iconBeforeCopy: <ContentCopyIcon />,
            textBeforeCopy: "",
            textAfterCopy: "",
          }}
          sx={{
            border: "none",
            "&:hover": {
              border: "none",
            },
            width: "32px",
            minWidth: "32px",
            height: "32px",
            px: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            "& .MuiTypography-root": {
              display: "none",
            },
          }}
        />
      </Box>

      <Box>
        <Typography variant="body2" sx={commonBodyStyles}>
          {citationText}
        </Typography>
      </Box>
    </>
  );
};

export default LicenseContent;
