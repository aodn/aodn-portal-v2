import * as React from "react";
import { Grid, Box, Button, MenuItem, OutlinedInput } from "@mui/material";
import TuneIcon from "@mui/icons-material/Tune";
import { border, borderRadius } from "../constants";
import RoundSelect from "../dropdown/RoundSelect";
import ClearIcon from "@mui/icons-material/Clear";

interface RemovableParameterFilterProps {
  title: string;
  url: string;
}

const RemovableParameterFilter = (props: RemovableParameterFilterProps) => {
  return (
    <Grid
      container
      columns={13}
      sx={{
        backgroundImage: "url(/filters/Background.png)",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        border: border["frameBorder"],
        borderRadius: borderRadius["filter"],
        justifyContent: "center",
        minHeight: "90px",
      }}
    >
      <Grid
        item
        xs={1}
        sx={{
          display: "inline-block",
          margin: "auto",
          textAlign: "center",
        }}
      >
        <Box component="img" src={props.url} />
      </Grid>
      <Grid
        item
        xs={2}
        sx={{
          display: "inline-block",
          margin: "auto",
          textAlign: "left",
        }}
      >
        <div>{props.title}</div>
        <TuneIcon />
      </Grid>
      <Grid
        item
        xs={3}
        sx={{
          display: "inline-block",
          marginTop: "10px",
        }}
      >
        <RoundSelect
          sx={{
            width: "80%",
          }}
          input={<OutlinedInput />}
          renderValue={(selected) => <em>Biological</em>}
        >
          <MenuItem disabled value="">
            <em>Biological</em>
          </MenuItem>
          <MenuItem>Biologicals</MenuItem>
        </RoundSelect>
      </Grid>
      <Grid
        item
        xs={3}
        sx={{
          display: "inline-block",
          marginTop: "10px",
        }}
      >
        <RoundSelect
          sx={{
            width: "80%",
          }}
          input={<OutlinedInput />}
          renderValue={(selected) => <em>Biological</em>}
        >
          <MenuItem disabled value="">
            <em>Biological</em>
          </MenuItem>
          <MenuItem>Biologicals</MenuItem>
        </RoundSelect>
      </Grid>
      <Grid
        item
        xs={3}
        sx={{
          display: "inline-block",
          marginTop: "10px",
        }}
      >
        <RoundSelect
          sx={{
            width: "80%",
          }}
          input={<OutlinedInput />}
          renderValue={(selected) => <em>Biological</em>}
        >
          <MenuItem disabled value="">
            <em>Biological</em>
          </MenuItem>
          <MenuItem>Biologicals</MenuItem>
        </RoundSelect>
      </Grid>
      <Grid
        item
        xs={1}
        sx={{
          display: "inline-block",
          marginTop: "10px",
          textAlign: "center",
        }}
      >
        <Button endIcon={<ClearIcon />}></Button>
      </Grid>
    </Grid>
  );
};

export default RemovableParameterFilter;
