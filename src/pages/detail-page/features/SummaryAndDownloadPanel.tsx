import { FC, useMemo } from "react";
import { Box, Grid, Stack } from "@mui/material";
import { useDetailPageContext } from "../context/detail-page-context";
import ExpandableTextArea from "../../../components/list/listItem/subitem/ExpandableTextArea";
import useBreakpoint from "../../../hooks/useBreakpoint";
import AIGenTag from "../../../components/info/AIGenTag";
import { portalTheme } from "../../../styles";

const SummaryAndDownloadPanel: FC = () => {
  const { collection } = useDetailPageContext();
  const { isUnderLaptop, isMobile } = useBreakpoint();

  const abstract = useMemo(
    () => collection?.getEnhancedDescription() || collection?.description || "",
    [collection]
  );

  return (
    collection && (
      <Grid container>
        <Grid item xs={12}>
          <Stack direction="column">
            <Stack position="relative" direction={"row"}>
              <Box position="absolute" top={-6} right={-6}>
                <AIGenTag
                  infoContent={{
                    title: "Content reformatted",
                    body: "The abstract content of metadata is reformatted by AI models into a better layout.",
                  }}
                />
              </Box>
              <ExpandableTextArea
                text={abstract}
                showMoreStr={"Show All"}
                defaultExpanded={isMobile}
                sx={{
                  width: isUnderLaptop ? "95%" : "98%",
                  "& button": {
                    fontSize: "16px",
                    color: portalTheme.palette.text1,
                    lineHeight: "24px",
                  },
                }}
              />
            </Stack>
          </Stack>
        </Grid>
      </Grid>
    )
  );
};

export default SummaryAndDownloadPanel;
