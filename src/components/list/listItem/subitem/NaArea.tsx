import { Box, Grid, Typography, useTheme } from "@mui/material";
import React from "react";
import rc8Theme from "../../../../styles/themeRC8";

interface NaAreaProps {
  title: string;
}

const NaArea: React.FC<NaAreaProps> = ({ title }) => {
  return (
    <>
      <Grid item>
        <Box
          sx={{
            bgcolor: rc8Theme.palette.warning.main,
            width: "6px",
            height: "38px",
            borderRadius: "2px",
            ml: "3px",
          }}
        />
      </Grid>

      <Grid item xs>
        <Box sx={{ textAlign: "center" }}>
          <Typography
            sx={{
              ...rc8Theme.typography.body2Regular,
              color: rc8Theme.palette.text1,
              textTransform: "lowercase",
              "&::first-letter": { textTransform: "uppercase" },
              p: 0,
            }}
          >
            {title} not available
          </Typography>
        </Box>
      </Grid>
    </>
  );
};

export default NaArea;
