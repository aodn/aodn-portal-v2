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
import { Dayjs } from "@/utils/DayjsUtils";
import { toAppDayjs } from "@/utils/DateUtils";
import PlainAccordion from "../../../../components/common/accordion/PlainAccordion";
import { portalTheme } from "../../../../styles";
import {
  DownloadCondition,
  DownloadConditionType,
  type ConditionSupportContext,
} from "../../context/DownloadDefinitions";
import SubsetConditions from "./subset-conditions/SubsetConditions";
import InfoMessage from "./InfoMessage";
import { useDetailPageContext } from "../../context/detail-page-context";
import { dateDefault } from "@/components/common/constants";

const DEFAULT_INFO_TEXT =
  "To download data directly please use the selections below, or utilise the map tools to make your selection.";
const EXTERNAL_INFO_TEXT =
  "This download uses external services that are not managed by IMOS. Download speed, formats and availability depend on the external providers.";
const INTEGRATED_INFO_TEXT =
  "This dataset is hosted by an external provider. Whilst IMOS manages the download service, data access and availability may be affected by the external provider's systems";

interface DownloadSubsettingProps extends DownloadCondition {
  hideInfoMessage?: boolean;
  sx?: SxProps;
  disable?: boolean;
  isExternal?: boolean;
  isIntegrated?: boolean;
}

const DownloadSubsetting: FC<DownloadSubsettingProps> = ({
  hideInfoMessage = false,
  downloadConditions,
  getAndSetDownloadConditions,
  removeDownloadCondition,
  disable,
  isExternal = false,
  isIntegrated = false,
}) => {
  const { isSubsettingSupported, mapSubsettingCapabilities } =
    useDetailPageContext();
  const dateRangeBounds: { min: Dayjs; max: Dayjs } | undefined =
    useMemo(() => {
      const bounds = mapSubsettingCapabilities.timeRangeBounds;
      if (!bounds) return undefined;

      const min = toAppDayjs(bounds.min, dateDefault.DATE_FORMAT);
      const max = toAppDayjs(bounds.max, dateDefault.DATE_FORMAT);
      return min.isValid() && max.isValid() ? { min, max } : undefined;
    }, [mapSubsettingCapabilities.timeRangeBounds]);
  const supportCtx: ConditionSupportContext = useMemo(
    () => ({ isSubsettingSupported }),
    [isSubsettingSupported]
  );

  const [accordionExpanded, setAccordionExpanded] = useState<boolean>(false);
  // Count only subsetting conditions supported for the current map layer
  const subsettingSelectionCount = useMemo(() => {
    return downloadConditions.filter(
      (condition) =>
        condition.type !== DownloadConditionType.FORMAT &&
        condition.type !== DownloadConditionType.KEY &&
        condition.support(supportCtx)
    ).length;
  }, [downloadConditions, supportCtx]);

  useEffect(() => {
    startTransition(() => setAccordionExpanded(subsettingSelectionCount > 0));
  }, [subsettingSelectionCount]);

  let infoText = DEFAULT_INFO_TEXT;
  let iconColor = portalTheme.palette.info.main;

  if (isIntegrated) {
    infoText = INTEGRATED_INFO_TEXT;
  } else if (isExternal) {
    infoText = EXTERNAL_INFO_TEXT;
  }

  if (isIntegrated || isExternal) {
    iconColor = portalTheme.palette.warning.main;
  }

  return (
    <Stack direction="column">
      {!hideInfoMessage && subsettingSelectionCount === 0 && (
        <InfoMessage
          infoText={infoText}
          iconColor={iconColor}
          sx={{ pl: "8px", pr: "16px" }}
        />
      )}

      <Divider
        sx={{ width: "100%", pt: subsettingSelectionCount === 0 ? "16px" : 0 }}
      />

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
          <SubsetConditions
            downloadConditions={downloadConditions}
            getAndSetDownloadConditions={getAndSetDownloadConditions}
            removeDownloadCondition={removeDownloadCondition}
            disable={disable}
            dateRangeBounds={dateRangeBounds}
          />
        </AccordionDetails>
      </PlainAccordion>
    </Stack>
  );
};

export default DownloadSubsetting;
