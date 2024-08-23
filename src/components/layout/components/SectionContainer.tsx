import { Box, Stack, SxProps } from "@mui/material";
import { ReactNode } from "react";
import {
  LANDING_PAGE_MAX_WIDTH,
  LANDING_PAGE_MIN_WIDTH,
} from "../../../pages/landing-page/constants";

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
      justifyContent="center"
      alignItems="center"
      sx={{
        minWidth: LANDING_PAGE_MIN_WIDTH,
        width: "80%",
        maxWidth: LANDING_PAGE_MAX_WIDTH,
        ...contentAreaStyle,
      }}
    >
      {children}
    </Stack>
  </Box>
);

export default SectionContainer;
