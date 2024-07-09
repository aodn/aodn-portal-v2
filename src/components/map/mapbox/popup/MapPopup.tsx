import { FC } from "react";
import { OGCCollection } from "../../../common/store/searchReducer";
import { ThemeProvider } from "@mui/material/styles";
import AppTheme from "../../../../utils/AppTheme";
import ListResultCard from "../../../result/ListResultCard";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import { fontWeight } from "../../../../styles/constants";

interface MapPopupProps {
  collection: OGCCollection;
  onClickPopup?: ((uuid: string) => void) | undefined;
  isLoading?: boolean;
}

const POPUP_WIDTH = "250px";
const POPUP_HEIGHT = "180px";

const MapPopup: FC<MapPopupProps> = ({
  collection,
  onClickPopup,
  isLoading = false,
}) => {
  const handleClick = () => {
    if (onClickPopup) {
      onClickPopup(collection.id);
    }
  };

  if (isLoading)
    return (
      <Box
        sx={{
          transition: "opacity 0.2s ease-in-out",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: POPUP_HEIGHT,
          width: POPUP_WIDTH,
        }}
      >
        <CircularProgress />
      </Box>
    );
  return (
    <ThemeProvider theme={AppTheme}>
      {/* <ListResultCard
        content={collection}
        onClickCard={handleClick}
      /> */}
      <Card
        elevation={0}
        sx={{ height: POPUP_HEIGHT, width: POPUP_WIDTH }}
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
                  maxWidth: "100%",
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
