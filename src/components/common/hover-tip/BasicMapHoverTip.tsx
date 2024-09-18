import { FC } from "react";
import { Box, SxProps, Typography } from "@mui/material";
import { fontSize, fontWeight } from "../../../styles/constants";

interface BasicMapHoverTipProps {
  content: string | undefined | null;
  sx?: SxProps;
}

const BasicMapHoverTip: FC<BasicMapHoverTipProps> = ({ content, sx }) => {
  if (!content) return;

  return (
    <Box
      width="100&"
      height="100%"
      justifyContent="left"
      alignItems="center"
      sx={{ ...sx }}
    >
      <Typography
        fontWeight={fontWeight.bold}
        fontSize={fontSize.info}
        sx={{
          padding: 0,
          paddingTop: -100,
          overflow: "hidden",
          textOverflow: "ellipsis",
          display: "-webkit-box",
          WebkitLineClamp: "4",
          WebkitBoxOrient: "vertical",
        }}
      >
        {content}
      </Typography>
    </Box>
  );
};

export default BasicMapHoverTip;
