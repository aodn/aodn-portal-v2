import { OGCCollection } from "../common/store/searchReducer";
import { Grid, Box } from "@mui/material";
import { DetailsHeader, DetailsHeaderButton } from "./DetailsHeader";
import React from "react";
import { ContentCard, LinkCard, MapCard } from "./DetailsCards";
import { border, borderRadius, margin } from "../../styles/constants";

export interface DetailsProps {
  collection?: OGCCollection;
}

const DetailsPanel = (props: DetailsProps) => {
  return (
    <Grid id={"details-page-panel"} container>
      <Grid
        item
        xs={12}
        sx={{
          marginTop: margin["top"],
          marginBottom: margin["bottom"],
        }}
      >
        <Grid
          container
          id="details-page-center-panel"
          justifyContent="center"
          spacing={2}
          gap={2}
        >
          <Grid item xs={8}>
            <DetailsHeaderButton />
          </Grid>
          <Grid item xs={8}>
            <DetailsHeader collection={props.collection} />
          </Grid>
          <Grid item xs={8}>
            <Box display="grid" gridTemplateColumns={"repeat(6, 1fr)"}>
              <Box
                sx={{
                  gridColumn: "span 5",
                  gridRow: "span 1",
                  border: border["buttonBorder"],
                  borderRadius: borderRadius["filter"],
                  marginBottom: margin["bottom"],
                }}
              >
                <MapCard collection={undefined} />
              </Box>
              <Box
                sx={{
                  gridColumn: "span 5",
                  gridRow: "span 1",
                  border: border["buttonBorder"],
                  borderRadius: borderRadius["filter"],
                  marginBottom: margin["bottom"],
                }}
              >
                <ContentCard collection={props.collection} />
              </Box>
              <Box
                sx={{
                  gridColumn: "span 5",
                  gridRow: "span 1",
                  border: border["buttonBorder"],
                  borderRadius: borderRadius["filter"],
                  marginBottom: margin["bottom"],
                }}
              >
                <LinkCard collection={props.collection} />
              </Box>
              <Box
                sx={{
                  gridColumn: "span 1",
                  gridRow: "span 1",
                }}
              ></Box>
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default DetailsPanel;
