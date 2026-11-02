import { render, screen } from "@testing-library/react";
import { ThemeProvider } from "@mui/material/styles";
import NewsCard from "@/pages/landing-page/features/news/components/NewsCard";
import AppTheme from "@/styles/theme";

describe("NewsCard", () => {
  it("provides responsive sources for its image", () => {
    render(
      <ThemeProvider theme={AppTheme}>
        <NewsCard
          news={{
            id: 1,
            image: "/news.webp",
            imageSrcSet: "/news-card-400.webp 400w, /news.webp 600w",
            subheading: "News",
            title: "Test news item",
            description: "A highlighted ocean dataset.",
            link: "https://example.com/news",
          }}
        />
      </ThemeProvider>
    );

    expect(screen.getByAltText("Test news item")).toHaveAttribute(
      "srcset",
      "/news-card-400.webp 400w, /news.webp 600w"
    );
  });
});
