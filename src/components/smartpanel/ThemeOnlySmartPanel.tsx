import { SmartCard11 } from "./SmartCard";
import { Grid, IconButton, Paper, Stack } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useCallback, useRef } from "react";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";

const Item = styled(Paper)(({ theme }) => ({
  textAlign: "center",
  minWidth: "100px",
  color: theme.palette.text.secondary,
}));

/**
 * Empty for now, implement it later
 * @constructor
 */
const ThemeOnlySmartPanel = () => {
  const stackRef = useRef<HTMLDivElement>(null);

  const scroll = useCallback(
    (scrollOffset: number) => {
      if (stackRef && stackRef.current) {
        stackRef.current.scrollLeft += scrollOffset;
      }
    },
    // eslint-disable-next-line prettier/prettier
    [stackRef]
  );

  return (
    <Grid container>
      <Grid item xs={12}>
        <Grid container justifyContent="center">
          <IconButton onClick={() => scroll(-50)}>
            <ArrowLeftIcon />
          </IconButton>
          <Grid item xs={8}>
            <Stack
              ref={stackRef}
              direction="row"
              spacing={2}
              sx={{ overflow: "hidden" }}
            >
              <Item>
                <SmartCard11
                  imageUrl="/smartcard/all_topics.png"
                  caption="More Topics"
                />
              </Item>
              <Item>
                <SmartCard11
                  imageUrl="/smartcard/environmental.png"
                  caption="Environmental"
                />
              </Item>
              <Item>
                <SmartCard11
                  imageUrl="/smartcard/leave.png"
                  caption="Ocean Biota"
                />
              </Item>
              <Item>
                <SmartCard11 imageUrl="/smartcard/tour.png" caption="Tourism" />
              </Item>
              <Item>
                <SmartCard11
                  imageUrl="/smartcard/oceancurrent.png"
                  caption="Ocean Current"
                />
              </Item>
              <Item>
                <SmartCard11
                  imageUrl="/smartcard/location.png"
                  caption="Location"
                />
              </Item>
              <Item>
                <SmartCard11
                  imageUrl="/smartcard/climate.png"
                  caption="Climatic"
                />
              </Item>
              <Item>
                <SmartCard11
                  imageUrl="/smartcard/fishery.png"
                  caption="Fishery"
                />
              </Item>
              <Item>
                <SmartCard11
                  imageUrl="/smartcard/chemical.png"
                  caption="Chemical"
                />
              </Item>
              <Item>
                <SmartCard11
                  imageUrl="/smartcard/animal.png"
                  caption="Animal"
                />
              </Item>
              <Item>
                <SmartCard11
                  imageUrl="/smartcard/environmental.png"
                  caption="Environmental"
                />
              </Item>
              <Item>
                <SmartCard11
                  imageUrl="/smartcard/leave.png"
                  caption="Ocean Biota"
                />
              </Item>
              <Item>
                <SmartCard11 imageUrl="/smartcard/tour.png" caption="Tourism" />
              </Item>
              <Item>
                <SmartCard11
                  imageUrl="/smartcard/oceancurrent.png"
                  caption="Ocean Current"
                />
              </Item>
              <Item>
                <SmartCard11
                  imageUrl="/smartcard/location.png"
                  caption="Location"
                />
              </Item>
              <Item>
                <SmartCard11
                  imageUrl="/smartcard/climate.png"
                  caption="Climatic"
                />
              </Item>
              <Item>
                <SmartCard11
                  imageUrl="/smartcard/fishery.png"
                  caption="Fishery"
                />
              </Item>
              <Item>
                <SmartCard11
                  imageUrl="/smartcard/chemical.png"
                  caption="Chemical"
                />
              </Item>
              <Item>
                <SmartCard11
                  imageUrl="/smartcard/animal.png"
                  caption="Animal"
                />
              </Item>
            </Stack>
          </Grid>
          <IconButton onClick={() => scroll(50)}>
            <ArrowRightIcon />
          </IconButton>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ThemeOnlySmartPanel;
