import { Grid, Typography } from "@mui/material";

import { fontSize, padding } from "../../../../styles/constants";
import { FC } from "react";
import { NEWS_CARDS_DATA } from "./constants";
import NewsCard from "./components/NewsCard";

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
