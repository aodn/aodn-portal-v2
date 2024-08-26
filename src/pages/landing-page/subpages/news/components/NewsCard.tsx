import { FC } from "react";
import { NewsCardData } from "../constants";
import { Box, CardActionArea, CardMedia, Typography } from "@mui/material";
import {
  borderRadius,
  color,
  fontSize,
  fontWeight,
} from "../../../../../styles/constants";
import ReadMoreButton from "./ReadMoreButton";

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

export default NewsCard;
