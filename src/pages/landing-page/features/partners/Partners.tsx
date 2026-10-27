import { FC } from "react";
import { Box, Typography } from "@mui/material";
import { useAppDispatch } from "@/app/store/hooks";
import {
  clearComponentParam,
  updateDatasetGroup,
} from "@/app/store/componentParamReducer";
import useRedirectSearch from "@/hooks/useRedirectSearch";
import { SearchKeys } from "@/components/search/constants";
import { CONTRIBUTORS, PARTNERS_COLOURS, PARTNERS_MEDIA } from "./constants";
import ImosDataCard from "./components/ImosDataCard";
import ContributorCard from "./components/ContributorCard";
import NcrisCard from "./components/NcrisCard";

const Partners: FC = () => {
  const dispatch = useAppDispatch();
  const redirectSearch = useRedirectSearch();

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
        pt: "76px",
        pb: "78px",
        [PARTNERS_MEDIA.tablet]: { pt: "52px", pb: "56px" },
      }}
    >
      <ImosDataCard onExplore={() => searchByDatasetGroup(SearchKeys.IMOS)} />

      <Box sx={{ mt: "64px", [PARTNERS_MEDIA.tablet]: { mt: "44px" } }}>
        <Typography
          component="h2"
          variant="heading2"
          sx={{
            lineHeight: 1.3,
            letterSpacing: "-0.2px",
            color: PARTNERS_COLOURS.heading,
            [PARTNERS_MEDIA.tablet]: { fontSize: "22px" },
            [PARTNERS_MEDIA.smallPhone]: { fontSize: "20px" },
          }}
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
            gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
            // All rows as tall as the tallest card
            gridAutoRows: "1fr",
            gap: "48px 26px",
            mt: "22px",
            // Fewer cards per row on smaller screens,
            // so each card is wide enough for its hover text
            [PARTNERS_MEDIA.belowDesktop]: {
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: "36px 20px",
            },
            [PARTNERS_MEDIA.belowLaptop]: {
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: "26px 18px",
            },
            [PARTNERS_MEDIA.tablet]: { mt: "18px" },
            [PARTNERS_MEDIA.largePhone]: { gap: "14px 12px" },
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
