import { Box, Grid, Typography, useTheme } from "@mui/material";
import React from "react";
import NoSuchDataIcon from "../../../icon/NoSuchDataIcon";

interface NaAreaProps {
  title: string;
}

const NaArea: React.FC<NaAreaProps> = ({ title }) => {
  const theme = useTheme();
  return (
    <Grid container justifyContent="center">
      <Box marginRight={theme.mp.sm} display="flex">
        <NoSuchDataIcon />
      </Box>
      <Typography variant="detailContent">
        <b>{title} Not Found </b>
      </Typography>
    </Grid>
  );
};

export default NaArea;
