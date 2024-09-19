import AppTheme from "../../../../utils/AppTheme";
import { ThemeProvider } from "@mui/material/styles";
import { render, screen } from "@testing-library/react";
import CollapseItem from "../CollapseItem";
import { userEvent } from "@testing-library/user-event";
import CollapseContactItem from "../CollapseContactItem";
import { expect } from "vitest";

describe("CollapseItem", async () => {
  const theme = AppTheme;

  test("should render CollapseItem", async () => {
    render(
      <ThemeProvider theme={theme}>
        <CollapseItem title={"test collapse item"}>test item</CollapseItem>
      </ThemeProvider>
    );
    expect(screen.queryByTestId("collapseItem")).to.exist;
  });

  test("should not collapse when clicking title, if it is a contact item and already expanded", async () => {
    render(
      <ThemeProvider theme={theme}>
        <CollapseContactItem
          email="xxx@yyy.com"
          title={"test collapse item title"}
        >
          test item
        </CollapseContactItem>
      </ThemeProvider>
    );

    const collapseTitle = screen.queryByText("test collapse item title");
    expect(collapseTitle).not.toBeNull;

    // before clicking the title, the content should be collapsed
    expect(screen.queryByText("test item")).not.to.exist;
    // after clicking the title, the content should be expanded
    await userEvent.click(collapseTitle!);
    expect(screen.queryByText("test item")).to.exist;

    // Clicking the title now should not collapse the content as the title has been an email link
    await userEvent.click(collapseTitle!);
    expect(screen.queryByText("test item")).to.exist;

    // when already expanded, only clicking the expand icon to collapse the content
    await userEvent.click(screen.getByTestId("ExpandLessIcon"));
    expect(screen.queryByText("test item")).not.to.exist;
  });
});
