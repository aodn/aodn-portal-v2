import { Box, Card, Grid, IconButton, Slide, Stack } from "@mui/material";
import { useDetailPageContext } from "../../pages/detail-page/context/detail-page-context";
import { borderRadius, padding } from "../../styles/constants";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { FC, useEffect, useState } from "react";
import { SpatialExtent } from "../../pages/detail-page/subpages/side-cards/SpatialExtendCard";

interface CarouselProps {
  extents: SpatialExtent[];
}

const Carousel: FC<CarouselProps> = ({ extents }) => {
  // cards will be the cards that are displayed
  const [cards, setCards] = useState<React.ReactElement[]>([]);
  // currentPage is the current page of the cards that is currently displayed
  const [currentPage, setCurrentPage] = useState(0);
  // slideDirection is the direction that the cards will slide in
  const [slideDirection, setSlideDirection] = useState<
    "right" | "left" | undefined
  >("left");

  // you can modify for your needs
  const cardsPerPage = 3;
  // this is just a dummy array of cards it uses the MUI card demo and repeats it 10 times
  // const duplicateCards: React.ReactElement[] = Array.from(
  //   { length: 10 },
  //   (_, i) => <Card key={i} />
  // );
  const renderCards = () => (
    <>
      {extents.map((extent, index) => (
        <div key={index}>{extent.url}</div>
      ))}
    </>
  );

  // these two functions handle changing the pages
  const handleNextPage = () => {
    setSlideDirection("left");
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setSlideDirection("right");
    setCurrentPage((prevPage) => prevPage - 1);
  };

  // This useEffect is really just for demonstration purposes
  // it sets the cards to the duplicateCards array
  // you can remove this and replace it with your own useEffect
  // or if your page is static you can just set the cards to the array
  // at the top of the file
  useEffect(() => {
    setCards(
      extents.map((extent, index) => (
        <Card
          key={index}
          sx={{
            width: "65px",
            height: "65px",
            borderRadius: borderRadius.small,
            cursor: "pointer",
            ":hover": {
              scale: "110%",
            },
          }}
        >
          <img
            src={extent.url}
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
    // eslint-disable-next-line
  }, []);
  // this sets the container width to the number of cards per page * 250px
  // which we know because it is defined in the card component
  const containerWidth = cardsPerPage * 65; // 250px per card

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
