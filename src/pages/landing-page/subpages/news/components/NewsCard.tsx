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
import { openInNewTab } from "../../../../../utils/LinkUtils";

interface NewsCardProps {
  news: NewsCardData;
}

const NewsCard: FC<NewsCardProps> = ({ news }) => {
  const handleReadMoreClick = (url: string) => openInNewTab(url);

  return (
    <Box>
      <CardActionArea
        sx={{
          "& :hover": { cursor: "pointer" },
        }}
        onClick={() => handleReadMoreClick(news.link)}
      >
        <CardMedia
          component="img"
          height="280px"
          image={news.image}
          alt={`news image-${news.title}`}
          data-testid={news.subheading}
          sx={{
            borderRadius: borderRadius.large,
            objectFit: "cover",
            objectPosition: "center",
          }}
        />
      </CardActionArea>
      <Box bgcolor={color.blue.extraDark}>
        <Box
          display="flex"
          flexDirection="row"
          flexWrap="wrap"
          alignItems="center"
        >
          <Typography
            color="#fff"
            fontSize={fontSize.newsInfo}
            fontWeight={fontWeight.extraLight}
          >
            {news.subheading}
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
      <ReadMoreButton onClick={() => handleReadMoreClick(news.link)} />
    </Box>
  );
};

export default NewsCard;
