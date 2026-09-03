import { ReactNode } from "react";
import CloseIcon from "@mui/icons-material/Close";
import ListAltOutlinedIcon from "@mui/icons-material/ListAltOutlined";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import {
  Box,
  Chip,
  IconButton,
  Link,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import SectionContainer from "@/components/common/container/SectionContainer";
import { PAGE_CONTENT_WIDTH_DETAIL } from "@/app/layout/constant";
import { padding } from "@/styles/constants";
import {
  DownloadStatus,
  TrackedDownload,
} from "@/app/store/DownloadStatusDefinitions";
import { portalTheme } from "@/styles";
import useBreakpoint from "@/hooks/useBreakpoint";
import { toAppDayjs, formatDateTime } from "@/utils/DateUtils";
import { dateDefault } from "@/components/common/constants";
import useDownloadStatus from "./useDownloadStatus";

const EMPTY_VALUE = "—";

interface DateCellProps {
  value?: string;
}

const DateCell = ({ value }: DateCellProps) => {
  const datePart = formatDateTime(value, dateDefault.DISPLAY_FORMAT);
  if (!datePart) return <>{EMPTY_VALUE}</>;

  const timePart = formatDateTime(value, dateDefault.UTC_TIME_DISPLAY_FORMAT);

  return (
    <Stack spacing={0} whiteSpace="nowrap">
      <Typography component="span" variant="body3Small">
        {datePart}
      </Typography>
      <Typography
        component="span"
        variant="body3Small"
        color={portalTheme.palette.grey700}
      >
        {timePart}
      </Typography>
    </Stack>
  );
};

interface CollectionCellProps {
  collection?: string;
  dataSelection?: string;
  metadataUrl?: string;
}

const CollectionCell = ({
  collection,
  dataSelection,
  metadataUrl,
}: CollectionCellProps) => {
  const collectionLabel = collection ?? (metadataUrl ? "View metadata" : null);

  return (
    <Stack spacing={0.25} sx={{ minWidth: 220, maxWidth: 300 }}>
      {metadataUrl && collectionLabel ? (
        <Link
          href={metadataUrl}
          target="_blank"
          rel="noopener noreferrer"
          variant="body3Small"
          aria-label={`Open metadata for ${collectionLabel}`}
          sx={{ color: portalTheme.palette.primary1, fontWeight: 600 }}
        >
          {collectionLabel}
        </Link>
      ) : (
        <Typography component="span" variant="body3Small" fontWeight={600}>
          {collectionLabel ?? EMPTY_VALUE}
        </Typography>
      )}
      {dataSelection ? (
        <Typography
          component="span"
          variant="body3Small"
          color={portalTheme.palette.grey700}
          sx={{ overflowWrap: "anywhere" }}
        >
          {dataSelection}
        </Typography>
      ) : null}
    </Stack>
  );
};

const formatDuration = (started?: string, finished?: string): string => {
  if (!started || !finished) return EMPTY_VALUE;

  const startedAt = toAppDayjs(started);
  const finishedAt = toAppDayjs(finished);
  if (!startedAt.isValid() || !finishedAt.isValid()) return EMPTY_VALUE;

  const totalSeconds = finishedAt.diff(startedAt, "second");
  if (totalSeconds < 0) return EMPTY_VALUE;

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [
    hours > 0 ? `${hours}h` : undefined,
    hours > 0 || minutes > 0 ? `${minutes}m` : undefined,
    `${seconds}s`,
  ]
    .filter(Boolean)
    .join(" ");
};

interface StatusPresentation {
  label: string;
  color: string;
}

const STATUS_PRESENTATIONS: Record<DownloadStatus, StatusPresentation> = {
  accepted: {
    label: "Queued",
    color: portalTheme.palette.warning.main,
  },
  running: {
    label: "In progress",
    color: portalTheme.palette.info.main,
  },
  successful: {
    label: "Completed",
    color: portalTheme.palette.success.main,
  },
  failed: {
    label: "Failed",
    color: portalTheme.palette.error.main,
  },
  dismissed: {
    label: "Dismissed",
    color: portalTheme.palette.grey600,
  },
};

const getStatusPresentation = (
  download: TrackedDownload
): StatusPresentation => {
  if (download.lookupState === "unavailable") {
    return {
      label: "Unavailable",
      color: portalTheme.palette.grey600,
    };
  }
  if (download.lookupState === "error") {
    return {
      label: "Status unavailable",
      color: portalTheme.palette.error.main,
    };
  }
  return download.status
    ? STATUS_PRESENTATIONS[download.status]
    : {
        label: "Checking",
        color: portalTheme.palette.grey600,
      };
};

interface DownloadStatusPillProps {
  download: TrackedDownload;
}

const DownloadStatusPill = ({ download }: DownloadStatusPillProps) => {
  const statusPresentation = getStatusPresentation(download);

  return (
    <Chip
      label={
        <Stack
          component="span"
          direction="row"
          spacing={0.75}
          alignItems="center"
        >
          <Box
            component="span"
            data-testid="download-status-dot"
            sx={{
              width: 6,
              height: 6,
              flexShrink: 0,
              borderRadius: "50%",
              backgroundColor: statusPresentation.color,
            }}
          />
          <Box component="span">{statusPresentation.label}</Box>
        </Stack>
      }
      size="small"
      data-testid="download-status-pill"
      sx={{
        height: "auto",
        borderRadius: "999px",
        backgroundColor: alpha(statusPresentation.color, 0.18),
        ...portalTheme.typography.body3Small,
        color: portalTheme.palette.primary2,
        fontWeight: 600,
        letterSpacing: "0.01em",
        "& .MuiChip-label": {
          px: 1.25,
          py: 0.375,
        },
      }}
    />
  );
};

interface DownloadFormatProps {
  format?: string;
}

const DownloadFormat = ({ format }: DownloadFormatProps) =>
  format ? (
    <Chip
      label={format.toUpperCase()}
      size="small"
      sx={{
        height: 24,
        borderRadius: "5px",
        border: `1px solid ${portalTheme.palette.primary4}`,
        backgroundColor: portalTheme.palette.primary6,
        ...portalTheme.typography.body3Small,
        color: portalTheme.palette.primary1,
        fontWeight: 600,
      }}
    />
  ) : (
    <>{EMPTY_VALUE}</>
  );

interface DownloadActionsProps {
  download: TrackedDownload;
  retryDownload: (jobID: string) => void;
  removeDownload: (jobID: string) => void;
}

const DownloadActions = ({
  download,
  retryDownload,
  removeDownload,
}: DownloadActionsProps) => (
  <Stack direction="row" spacing={1}>
    {download.lookupState === "error" ? (
      <Tooltip title="Retry status check">
        <IconButton
          aria-label="Retry"
          size="small"
          onClick={() => retryDownload(download.jobID)}
          sx={{
            width: { xs: 40, md: 30 },
            height: { xs: 40, md: 30 },
            color: portalTheme.palette.primary1,
            border: `1px solid ${portalTheme.palette.primary4}`,
            borderRadius: "6px",
          }}
        >
          <RefreshOutlinedIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    ) : null}
    <Tooltip title="Remove from this browser">
      <IconButton
        aria-label="Remove"
        size="small"
        onClick={() => removeDownload(download.jobID)}
        sx={{
          width: { xs: 40, md: 30 },
          height: { xs: 40, md: 30 },
          color: portalTheme.palette.primary1,
          border: `1px solid ${portalTheme.palette.primary4}`,
          borderRadius: "6px",
        }}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  </Stack>
);

interface MobileFieldProps {
  label: string;
  children: ReactNode;
}

const MobileField = ({ label, children }: MobileFieldProps) => (
  <Stack spacing={0.25} minWidth={0}>
    <Typography
      component="span"
      variant="body3Small"
      sx={{
        color: portalTheme.palette.grey700,
        fontSize: "11px",
        fontWeight: 600,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
      }}
    >
      {label}
    </Typography>
    <Box sx={{ minWidth: 0 }}>{children}</Box>
  </Stack>
);

type DownloadMobileCardProps = DownloadActionsProps;

const DownloadMobileCard = ({
  download,
  retryDownload,
  removeDownload,
}: DownloadMobileCardProps) => (
  <Box
    component="li"
    data-testid="download-card"
    sx={{
      listStyle: "none",
      p: { xs: 2, sm: 2.5 },
      borderTop: `1px solid ${portalTheme.palette.primary4}`,
      backgroundColor: portalTheme.palette.neutral2,
    }}
  >
    <Stack spacing={2}>
      <Stack
        direction="row"
        spacing={1.5}
        alignItems="flex-start"
        justifyContent="space-between"
      >
        <MobileField label="Job ID">
          <Typography
            component="span"
            variant="body3Small"
            sx={{
              color: portalTheme.palette.primary1,
              fontWeight: 600,
              overflowWrap: "anywhere",
            }}
          >
            {download.jobID}
          </Typography>
        </MobileField>
        <Box flexShrink={0}>
          <DownloadStatusPill download={download} />
        </Box>
      </Stack>

      <MobileField label="Collection / data selection">
        <CollectionCell
          collection={download.collection}
          dataSelection={download.dataSelection}
          metadataUrl={download.metadataUrl}
        />
      </MobileField>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" },
          gap: 2,
          m: 0,
        }}
      >
        <MobileField label="Format">
          <DownloadFormat format={download.format} />
        </MobileField>
        <MobileField label="Duration">
          {formatDuration(download.started, download.finished)}
        </MobileField>
        <MobileField label="Created">
          <DateCell value={download.created} />
        </MobileField>
        <MobileField label="Started">
          <DateCell value={download.started} />
        </MobileField>
        <MobileField label="Finished">
          <DateCell value={download.finished} />
        </MobileField>
        <MobileField label="Last checked">
          <DateCell value={download.lastCheckedAt} />
        </MobileField>
      </Box>

      <MobileField label="Message">
        <Typography component="span" variant="body3Small">
          {download.pollingError ?? download.message ?? EMPTY_VALUE}
        </Typography>
      </MobileField>

      <Stack direction="row" justifyContent="flex-end">
        <DownloadActions
          download={download}
          retryDownload={retryDownload}
          removeDownload={removeDownload}
        />
      </Stack>
    </Stack>
  </Box>
);

const DownloadsPage = () => {
  const { downloads, retryDownload, removeDownload } = useDownloadStatus();
  const { isUnderLaptop } = useBreakpoint();

  return (
    <SectionContainer
      sectionAreaStyle={{
        backgroundColor: portalTheme.palette.primary5,
        paddingY: padding.large,
        minHeight: "100%",
      }}
      contentAreaStyle={{
        width: PAGE_CONTENT_WIDTH_DETAIL,
        alignItems: "stretch",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          overflow: "hidden",
          border: `1px solid ${portalTheme.palette.primary4}`,
          borderRadius: "8px",
          boxShadow: `0 2px 10px ${alpha(portalTheme.palette.primary2, 0.08)}`,
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1}
          alignItems={{ xs: "flex-start", sm: "center" }}
          justifyContent="space-between"
          sx={{ px: 2.5, py: 2 }}
        >
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: portalTheme.palette.secondary1,
              }}
            >
              <ListAltOutlinedIcon fontSize="small" />
            </Box>
            <Typography component="h1" variant="heading4">
              Downloads
            </Typography>
          </Stack>
          <Typography variant="body3Small" color={portalTheme.palette.grey700}>
            Status is shown for jobs created in this browser.
          </Typography>
        </Stack>

        {downloads.length === 0 ? (
          <Box
            sx={{
              borderTop: `1px solid ${portalTheme.palette.primary4}`,
              px: 2.5,
              py: 4,
              textAlign: "center",
              backgroundColor: portalTheme.palette.grey100,
            }}
          >
            <Typography variant="body2Regular">
              No downloads are being tracked.
            </Typography>
          </Box>
        ) : isUnderLaptop ? (
          <Box component="ul" aria-label="Download status" sx={{ m: 0, p: 0 }}>
            {downloads.map((download) => (
              <DownloadMobileCard
                key={download.jobID}
                download={download}
                retryDownload={retryDownload}
                removeDownload={removeDownload}
              />
            ))}
          </Box>
        ) : (
          <TableContainer>
            <Table
              aria-label="Download status"
              sx={{
                minWidth: 1280,
                "& .MuiTableCell-root": {
                  borderColor: portalTheme.palette.primary4,
                  px: 2,
                },
                "& .MuiTableCell-head": {
                  ...portalTheme.typography.body3Small,
                  py: 1.25,
                  backgroundColor: portalTheme.palette.primary6,
                  color: portalTheme.palette.text2,
                  fontSize: "11px",
                  fontWeight: 600,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  whiteSpace: "nowrap",
                },
                "& .MuiTableCell-body": {
                  ...portalTheme.typography.body3Small,
                  py: 1.5,
                  color: portalTheme.palette.text2,
                  verticalAlign: "middle",
                },
                "& .MuiTableRow-root:last-of-type .MuiTableCell-body": {
                  borderBottom: 0,
                },
                "& .MuiTableRow-root:hover": {
                  backgroundColor: alpha(portalTheme.palette.primary6, 0.7),
                },
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell sx={{ minWidth: 200 }}>Job ID</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Collection / data selection</TableCell>
                  <TableCell>Format</TableCell>
                  <TableCell>Message</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell>Started</TableCell>
                  <TableCell>Finished</TableCell>
                  <TableCell>Duration</TableCell>
                  <TableCell>Last checked</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {downloads.map((download) => {
                  return (
                    <TableRow key={download.jobID} data-testid="download-row">
                      <TableCell>
                        <Typography
                          component="span"
                          variant="body3Small"
                          sx={{
                            color: portalTheme.palette.primary1,
                            fontWeight: 600,
                            wordBreak: "break-all",
                          }}
                        >
                          {download.jobID}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <DownloadStatusPill download={download} />
                      </TableCell>
                      <TableCell>
                        <CollectionCell
                          collection={download.collection}
                          dataSelection={download.dataSelection}
                          metadataUrl={download.metadataUrl}
                        />
                      </TableCell>
                      <TableCell>
                        <DownloadFormat format={download.format} />
                      </TableCell>
                      <TableCell>
                        <Typography
                          component="span"
                          variant="body3Small"
                          sx={{ display: "block", maxWidth: 240 }}
                        >
                          {download.pollingError ??
                            download.message ??
                            EMPTY_VALUE}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <DateCell value={download.created} />
                      </TableCell>
                      <TableCell>
                        <DateCell value={download.started} />
                      </TableCell>
                      <TableCell>
                        <DateCell value={download.finished} />
                      </TableCell>
                      <TableCell>
                        {formatDuration(download.started, download.finished)}
                      </TableCell>
                      <TableCell>
                        <DateCell value={download.lastCheckedAt} />
                      </TableCell>
                      <TableCell>
                        <DownloadActions
                          download={download}
                          retryDownload={retryDownload}
                          removeDownload={removeDownload}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </SectionContainer>
  );
};

export default DownloadsPage;
