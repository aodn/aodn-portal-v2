import { useCallback, useMemo, useState } from "react";
import {
  AccordionDetails,
  AccordionSummary,
  Badge,
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
import { useDetailPageContext } from "../../context/detail-page-context";
import BBoxConditionBox from "../../../../components/box/BBoxConditionBox";
import {
  BBoxCondition,
  DownloadConditionType,
  DateRangeCondition,
  IDownloadCondition,
  IDownloadConditionCallback,
} from "../../context/DownloadDefinitions";
import DateRangeConditionBox from "../../../../components/box/DateRangeConditionBox";
import DownloadDialog from "./DownloadDialog";

const options = [
  // { label: "NetCDFs", value: "NetCDFs" },
  { label: "CSV", value: "csv" },
];

const DownloadCard = () => {
  const theme = useTheme();
  const [accordionExpanded, setAccordionExpanded] = useState<boolean>(true);
  const { downloadConditions, isCollectionNotFound, removeDownloadCondition } =
    useDetailPageContext();
  const [downloadDialogOpen, setDownloadDialogOpen] = useState<boolean>(false);

  const bboxConditions: BBoxCondition[] = useMemo(() => {
    const bboxConditions = downloadConditions.filter(
      (condition) => condition.type === DownloadConditionType.BBOX
    );
    return bboxConditions as BBoxCondition[];
  }, [downloadConditions]);

  const dateRangeCondition: DateRangeCondition[] = useMemo(() => {
    const timeRangeConditions = downloadConditions.filter(
      (condition) => condition.type === DownloadConditionType.DATE_RANGE
    );
    return timeRangeConditions as DateRangeCondition[];
  }, [downloadConditions]);

  const onDownload = useCallback(() => {
    setDownloadDialogOpen(true);
  }, []);

  const selectSxProps = useMemo(
    () => ({
      height: "30px",
      textAlign: "start",
      backgroundColor: "transparent",
      boxShadow: theme.shadows[5],
      border: `${border.xs} ${color.blue.dark}`,
    }),
    [theme]
  );

  const handleRemove = useCallback(
    (c: IDownloadConditionCallback & IDownloadCondition) => {
      c.removeCallback && c.removeCallback();
      removeDownloadCondition(c);
    },
    [removeDownloadCondition]
  );

  return (
    <Stack direction="column">
      <DownloadDialog
        open={downloadDialogOpen}
        setOpen={setDownloadDialogOpen}
      />
      <Stack sx={{ padding: padding.medium }} spacing={2}>
        <CommonSelect items={options} sx={selectSxProps} />
        <Button
          disabled={isCollectionNotFound}
          sx={{
            backgroundColor: isCollectionNotFound
              ? "lightGrey"
              : theme.palette.primary.main,
            borderRadius: borderRadius.small,
            ":hover": {
              backgroundColor: theme.palette.primary.main,
            },
          }}
          onClick={onDownload}
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
          disabled={isCollectionNotFound}
          sx={{ paddingX: padding.medium }}
          expandIcon={<ExpandMoreIcon />}
        >
          <Badge color="primary" badgeContent={downloadConditions.length}>
            <Typography
              fontWeight={fontWeight.bold}
              color={fontColor.gray.medium}
              sx={{ padding: 0, marginRight: "10px" }}
            >
              Download Subset
            </Typography>
          </Badge>
        </AccordionSummary>
        <AccordionDetails>
          <Box gap={2}>
            {bboxConditions.map((bboxCondition, index) => {
              return (
                <BBoxConditionBox
                  key={index}
                  bboxCondition={bboxCondition}
                  onRemove={() => handleRemove(bboxCondition)}
                />
              );
            })}
            {dateRangeCondition.map((dateRangeCondition, index) => {
              return (
                <DateRangeConditionBox
                  key={index}
                  dateRangeCondition={dateRangeCondition}
                  onRemove={() => handleRemove(dateRangeCondition)}
                />
              );
            })}
          </Box>
        </AccordionDetails>
      </PlainAccordion>
    </Stack>
  );
};

export default DownloadCard;
