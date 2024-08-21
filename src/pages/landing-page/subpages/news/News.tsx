import {
  Box,
  Button,
  CardActionArea,
  CardMedia,
  Grid,
  Icon,
  Typography,
} from "@mui/material";
import EastIcon from "@mui/icons-material/East";
import {
  borderRadius,
  color,
  fontSize,
  fontWeight,
  padding,
} from "../../../../styles/constants";
import { FC } from "react";
import { NEWS_CARDS_DATA, NewsCardData } from "./news-constants";

interface NewsCardProps {
  news: NewsCardData;
}

const NewsCard: FC<NewsCardProps> = ({ news }) => (
  <Box>
    <CardActionArea
      sx={{
        "& :hover": { cursor: "pointer", scale: "105%" },
      }}
    >
      <CardMedia
        component="img"
        height="280px"
        image={news.image}
        alt={`news image-${news.title}`}
        sx={{ borderRadius: borderRadius.large }}
      />
    </CardActionArea>
    <Box bgcolor={color.blue.extraDark}>
      <Box
        display="flex"
        flexDirection="row"
        flexWrap="wrap"
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography
          color="#fff"
          fontSize={fontSize.newsInfo}
          fontWeight={fontWeight.extraLight}
        >
          {news.category}
        </Typography>
        <Typography
          color="#fff"
          fontSize={fontSize.newsInfo}
          fontWeight={fontWeight.extraLight}
        >
          {news.date}
        </Typography>
      </Box>
      <Typography
        color="#fff"
        fontSize={fontSize.newsTitle}
        sx={{
          overflow: "hidden",
          textOverflow: "ellipsis",
          display: "-webkit-box",
          WebkitLineClamp: "2",
          WebkitBoxOrient: "vertical",
        }}
      >
        {news.title}
      </Typography>
    </Box>
    <ReadMoreButton />
  </Box>
);

const ReadMoreButton = () => (
  <Button sx={{ padding: 0 }}>
    <Box
      display="flex"
      justifyContent="start"
      alignContent="center"
      paddingY={padding.small}
    >
      <Typography
        color="#fff"
        fontSize={fontSize.newsInfo}
        fontWeight={fontWeight.extraLight}
        paddingTop={1}
        letterSpacing={1}
      >
        Read More
      </Typography>
      <Icon
        sx={{
          paddingLeft: padding.extraSmall,
          color: "#fff",
        }}
      >
        <EastIcon fontSize="small" />
      </Icon>
    </Box>
  </Button>
);

const News: FC = () => {
  return (
    <Grid container paddingY={padding.quadruple}>
      <Grid item xs={12}>
        <Typography color="#fff" fontSize={fontSize.newsInfo}>
          News
        </Typography>
        <Typography
          color="#fff"
          fontSize={fontSize.newsHeading}
          letterSpacing={2}
        >
          Read what&apos;s new
        </Typography>
      </Grid>
      <Grid item xs={12} paddingY={padding.triple}>
        <Grid container spacing={4}>
          {NEWS_CARDS_DATA.map((news) => (
            <Grid key={news.id} item xs={6} lg={4}>
              <NewsCard news={news} />
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default News;
