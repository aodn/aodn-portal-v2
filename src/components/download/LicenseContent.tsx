import { Box, Typography } from "@mui/material";
import {
  fontSize,
  fontFamily,
  fontWeight,
  fontColor,
  lineHeight,
} from "../../styles/constants";

const LicenseContent = () => {
  return (
    <>
      <Typography
        variant="h6"
        gutterBottom
        sx={{
          color: fontColor.gray.extraDark,
          fontFamily: fontFamily.openSans,
          fontWeight: fontWeight.bold,
          lineHeight: lineHeight.heading,
        }}
      >
        Licence
      </Typography>

      <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
        <Box sx={{ mr: 2 }}>
          <Typography
            variant="body2"
            sx={{
              color: fontColor.gray.dark,
              fontFamily: fontFamily.openSans,
              fontSize: fontSize.info,
              lineHeight: lineHeight.body,
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
              color: fontColor.blue.medium,
              fontFamily: fontFamily.openSans,
              fontSize: fontSize.info,
              lineHeight: lineHeight.body,
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
            width: "115px",
            height: "41px",
            flexShrink: 0,
          }}
        />
      </Box>

      <Typography
        variant="h6"
        gutterBottom
        sx={{
          color: fontColor.gray.extraDark,
          fontFamily: fontFamily.openSans,
          fontWeight: fontWeight.bold,
          lineHeight: lineHeight.heading,
        }}
      >
        Usage Constrains
      </Typography>

      <Typography
        variant="body2"
        sx={{
          color: fontColor.gray.dark,
          fontFamily: fontFamily.openSans,
          fontSize: fontSize.info,
          lineHeight: lineHeight.body,
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

      <Typography
        variant="body2"
        sx={{
          color: fontColor.gray.dark,
          fontFamily: fontFamily.openSans,
          fontSize: fontSize.info,
          lineHeight: lineHeight.body,
          mb: 2,
        }}
      >
        If using data from the Ningaloo (TAN100) mooring, please add to the
        citation - &quot;Department of Jobs, Tourism, Science and Innovation
        (DJTSI), Western Australian Government&quot;.
      </Typography>

      <Typography
        variant="body2"
        sx={{
          color: fontColor.gray.dark,
          fontFamily: fontFamily.openSans,
          fontSize: fontSize.info,
          lineHeight: lineHeight.body,
          mb: 2,
        }}
      >
        If using data from the Ocean Reference Station 65m (ORS065) mooring,
        please add to the citation - &quot;Sydney Water Corporation&quot;.
      </Typography>

      <Typography
        variant="body2"
        sx={{
          color: fontColor.gray.dark,
          fontFamily: fontFamily.openSans,
          fontSize: fontSize.info,
          lineHeight: lineHeight.body,
          mb: 2,
        }}
      >
        Data, products and services from IMOS are provided &quot;as is&quot;
        without any warranty as to fitness for a particular purpose.
      </Typography>

      <Typography
        variant="body2"
        sx={{
          color: fontColor.gray.dark,
          fontFamily: fontFamily.openSans,
          fontSize: fontSize.info,
          lineHeight: lineHeight.body,
          mb: 2,
        }}
      >
        By using this data you are accepting the license agreement and terms
        specified above. You accept all risks and responsibility for losses,
        damages, costs and other consequences resulting directly or indirectly
        from using this site and any information or material available from it.
      </Typography>
    </>
  );
};

export default LicenseContent;
