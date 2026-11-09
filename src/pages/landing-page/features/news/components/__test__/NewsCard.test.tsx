import { render, screen } from "@testing-library/react";
import { ThemeProvider } from "@mui/material/styles";
import NewsCard from "@/pages/landing-page/features/news/components/NewsCard";
import AppTheme from "@/styles/theme";

describe("NewsCard", () => {
  it("provides a responsive image linked to the dataset in a new tab", () => {
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

    const imageLink = screen.getByRole("link", { name: "Test news item" });
    expect(imageLink).toHaveAttribute("href", "https://example.com/news");
    expect(imageLink).toHaveAttribute("target", "_blank");
    expect(imageLink).toHaveAttribute("rel", "noopener noreferrer");
    expect(imageLink).toContainElement(screen.getByTestId("News"));

    expect(screen.getByAltText("Test news item")).toHaveAttribute(
      "srcset",
      "/news-card-400.webp 400w, /news.webp 600w"
    );
  });
});
