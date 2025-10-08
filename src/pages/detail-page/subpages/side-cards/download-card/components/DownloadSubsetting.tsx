import { FC, useMemo, useState } from "react";
import {
  AccordionDetails,
  AccordionSummary,
  Badge,
  Box,
  Divider,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PlainAccordion from "../../../../../../components/common/accordion/PlainAccordion";
import rc8Theme from "../../../../../../styles/themeRC8";
import {
  DownloadCondition,
  DownloadConditionType,
} from "../../../../context/DownloadDefinitions";
import DataSelection from "../../../../../../components/download/DataSelection";
import InfoMessage from "./InfoMessage";

interface DownloadSubsettingProps extends DownloadCondition {
  hideInfoMessage?: boolean;
}

const DownloadSubsetting: FC<DownloadSubsettingProps> = ({
  hideInfoMessage = false,
  downloadConditions,
  getAndSetDownloadConditions,
  removeDownloadCondition,
}) => {
  const [accordionExpanded, setAccordionExpanded] = useState<boolean>(true);
  // Store the filtered download conditions count
  const subsettingSelectionCount = useMemo(() => {
    return downloadConditions.filter(
      (condition) => condition.type !== DownloadConditionType.FORMAT
    ).length;
  }, [downloadConditions]);

  return (
    <>
      {!hideInfoMessage && subsettingSelectionCount === 0 && (
        <InfoMessage
          infoText="Please consider subsetting your download selection using the tools on
        the map."
          iconColor={rc8Theme.palette.secondary1}
          sx={{ pb: "22px", px: "12px" }}
        />
      )}

      <Divider sx={{ width: "100%" }} />
      <PlainAccordion
        expanded={accordionExpanded}
        elevation={0}
        onChange={() => setAccordionExpanded((prevState) => !prevState)}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Box display="flex" alignItems="center" gap={3}>
            <Typography
              typography="title1Medium"
              color={rc8Theme.palette.text1}
              p={0}
            >
              Download Selection
            </Typography>
            <Badge
              sx={{
                "& .MuiBadge-badge": {
                  backgroundColor: rc8Theme.palette.primary1,
                  ...rc8Theme.typography.title2Regular,
                  color: rc8Theme.palette.text3,
                  pb: "1px",
                },
              }}
              badgeContent={subsettingSelectionCount}
            />
          </Box>
        </AccordionSummary>
        <AccordionDetails sx={{ pt: "4px" }}>
          <DataSelection
            downloadConditions={downloadConditions}
            getAndSetDownloadConditions={getAndSetDownloadConditions}
            removeDownloadCondition={removeDownloadCondition}
          />
        </AccordionDetails>
      </PlainAccordion>
    </>
  );
};

export default DownloadSubsetting;
