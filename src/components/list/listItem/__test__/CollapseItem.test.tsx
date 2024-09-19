import AppTheme from "../../../../utils/AppTheme";
import { ThemeProvider } from "@mui/material/styles";
import { render, screen } from "@testing-library/react";
import CollapseItem from "../CollapseItem";

describe("CollapseItem", async () => {
  const theme = AppTheme;

  test("should render CollapseItem", async () => {
    render(
      <ThemeProvider theme={theme}>
        <CollapseItem title={"test collapse item"}>test item</CollapseItem>
      </ThemeProvider>
    );
    expect(screen.queryByTestId("collapseItem")).not.toBeNull();
  });
});
