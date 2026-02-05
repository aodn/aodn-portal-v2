// ErrorPage.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import notFoundImage from "@/assets/images/no_matching_record.png";
import { Box, Typography } from "@mui/material";

const ErrorPage: React.FC = () => {
  const navigate = useNavigate();

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
          Error Occurred
        </Typography>
        <Typography
          sx={{
            fontSize: "26px",
            color: "black",
          }}
        >
          Something went wrong. Please try again later.
        </Typography>
        <button onClick={() => navigate("/")}>Go Back Home</button>
      </Box>
    </Box>
  );
};

export default ErrorPage;
