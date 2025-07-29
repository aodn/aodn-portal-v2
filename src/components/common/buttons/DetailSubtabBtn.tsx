import { ForwardedRef, forwardRef } from "react";
import { Box, Button, Typography, useTheme } from "@mui/material";
import { color } from "../../../styles/constants";

interface DetailSubtabProps {
  id?: string;
  title: string;
  onClick: () => void;
}

const DetailSubtabBtn = forwardRef<HTMLDivElement | null, DetailSubtabProps>(
  ({ id, title, onClick }, ref: ForwardedRef<HTMLDivElement>) => {
    const theme = useTheme();

    return (
      <Box
        ref={ref} // Must set ref to be the container ref
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          height: "45px",
          width: "160px",
          mx: theme.mp.lg,
        }}
      >
        <Button
          id={id}
          data-testid={id}
          sx={{
            width: "100%",
            "&:hover": {
              bgcolor: color.white.sixTenTransparent,
            },
            borderRadius: theme.borderRadius.sm,
            textAlign: "center",
            backgroundColor: "#fff",
          }}
          onClick={onClick}
        >
          <Typography variant="body1Medium">{title}</Typography>
        </Button>
      </Box>
    );
  }
);

DetailSubtabBtn.displayName = "DetailSubtab";
export default DetailSubtabBtn;
