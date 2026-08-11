import { FC } from "react";
import { Box, SxProps, Typography } from "@mui/material";
import { portalTheme } from "@/styles";

interface CountBadgeProps {
  count: number | undefined;
  dataTestId?: string;
  sx?: SxProps;
}

/**
 * Small circular badge showing a count, e.g. the number of bookmarks in a list
 * header. Renders nothing when there is nothing to count.
 */
const CountBadge: FC<CountBadgeProps> = ({ count, dataTestId, sx }) => {
  if (!count) return null;

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexShrink: 0,
        width: "20px",
        height: "20px",
        borderRadius: "50%",
        bgcolor: portalTheme.palette.secondary1,
        ...sx,
      }}
      data-testid={dataTestId}
    >
      <Typography
        sx={{
          ...portalTheme.typography.body2Regular,
          color: portalTheme.palette.text3,
          padding: 0,
        }}
      >
        {count}
      </Typography>
    </Box>
  );
};

export default CountBadge;
