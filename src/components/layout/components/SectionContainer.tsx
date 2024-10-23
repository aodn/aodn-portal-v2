import { Box, Stack, SxProps } from "@mui/material";
import { ReactNode } from "react";
import {
  PAGE_CONTENT_MAX_WIDTH,
  PAGE_CONTENT_MIN_WIDTH,
  PAGE_CONTENT_WIDTH,
} from "../constant";

interface SectionContainerProps {
  children: ReactNode;
  contentAreaStyle?: SxProps;
  sectionAreaStyle?: SxProps;
}

const SectionContainer = ({
  children,
  contentAreaStyle,
  sectionAreaStyle,
}: SectionContainerProps) => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      ...sectionAreaStyle,
    }}
  >
    <Stack
      direction="column"
      gap={8}
      sx={{
        justifyContent: "center",
        alignItems: "center",
        minWidth: PAGE_CONTENT_MIN_WIDTH,
        width: PAGE_CONTENT_WIDTH,
        maxWidth: PAGE_CONTENT_MAX_WIDTH,
        ...contentAreaStyle,
      }}
    >
      {children}
    </Stack>
  </Box>
);

export default SectionContainer;
