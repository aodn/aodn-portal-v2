import { FC } from "react";
import { OGCCollection } from "../../../common/store/searchReducer";
import { ThemeProvider } from "@mui/material/styles";
import AppTheme from "../../../../utils/AppTheme";
import ListResultCard from "../../../result/ListResultCard";
import {
  Card,
  CardActionArea,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";

import { fontWeight } from "../../../../styles/constants";

interface MapPopupProps {
  collection: OGCCollection;
  onClickPopup?: ((uuid: string) => void) | undefined;
}

const MapPopup: FC<MapPopupProps> = ({ collection, onClickPopup }) => {
  const handleClick = () => {
    if (onClickPopup) {
      onClickPopup(collection.id);
    }
  };
  return (
    <ThemeProvider theme={AppTheme}>
      {/* <ListResultCard
        content={collection}
        onClickCard={handleClick}
      /> */}
      <Card
        elevation={0}
        sx={{ height: "100%", minWidth: "200px" }}
        data-testid="result-card-grid"
      >
        <CardActionArea onClick={handleClick}>
          <CardContent>
            <Stack direction="column" justifyContent="left" alignItems="center">
              <Typography
                fontWeight={fontWeight.bold}
                sx={{
                  padding: 0,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: "2",
                  WebkitBoxOrient: "vertical",
                }}
              >
                {collection.title}
              </Typography>
              <Typography
                sx={{
                  padding: 0,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: "4",
                  WebkitBoxOrient: "vertical",
                }}
              >
                {collection.description}
              </Typography>
            </Stack>
          </CardContent>
        </CardActionArea>
      </Card>
    </ThemeProvider>
  );
};

export default MapPopup;
