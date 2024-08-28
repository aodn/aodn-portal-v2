import { Box, Button, Icon, Typography } from "@mui/material";
import EastIcon from "@mui/icons-material/East";
import { fontSize, fontWeight, padding } from "../../../../../styles/constants";

const ReadMoreButton = () => (
  <Button sx={{ padding: 0 }}>
    <Box
      display="flex"
      justifyContent="start"
      alignContent="center"
      paddingY={padding.small}
    >
      <Typography
        color="#fff"
        fontSize={fontSize.newsInfo}
        fontWeight={fontWeight.extraLight}
        paddingTop={1}
        letterSpacing={1}
      >
        Read More
      </Typography>
      <Icon
        sx={{
          paddingLeft: padding.extraSmall,
          color: "#fff",
        }}
      >
        <EastIcon fontSize="small" />
      </Icon>
    </Box>
  </Button>
);

export default ReadMoreButton;
