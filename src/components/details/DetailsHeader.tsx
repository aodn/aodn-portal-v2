import { useCallback } from "react";
import { DetailsProps } from "./DetailsPanel";
import {
  Card,
  Typography,
  CardContent,
  Box,
  CardMedia,
  Grid,
} from "@mui/material";
import { pageDefault } from "../common/constants";
import grey from "../common/colors/grey";
import SlightRoundButton from "../common/buttons/SlightRoundButton";
import UndoIcon from "@mui/icons-material/Undo";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useNavigate } from "react-router-dom";
import {
  ParameterState,
  updateFilterPolygon,
  updateParameterStates,
  formatToUrlParam,
} from "../common/store/componentParamReducer";
import store, { AppDispatch, getComponentState } from "../common/store/store";
import { useDispatch } from "react-redux";
import { borderRadius, margin } from "../../styles/constants";

const DetailsHeaderButton = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  // Make sure the url is append with param before route, with fromNavigate we do not
  // alter the parameter state.
  const onGoBack = useCallback(() => {
    const componentParam: ParameterState = getComponentState(store.getState());
    navigate(pageDefault.search + "?" + formatToUrlParam(componentParam), {
      state: { fromNavigate: true },
    });
  }, [navigate]);

  return (
    <Grid container>
      <Grid item xs={6}>
        <SlightRoundButton
          startIcon={<UndoIcon />}
          sx={{ minWidth: 200 }}
          onClick={onGoBack}
        >
          Back to search
        </SlightRoundButton>
      </Grid>
      <Grid item xs={6}>
        <Box display="flex" justifyContent="flex-end">
          <SlightRoundButton
            startIcon={<FileDownloadIcon />}
            endIcon={<ArrowDropDownIcon />}
            sx={{ minWidth: 200 }}
          >
            Downloads
          </SlightRoundButton>
        </Box>
      </Grid>
    </Grid>
  );
};

const DetailsHeader = (props: DetailsProps) => {
  return (
    <Card
      sx={{
        borderRadius: borderRadius["filter"],
        backgroundColor: grey["resultCard"],
        display: "flex",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <CardContent sx={{ flex: "1 0 auto" }}>
          <Typography variant="h5" component="h5">
            {props.collection?.title}
          </Typography>
        </CardContent>
      </Box>
      <CardMedia
        component="img"
        sx={{
          width: 50,
          marginTop: margin["top"],
          marginBottom: margin["bottom"],
          marginLeft: margin["left"],
        }}
        image={props.collection?.findIcon()}
      />
    </Card>
  );
};

export { DetailsHeader, DetailsHeaderButton };
