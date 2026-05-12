import { Box, Stack, SxProps } from "@mui/material";
import { ReactNode } from "react";
import { PAGE_CONTENT_MAX_WIDTH } from "../constant";

interface SectionContainerProps {
  children: ReactNode;
  contentAreaStyle?: SxProps;
  sectionAreaStyle?: SxProps;
}

const SectionContainer = ({
  children,
  contentAreaStyle,
  sectionAreaStyle,
}: SectionContainerProps) => {
  return (
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
        sx={{
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          maxWidth: PAGE_CONTENT_MAX_WIDTH,
          ...contentAreaStyle,
        }}
      >
        {children}
      </Stack>
    </Box>
  );
};

export default SectionContainer;
