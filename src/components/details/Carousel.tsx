import { Box, Card, Grid, IconButton, Slide, Stack } from "@mui/material";
import { useDetailPageContext } from "../../pages/detail-page/context/detail-page-context";
import { borderRadius, padding } from "../../styles/constants";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { FC, useEffect, useState } from "react";

const Carousel: FC = () => {
  const { photos } = useDetailPageContext();
  // cards will be the cards that are displayed
  const [cards, setCards] = useState<React.ReactElement[]>([]);
  // currentPage is the current page of the cards that is currently displayed
  const [currentPage, setCurrentPage] = useState(0);

  const [slideDirection, setSlideDirection] = useState<
    "right" | "left" | undefined
  >("left");

  const cardsPerPage: number = 3;
  const cardSize: number = 45;
  const containerWidth = cardsPerPage * cardSize;

  // these two functions handle changing the pages
  const handleNextPage = () => {
    setSlideDirection("left");
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setSlideDirection("right");
    setCurrentPage((prevPage) => prevPage - 1);
  };

  useEffect(() => {
    setCards(
      photos.map((photo, index) => (
        <Card
          key={index}
          sx={{
            width: `${cardSize}px`,
            height: `${cardSize}px`,
            borderRadius: borderRadius.small,
            cursor: "pointer",
            ":hover": {
              scale: "110%",
            },
          }}
        >
          <img
            src={photo.url}
            alt=""
            style={{
              objectFit: "cover",
              width: "100%",
              height: "100%",
            }}
          />
        </Card>
      ))
    );
  }, [photos]);

  return (
    <Grid
      container
      sx={{ padding: padding.medium }}
      arial-label="carousel container"
    >
      <Grid
        item
        xs={1}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        arial-label="go back button"
      >
        <IconButton onClick={handlePrevPage}>
          <ArrowBackIosIcon />
        </IconButton>
      </Grid>
      <Grid item xs={10}>
        <Box arial-label="cards container">
          <Box sx={{ width: `${containerWidth}px`, height: "100%" }}>
            {/* this is the box that holds the cards and the slide animation,
        in this implementation the card is already constructed but in later versions you will see how the
        items you wish to use will be dynamically created with the map method*/}
            {cards.map((card, index) => (
              <Box
                key={`card-${index}`}
                sx={{
                  width: "100%",
                  height: "100%",
                  display: currentPage === index ? "block" : "none",
                }}
              >
                {/* this is the slide animation that will be used to slide the cards in and out*/}
                <Slide direction={slideDirection} in={currentPage === index}>
                  <Stack
                    spacing={2}
                    direction="row"
                    alignContent="center"
                    justifyContent="center"
                    sx={{ width: "100%", height: "100%" }}
                  >
                    {/* this slices the cards array to only display the amount you have previously determined per page*/}
                    {cards.slice(
                      index * cardsPerPage,
                      index * cardsPerPage + cardsPerPage
                    )}
                  </Stack>
                </Slide>
              </Box>
            ))}
          </Box>
        </Box>
      </Grid>
      <Grid
        item
        xs={1}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
        arial-label="go forward button"
      >
        <IconButton onClick={handleNextPage}>
          <ArrowForwardIosIcon />
        </IconButton>
      </Grid>
    </Grid>
  );
};

export default Carousel;
