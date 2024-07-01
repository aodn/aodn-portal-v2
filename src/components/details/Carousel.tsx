import { Box, Card, Grid, IconButton, Slide, Stack } from "@mui/material";
import {
  SpatialExtentPhoto,
  useDetailPageContext,
} from "../../pages/detail-page/context/detail-page-context";
import { borderRadius, padding } from "../../styles/constants";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { FC, useCallback, useEffect, useState } from "react";

const Carousel: FC = () => {
  const { extentsPhotos, setPhotoSelected } = useDetailPageContext();
  // State to store the cards to be displayed in the carousel
  const [cards, setCards] = useState<React.ReactElement[]>([]);
  // State to track the current page of cards being displayed
  const [currentPage, setCurrentPage] = useState(0);
  // State to track the direction of the slide animation
  const [slideDirection, setSlideDirection] = useState<
    "right" | "left" | undefined
  >("left");

  const cardsPerPage: number = 3;
  const cardSize: number = 70;
  const containerWidth = cardsPerPage * cardSize;

  // Function to handle moving to the next page of cards
  const handleNextPage = () => {
    setSlideDirection("left");
    setCurrentPage((prevPage) => {
      // if it is the last page, user cannot go further next page
      const totalPages = Math.ceil(cards.length / cardsPerPage);
      if (prevPage + 1 === totalPages) return prevPage;
      return prevPage + 1;
    });
  };

  // Function to handle moving to the previous page of cards
  const handlePrevPage = () => {
    setSlideDirection("right");
    setCurrentPage((prevPage) => {
      if (prevPage === 0) return prevPage;
      return prevPage - 1;
    });
  };

  const handleClick = useCallback(
    (photo: SpatialExtentPhoto) => {
      setPhotoSelected(photo);
    },
    [setPhotoSelected]
  );

  // Update and map cards when extentsPhotos changes
  useEffect(() => {
    if (!extentsPhotos) return;
    setCards(
      extentsPhotos.map((photo, index) => (
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
          onClick={() => handleClick(photo)}
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
  }, [extentsPhotos, extentsPhotos?.length, handleClick]);

  if (!extentsPhotos || extentsPhotos.length === 0) return;

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
            {/* Container for the cards and the slide animation */}
            {cards.map((card, index) => (
              <Box
                key={`card-${index}`}
                sx={{
                  width: "100%",
                  height: "100%",
                  display: currentPage === index ? "block" : "none",
                }}
              >
                {/* Slide animation for the cards */}
                <Slide direction={slideDirection} in={currentPage === index}>
                  <Stack
                    spacing={2}
                    direction="row"
                    alignContent="center"
                    justifyContent="center"
                    sx={{ width: "100%", height: "100%" }}
                  >
                    {/* Slicing the cards array to display the cards for the current page */}
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
