import React from "react";
import notFoundImage from "@/assets/images/no_matching_record.png";
import { Box, Typography } from "@mui/material";

const DegradedPage: React.FC = () => {
  return (
    <Box
      sx={{
        backgroundImage: `url(${notFoundImage})`,
        backgroundSize: "cover", // Covers the entire area
        backgroundPosition: "center", // Centers the image
        backgroundRepeat: "no-repeat", // Prevents tiling
        height: "100vh", // Full viewport height
        width: "100vw", // Full viewport width
        display: "flex",
        margin: 0, // Removes default margins
      }}
    >
      <Box sx={{ marginTop: "25vh", marginLeft: "20vw" }}>
        <Typography
          sx={{
            fontSize: "50px",
            color: "black",
          }}
        >
          System is having technical difficulties.
        </Typography>
        <Typography
          sx={{
            fontSize: "26px",
            color: "black",
          }}
        >
          Please try again later.
        </Typography>
      </Box>
    </Box>
  );
};

export default DegradedPage;
