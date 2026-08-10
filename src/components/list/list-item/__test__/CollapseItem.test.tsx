import AppTheme from "@/styles/theme";
import { ThemeProvider } from "@mui/material/styles";
import { render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
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

  test("should center the arrow by default and top-align it when arrowAlignment is top", async () => {
    render(
      <ThemeProvider theme={theme}>
        <CollapseItem title={"centered row"}>content</CollapseItem>
        <CollapseItem title={"top row"} arrowAlignment="top">
          content
        </CollapseItem>
      </ThemeProvider>
    );
    expect(screen.getByTestId("collapse-btn-centered row")).toHaveStyle({
      alignItems: "center",
    });
    expect(screen.getByTestId("collapse-btn-top row")).toHaveStyle({
      alignItems: "flex-start",
    });
  });

  test("should expand only via the arrow button, not the title", async () => {
    const user = userEvent.setup();
    render(
      <ThemeProvider theme={theme}>
        <CollapseItem title={"test collapse item"}>test item</CollapseItem>
      </ThemeProvider>
    );
    const content = screen.getByText("test item");
    expect(content).not.toBeVisible();

    // Clicking the title must not expand the content
    await user.click(screen.getByText("test collapse item"));
    expect(content).not.toBeVisible();

    // Clicking the arrow button expands it
    await user.click(
      screen.getByRole("button", { name: "expand or collapse" })
    );
    expect(content).toBeVisible();

    // Clicking the arrow again collapses it
    await user.click(
      screen.getByRole("button", { name: "expand or collapse" })
    );
    await waitFor(() => expect(content).not.toBeVisible());
  });
});
