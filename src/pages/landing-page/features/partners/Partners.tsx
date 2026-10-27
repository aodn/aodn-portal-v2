import { FC } from "react";
import { Box, Typography } from "@mui/material";
import { useAppDispatch } from "@/app/store/hooks";
import {
  clearComponentParam,
  updateDatasetGroup,
} from "@/app/store/componentParamReducer";
import useRedirectSearch from "@/hooks/useRedirectSearch";
import useBreakpoint from "@/hooks/useBreakpoint";
import { SearchKeys } from "@/components/search/constants";
import { CONTRIBUTORS, PARTNERS_COLOURS } from "./constants";
import ImosDataCard from "./components/ImosDataCard";
import ContributorCard from "./components/ContributorCard";
import NcrisCard from "./components/NcrisCard";

const Partners: FC = () => {
  const dispatch = useAppDispatch();
  const redirectSearch = useRedirectSearch();
  const { isAboveDesktop, isLaptop, isMobile, isLargeMobile } = useBreakpoint();

  // Fewer cards per row on smaller screens,
  // so each card is wide enough for its hover text
  const columns = isAboveDesktop ? 4 : isLaptop ? 3 : 2;
  const gridGap = isAboveDesktop
    ? "48px 26px"
    : isLaptop
      ? "36px 20px"
      : isMobile
        ? "14px 12px"
        : "26px 18px";

  // Open the search page filtered by one organisation
  const searchByDatasetGroup = (datasetGroup: SearchKeys) => {
    dispatch(clearComponentParam());
    dispatch(updateDatasetGroup(datasetGroup));
    redirectSearch("Partners");
  };

  return (
    <Box
      component="section"
      aria-label="Access to IMOS data and AODN contributors"
      data-testid="partners-section"
      sx={{
        width: "100%",
        pt: isMobile ? "52px" : "76px",
        pb: isMobile ? "56px" : "78px",
      }}
    >
      <ImosDataCard onExplore={() => searchByDatasetGroup(SearchKeys.IMOS)} />

      <Box sx={{ mt: isMobile ? "44px" : "64px" }}>
        <Typography
          component="h2"
          variant={isLargeMobile ? "heading3" : "heading2"}
          sx={{ color: PARTNERS_COLOURS.heading }}
        >
          AODN Contributors
        </Typography>
        <Typography
          component="p"
          variant="title2Regular"
          sx={{ mt: "6px", color: PARTNERS_COLOURS.subtitle }}
        >
          The AODN brings together metadata from organisations across Australia
          describing their marine and climate science data. Data providers
          retain responsibility for their datasets, while AODN provides a
          central portal that makes these data discoverable and connects users
          to available data access services.
        </Typography>
        <Box
          role="list"
          aria-label="AODN contributors"
          data-testid="contributor-list"
          sx={{
            display: "grid",
            gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
            // All rows as tall as the tallest card
            gridAutoRows: "1fr",
            gap: gridGap,
            mt: isMobile ? "18px" : "22px",
          }}
        >
          {CONTRIBUTORS.map((contributor) => (
            <ContributorCard
              key={contributor.datasetGroup}
              contributor={contributor}
              onViewDatasets={() =>
                searchByDatasetGroup(contributor.datasetGroup)
              }
            />
          ))}
        </Box>
      </Box>

      <NcrisCard />
    </Box>
  );
};

export default Partners;
