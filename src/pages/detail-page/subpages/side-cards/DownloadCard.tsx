import { useCallback, useMemo, useState } from "react";
import {
  AccordionDetails,
  AccordionSummary,
  Badge,
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
import DownloadDialog from "../../../../components/download/DownloadDialog";
import DataSelection from "../../../../components/download/DataSelection";

const options = [
  // { label: "NetCDFs", value: "NetCDFs" },
  { label: "CSV", value: "csv" },
];

const DownloadCard = () => {
  const theme = useTheme();
  const [accordionExpanded, setAccordionExpanded] = useState<boolean>(true);
  const { downloadConditions, isCollectionNotFound } = useDetailPageContext();
  const [downloadDialogOpen, setDownloadDialogOpen] = useState<boolean>(false);

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

  return (
    <Stack direction="column">
      <DownloadDialog
        isOpen={downloadDialogOpen}
        setIsOpen={setDownloadDialogOpen}
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
              Data Selection
            </Typography>
          </Badge>
        </AccordionSummary>
        <AccordionDetails>
          <DataSelection />
        </AccordionDetails>
      </PlainAccordion>
    </Stack>
  );
};

export default DownloadCard;
