import { Box, Stack, SxProps } from "@mui/material";
import { ReactNode } from "react";
import {
  PAGE_CONTENT_MAX_WIDTH,
  PAGE_CONTENT_MIN_WIDTH,
  PAGE_CONTENT_WIDTH_ABOVE_LAPTOP,
  PAGE_CONTENT_WIDTH_UNDER_LAPTOP,
} from "../constant";
import useBreakpoint from "../../../hooks/useBreakpoint";

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
  const { isUnderLaptop } = useBreakpoint();
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
          minWidth: PAGE_CONTENT_MIN_WIDTH,
          width: isUnderLaptop
            ? PAGE_CONTENT_WIDTH_UNDER_LAPTOP
            : PAGE_CONTENT_WIDTH_ABOVE_LAPTOP,
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
