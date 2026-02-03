import { Box, Typography } from "@mui/material";
import notFoundImage from "@/assets/images/no_matching_record.png";

const NotFoundPage = () => {
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
          404 Error Page
        </Typography>
        <Typography
          sx={{
            fontSize: "26px",
            color: "black",
          }}
        >
          The page you were looking for doesn&rsquo;t exist.
        </Typography>
      </Box>
    </Box>
  );
};

export default NotFoundPage;
