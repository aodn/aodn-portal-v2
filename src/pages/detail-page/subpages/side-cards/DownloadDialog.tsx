import React, { useCallback, useMemo, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
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
  DownloadConditionType,
} from "../../context/DownloadDefinitions";
import { useLocation } from "react-router-dom";
import { useAppDispatch } from "../../../../components/common/store/hooks";
import { processDatasetDownload } from "../../../../components/common/store/searchReducer";
import {
  getDateConditionFrom,
  getMultiPolygonFrom,
} from "../../../../utils/DownloadConditionUtils";

interface DownloadDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const DownloadDialog: React.FC<DownloadDialogProps> = ({ open, setOpen }) => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { downloadConditions } = useDetailPageContext();
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState<string>("");

  const bboxConditions = useMemo(
    () =>
      downloadConditions.filter(
        (condition) => condition.type === DownloadConditionType.BBOX
      ) as BBoxCondition[],
    [downloadConditions]
  );

  const handleClose = useCallback(() => {
    // reset relevant states
    setProcessingStatus("");
    setOpen(false);
  }, [setOpen]);

  const dateRange = useMemo(
    () => getDateConditionFrom(downloadConditions),
    [downloadConditions]
  );

  const multiPolygon = useMemo(
    () => getMultiPolygonFrom(downloadConditions),
    [downloadConditions]
  );

  const getProcessStatusText = useCallback((): string => {
    if (processingStatus === "") {
      return "";
    }
    if (/^5\d{2}$/.test(processingStatus)) {
      return "Failed! Please try again later";
    }
    if (/^2\d{2}$/.test(processingStatus)) {
      return "Succeeded! An email will be sent to you shortly";
    }
    if (/^4\d{2}$/.test(processingStatus)) {
      return "Failed! Please try again later";
    }
    return "Something went wrong";
  }, [processingStatus]);

  const submitJob = useCallback(
    (email: string) => {
      const uuid = new URLSearchParams(location.search).get("uuid");
      if (!uuid) {
        return;
      }
      const request: DatasetDownloadRequest = {
        inputs: {
          uuid: uuid,
          recipient: email,
          start_date: dateRange.start,
          end_date: dateRange.end,
          multi_polygon: multiPolygon,
        },
      };

      dispatch(processDatasetDownload(request))
        .unwrap()
        .then((response) => {
          setProcessingStatus(response.status.message);
          setIsProcessing(false);
          return response;
        });
    },
    [dateRange.end, dateRange.start, dispatch, location.search, multiPolygon]
  );

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        component: "form",
        onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          setIsProcessing(true);
          const formData = new FormData(event.currentTarget);
          const formJson = Object.fromEntries((formData as any).entries());
          const email = formJson.email;
          submitJob(email);
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
            <ListItem>
              <ListItemText
                primary={"Date Range Condition"}
                secondary={`${dateRange.start} to ${dateRange.end}`}
              />
            </ListItem>
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
        <Box display="flex" justifyContent="center">
          <Typography variant={"body1"}>{getProcessStatusText()}</Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Box sx={{ m: 1, position: "relative" }}>
          <Button type="submit" disabled={isProcessing}>
            Process
          </Button>
          {isProcessing && (
            <CircularProgress
              size={24}
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                marginTop: "-12px",
                marginLeft: "-12px",
              }}
            />
          )}
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default DownloadDialog;
