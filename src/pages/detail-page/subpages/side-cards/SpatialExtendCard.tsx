import { Box, Stack } from "@mui/material";
import Carousel from "../../../../components/details/Carousel";
import SideCardContainer from "./SideCardContainer";
import { useDetailPageContext } from "../../context/detail-page-context";

const SpatialExtendCard = () => {
  const { collection } = useDetailPageContext();
  const { photos } = useDetailPageContext();
  const mainMap = photos[0];

  if (!collection) return;
  return (
    <SideCardContainer title="Spatial Extend">
      <Stack direction="column">
        {mainMap && (
          <Box sx={{ width: "100%", height: "250px" }}>
            <img
              src={mainMap.url}
              alt="imos_logo"
              style={{
                objectFit: "cover",
                width: "100%",
                height: "100%",
              }}
            />
          </Box>
        )}

        <Carousel />
      </Stack>
    </SideCardContainer>
  );
};

export default SpatialExtendCard;
