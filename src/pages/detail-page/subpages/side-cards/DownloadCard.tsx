import { useState } from "react";
import {
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Divider,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import {
  border,
  borderRadius,
  color,
  fontColor,
  fontWeight,
  padding,
} from "../../../../styles/constants";
import PlainAccordion from "../../../../components/common/accordion/PlainAccordion";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CommonSelect from "../../../../components/common/dropdown/CommonSelect";
import { selects } from "../tab-panels/AbstractAndDownloadPanel";

const DownloadCard = () => {
  const theme = useTheme();
  const [accordionExpanded, setAccordionExpanded] = useState<boolean>(false);

  const selectSxProps = {
    height: "30px",
    textAlign: "start",
    backgroundColor: "transparent",
    boxShadow: theme.shadows[5],
    border: `${border.xs} ${color.blue.dark}`,
  };

  return (
    <Stack direction="column">
      <Stack sx={{ padding: padding.medium }} spacing={2}>
        <CommonSelect
          items={selects.download.selectOptions}
          sxProps={selectSxProps}
        />
        <Button
          sx={{
            backgroundColor: theme.palette.primary.main,
            borderRadius: borderRadius.small,
            ":hover": {
              backgroundColor: theme.palette.primary.main,
            },
          }}
        >
          <Typography padding={0} color="#fff">
            Download
          </Typography>
        </Button>
      </Stack>
      <Divider sx={{ width: "100%" }} />
      <PlainAccordion
        expanded={accordionExpanded}
        elevation={0}
        onChange={() => setAccordionExpanded((prevState) => !prevState)}
      >
        <AccordionSummary
          sx={{ paddingX: padding.medium }}
          expandIcon={<ExpandMoreIcon />}
        >
          <Typography
            fontWeight={fontWeight.bold}
            color={fontColor.gray.medium}
            sx={{ padding: 0 }}
          >
            Download Subset
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          TODO: simple version of download subset
        </AccordionDetails>
      </PlainAccordion>
    </Stack>
  );
};

export default DownloadCard;
