import { FC, startTransition, useEffect, useMemo, useState } from "react";
import {
  AccordionDetails,
  AccordionSummary,
  Badge,
  Box,
  Divider,
  Stack,
  SxProps,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Dayjs } from "dayjs";
import PlainAccordion from "../../../../components/common/accordion/PlainAccordion";
import { portalTheme } from "../../../../styles";
import {
  DownloadCondition,
  DownloadConditionType,
} from "../../context/DownloadDefinitions";
import DataSelection from "./DataSelection/DataSelection";
import InfoMessage from "./InfoMessage";

interface DownloadSubsettingProps extends DownloadCondition {
  hideInfoMessage?: boolean;
  sx?: SxProps;
  disable?: boolean;
  dateRangeBounds?: { min: Dayjs; max: Dayjs };
}

const DownloadSubsetting: FC<DownloadSubsettingProps> = ({
  hideInfoMessage = false,
  downloadConditions,
  getAndSetDownloadConditions,
  removeDownloadCondition,
  disable,
  dateRangeBounds,
}) => {
  const [accordionExpanded, setAccordionExpanded] = useState<boolean>(false);
  // Store the filtered download conditions count
  const subsettingSelectionCount = useMemo(() => {
    return downloadConditions.filter(
      (condition) =>
        condition.type !== DownloadConditionType.FORMAT &&
        condition.type !== DownloadConditionType.KEY
    ).length;
  }, [downloadConditions]);

  useEffect(() => {
    startTransition(() => setAccordionExpanded(subsettingSelectionCount > 0));
  }, [subsettingSelectionCount]);

  return (
    <Stack direction="column">
      {!hideInfoMessage && subsettingSelectionCount === 0 && (
        <InfoMessage
          infoText="To download data directly please use the selections below, or utilise the map tools to make your selection."
          iconColor={portalTheme.palette.secondary1}
          sx={{ pl: "8px", pr: "16px" }}
        />
      )}

      <Divider
        sx={{ width: "100%", pt: subsettingSelectionCount === 0 ? "16px" : 0 }}
      />

      {subsettingSelectionCount > 0 && (
        <PlainAccordion
          expanded={accordionExpanded}
          elevation={0}
          onChange={() => setAccordionExpanded((prevState) => !prevState)}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box display="flex" alignItems="center" gap={3}>
              <Typography
                typography="title1Medium"
                color={portalTheme.palette.text1}
                p={0}
              >
                Download Selection
              </Typography>
              <Badge
                sx={{
                  "& .MuiBadge-badge": {
                    backgroundColor: portalTheme.palette.primary1,
                    ...portalTheme.typography.title2Regular,
                    color: portalTheme.palette.text3,
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
              disable={disable}
              dateRangeBounds={dateRangeBounds}
            />
          </AccordionDetails>
        </PlainAccordion>
      )}
    </Stack>
  );
};

export default DownloadSubsetting;
