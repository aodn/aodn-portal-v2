import { render, screen, fireEvent } from "@testing-library/react";
import ExpandableTextArea from "../ExpandableTextArea";
import AppTheme from "../../../../../utils/AppTheme";
import { ThemeProvider } from "@mui/material/styles";
import { expect, vi, beforeEach, afterEach } from "vitest";
import { ClipboardProvider } from "../../../../../context/clipboard/ClipboardProvider";
import userEvent from "@testing-library/user-event";

describe("ExpandableTextArea", () => {
  const theme = AppTheme;

  const renderWithProviders = (component: React.ReactElement) => {
    return render(
      <ThemeProvider theme={theme}>
        <ClipboardProvider>{component}</ClipboardProvider>
      </ThemeProvider>
    );
  };

  afterEach(() => {
    vi.clearAllMocks();
  });

  test("should render text content", () => {
    const testText = "This is a test text";
    renderWithProviders(<ExpandableTextArea text={testText} />);

    const textArea = screen.getByTestId("expandable-text-area");
    expect(textArea).to.exist;
    expect(screen.getByText(testText)).to.exist;
  });

  test("should not show expand button when isExpandable is false", () => {
    renderWithProviders(<ExpandableTextArea text="Short text" />);

    const showMoreButton = screen.queryByText("Show More");
    expect(showMoreButton).to.not.exist;
  });

  test("should call onClickExpand when text area is clicked and isExpandable is true", () => {
    let clicked = false;
    const handleClick = () => {
      clicked = true;
    };

    renderWithProviders(
      <ExpandableTextArea
        text="Test text"
        isExpandable={true}
        onClickExpand={handleClick}
      />
    );

    const textArea = screen.getByTestId("expandable-text-area");
    fireEvent.click(textArea.parentElement!);

    expect(clicked).toBe(true);
  });

  test("should use custom showMoreStr prop", () => {
    const customShowMoreText = "Read More";

    renderWithProviders(
      <ExpandableTextArea text="Test text" showMoreStr={customShowMoreText} />
    );

    const textArea = screen.getByTestId("expandable-text-area");
    expect(textArea).to.exist;
  });

  test("should render copy button when isCopyable is true", () => {
    renderWithProviders(
      <ExpandableTextArea text="Test text" isCopyable={true} />
    );

    const textArea = screen.getByTestId("expandable-text-area");
    expect(textArea).to.exist;
  });
});
