import React, { useCallback, useMemo } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import { useDetailPageContext } from "../../context/detail-page-context";
import {
  BBoxCondition,
  DatasetDownloadRequest,
  DateRangeCondition,
  DownloadConditionType,
} from "../../context/DownloadDefinitions";
import { useLocation } from "react-router-dom";
import { useAppDispatch } from "../../../../components/common/store/hooks";
import { processDatasetDownload } from "../../../../components/common/store/searchReducer";
import dayjs from "dayjs";
import { dateDefault } from "../../../../components/common/constants";

interface DownloadDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const DownloadDialog: React.FC<DownloadDialogProps> = ({ open, setOpen }) => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { downloadConditions } = useDetailPageContext();

  const handleClose = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

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

  const submitJob = useCallback(
    (email: string) => {
      const uuid = new URLSearchParams(location.search).get("uuid");
      if (!uuid) {
        return;
      }
      const formattedStart = dayjs(
        dateRangeCondition[0].start,
        dateDefault.SIMPLE_DATE_FORMAT
      ).format(dateDefault.DATE_FORMAT);

      const formattedEnd = dayjs(
        dateRangeCondition[0].end,
        dateDefault.SIMPLE_DATE_FORMAT
      ).format(dateDefault.DATE_FORMAT);

      const request: DatasetDownloadRequest = {
        inputs: {
          UUID: uuid,
          RECIPIENT: email,
          START_DATE: formattedStart,
          END_DATE: formattedEnd,
          MIN_LAT: bboxConditions[0].bbox[3].toString(),
          MAX_LAT: bboxConditions[0].bbox[1].toString(),
          MIN_LON: bboxConditions[0].bbox[0].toString(),
          MAX_LON: bboxConditions[0].bbox[2].toString(),
        },
      };

      dispatch(processDatasetDownload(request))
        .unwrap()
        .then((response) => {
          console.log("response", response);
        });
    },
    [bboxConditions, dateRangeCondition, dispatch, location.search]
  );

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        component: "form",
        onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          const formJson = Object.fromEntries((formData as any).entries());
          const email = formJson.email;
          submitJob(email);
          handleClose();
        },
      }}
    >
      <DialogTitle>Dataset Download Review</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <List>
            {bboxConditions.map((bboxCondition, index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={`BBox Condition ${index + 1}`}
                  secondary={JSON.stringify(bboxCondition.bbox)}
                />
              </ListItem>
            ))}
            {dateRangeCondition.map((dateRangeCondition, index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={"Date Range Condition"}
                  secondary={`${dateRangeCondition.start} to ${dateRangeCondition.end}`}
                />
              </ListItem>
            ))}
          </List>
        </DialogContentText>
        <DialogContentText>
          <Typography variant={"body2"}>
            *** Processing dataset download may take some time. It is varied by
            the size of the dataset, the selected conditions, and the server
            load (may take several seconds to several hours or even more).
            Please provide your email address to receive the download link and
            necessary information.***
          </Typography>
        </DialogContentText>
        <TextField
          required
          margin="dense"
          id="name"
          name="email"
          label="Email Address"
          type="email"
          fullWidth
          variant="standard"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button type="submit">Process</Button>
      </DialogActions>
    </Dialog>
  );
};

export default DownloadDialog;
