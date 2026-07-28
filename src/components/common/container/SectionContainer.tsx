import { Box, Divider, Stack, SxProps } from "@mui/material";
import { ReactNode } from "react";
import { PAGE_CONTENT_MAX_WIDTH } from "@/app/layout/constant";

interface SectionContainerProps {
  children: ReactNode;
  contentAreaStyle?: SxProps;
  sectionAreaStyle?: SxProps;
  topDividerStyle?: SxProps;
  bottomDividerStyle?: SxProps;
}

const SectionContainer = ({
  children,
  contentAreaStyle,
  sectionAreaStyle,
  topDividerStyle = undefined,
  bottomDividerStyle = undefined,
}: SectionContainerProps) => {
  return (
    <>
      {topDividerStyle && <Divider variant="fullWidth" sx={topDividerStyle} />}
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
      {bottomDividerStyle && (
        <Divider variant="fullWidth" sx={bottomDividerStyle} />
      )}
    </>
  );
};

export default SectionContainer;
