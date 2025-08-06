import { ForwardedRef, forwardRef } from "react";
import { Box, Button, Typography } from "@mui/material";
import rc8Theme from "../../../styles/themeRC8";

interface DetailSubtabProps {
  id?: string;
  title: string;
  onClick: () => void;
}

const DetailSubtabBtn = forwardRef<HTMLDivElement | null, DetailSubtabProps>(
  ({ id, title, onClick }, ref: ForwardedRef<HTMLDivElement>) => {
    return (
      <Box
        ref={ref} // Must set ref to be the container ref
      >
        <Button
          id={id}
          data-testid={id}
          onClick={onClick}
          sx={{
            width: "100%",
            backgroundColor: "#fff",
            justifyContent: "flex-start",
            "&:hover": {
              bgcolor: "transparent",
            },
          }}
        >
          <Typography
            sx={{
              ...rc8Theme.typography.body1Medium,
              color: rc8Theme.palette.text1,
              textAlign: "left",
              pb: "6px",
              pl: "2px",
            }}
          >
            {title}
          </Typography>
        </Button>
      </Box>
    );
  }
);

DetailSubtabBtn.displayName = "DetailSubtab";
export default DetailSubtabBtn;
