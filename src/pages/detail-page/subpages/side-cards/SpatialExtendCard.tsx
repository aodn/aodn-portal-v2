import { Box, Stack } from "@mui/material";
import Carousel from "../../../../components/details/Carousel";
import SideCardContainer from "./SideCardContainer";
import {
  SpatialExtentPhoto,
  useDetailPageContext,
} from "../../context/detail-page-context";
import { useEffect, useState } from "react";

// TODO: use real bboxes to generate map shots,
// and replace with real map & extents urls
const mockSpatialExtent = {
  bbox: [
    [113, -43, 154, -11],
    [115, -23.535, 152.87, -9.5],
    [113, -43, 154, -12],
    [112, -34, 116, -30],
    [151.256, -34.148, 151.256, -34.148],
    [109, -43, 154, -11],
    [-180, -90, 180, 90],
  ],
};

const mockSpatialExtentUrls = [
  "public/bg_landing_page.png",
  "public/landing_page_bg.png",
  "public/bg_search_results.png",
  "public/landing_page_bg.png",
  "public/bg_search_results.png",
  "public/landing_page_bg.png",
  "public/bg_search_results.png",
];

const SpatialExtendCard = () => {
  const { collection } = useDetailPageContext();
  const [extents, setExtents] = useState<SpatialExtentPhoto[]>([]);
  const [mainMap, setMainMap] = useState<SpatialExtentPhoto>();

  // TODO: need to define a default bbox
  // const spatialExtent: number[] | number[][] = collection.extent?.bbox ?? [
  //   113, -43, 154, -9,
  // ];
  const spatialExtents = mockSpatialExtent.bbox;
  const spatialExtentUrls = mockSpatialExtentUrls;

  useEffect(() => {
    // make sure the number of bboxes is the same as number of urls
    if (spatialExtents.length !== spatialExtentUrls.length) return;

    let mainMapBbox = [] as number[] | undefined;
    let extentsBboxes = [] as number[][] | undefined;

    if (Array.isArray(spatialExtents[0])) {
      // if spatial extent is an array which nests arrays, it means that the first array is mainMap-Bbox, the others are sub extentsBboxes
      mainMapBbox = spatialExtents[0] as unknown as number[];
      extentsBboxes = spatialExtents.slice(
        1,
        spatialExtents.length + 1
      ) as unknown as number[][];

      setMainMap({
        bbox: mainMapBbox,
        url: spatialExtentUrls[0],
      });

      extentsBboxes.map((extentBbox, index) => {
        if (extentsBboxes && index > extentsBboxes.length) return;
        setExtents((prev) => [
          ...prev,
          { bbox: extentBbox, url: spatialExtentUrls[index + 1] },
        ]);
      });
    } else {
      // if spatial extent only has one array, it means it doesn't have any sub extents
      mainMapBbox = spatialExtents as unknown as number[];

      const mainMap = {
        bbox: mainMapBbox,
        url: mockSpatialExtentUrls[0],
      };
      setMainMap(mainMap);
    }
  }, []);

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
