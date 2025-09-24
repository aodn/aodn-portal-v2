import { Box, Typography } from "@mui/material";
import { InformationIcon } from "../../../../assets/icons/download/information";
import rc8Theme from "../../../../styles/themeRC8";

const SubsettingMessage = () => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-start",
        pb: "22px",
        px: "16px",
      }}
    >
      <Box sx={{ minWidth: 22, flexShrink: 0, px: "8px" }}>
        <InformationIcon
          color={rc8Theme.palette.secondary1}
          height={24}
          width={24}
        />
      </Box>
      <Typography variant="body2" color={rc8Theme.palette.text2} pt="3px">
        Please consider subsetting your download selection using the tools on
        the map.
      </Typography>
    </Box>
  );
};

export default SubsettingMessage;
