import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from "@testing-library/react";
import { vi, describe, it, expect, beforeEach, Mock } from "vitest";
import IconSelect, { IconSelectProps } from "../IconSelect";
import { FunctionComponent } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { SelectItem } from "../CommonSelect";
import { disableScroll, enableScroll } from "../../../../utils/ScrollUtils";
import AppTheme from "../../../../utils/AppTheme"; // Adjust to your theme path

// Mock dependencies
vi.mock("../../../utils/ScrollUtils", () => ({
  disableScroll: vi.fn(),
  enableScroll: vi.fn(),
}));

const theme = AppTheme;

// Sample IconComponent for testing
const IconComponent: FunctionComponent<{
  color?: string;
  bgColor?: string;
  dataTestId?: string;
}> = ({ color, bgColor, dataTestId }) => (
  <svg
    data-testid={dataTestId || "icon"}
    style={{ fill: color, backgroundColor: bgColor }}
  />
);

// Sample test data
const items: SelectItem<string>[] = [
  { value: "item1", label: "Item 1", icon: <svg data-testid="icon1" /> },
  { value: "item2", label: "Item 2", icon: IconComponent },
  { value: "item3", label: "Item 3" },
];

const defaultProps: IconSelectProps<string> = {
  items,
  selectName: "Test Select",
  dataTestId: "icon-select",
  onSelectCallback: vi.fn(),
};

// Helper to render with ThemeProvider
const renderWithTheme = (ui: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
};

describe("IconSelect", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders correctly with default props", () => {
    renderWithTheme(<IconSelect {...defaultProps} />);
    const select = screen.getByTestId("icon-select");
    expect(select).toBeInTheDocument();
    expect(screen.getByText("Test Select")).toBeInTheDocument(); // Default renderValue
    expect(screen.getByTestId("icon1")).toBeInTheDocument(); // Default icon
  });

  it("renders all menu items with icons and labels", () => {
    renderWithTheme(<IconSelect {...defaultProps} />);
    const select = screen.getByTestId("icon-select");

    // MUI Select bind its click function to its child component role="combobox", so need to find combobox before implement user click
    const combobox = within(select).getByRole("combobox");
    // Open dropdown
    fireEvent.mouseDown(combobox);

    items.forEach((item) => {
      expect(screen.getByText(item.label)).toBeInTheDocument();
      if (item.icon) {
        expect(screen.getAllByTestId("icon1").length).toBe(2);
      }
    });
  });

  it("handles uncontrolled behavior correctly", () => {
    renderWithTheme(<IconSelect {...defaultProps} />);

    // Open dropdown
    const select = screen.getByTestId("icon-select");
    const combobox = within(select).getByRole("combobox");
    fireEvent.mouseDown(combobox);

    // Select option "Item 2"
    const item2 = screen.getByText("Item 2");
    fireEvent.click(item2);

    return waitFor(() => {
      expect(defaultProps.onSelectCallback).toHaveBeenCalledWith("item2");
    }).then(() => {
      // Only one "Item 2" as the dropdown is closed after clicking option
      expect(screen.getAllByText("Item 2").length).toBe(1);
    });
  });

  it("handles controlled behavior correctly", () => {
    const { rerender } = renderWithTheme(
      <IconSelect {...defaultProps} value="item1" />
    );

    // Open dropdown
    const select = screen.getByTestId("icon-select-item1");
    const combobox = within(select).getByRole("combobox");
    fireEvent.mouseDown(combobox);

    // Select option "Item 3"
    const item3 = screen.getByText("Item 3");
    fireEvent.click(item3);

    return waitFor(() => {
      expect(defaultProps.onSelectCallback).toHaveBeenCalledWith("item3");
    }).then(() => {
      rerender(<IconSelect {...defaultProps} value="item3" />);
      expect(screen.getByTestId("icon-select-item3")).toBeInTheDocument();
      expect(screen.getByText("Item 3")).toBeInTheDocument();
    });
  });

  it("applies custom sx styles", () => {
    const customSx = { borderColor: "purple" };
    renderWithTheme(<IconSelect {...defaultProps} selectSx={customSx} />);
    const select = screen.getByTestId("icon-select");
    expect(select).toHaveStyle("border-color: purple");
  });

  it("renders with custom data-testid", () => {
    renderWithTheme(
      <IconSelect {...defaultProps} dataTestId="custom-select" />
    );
    expect(screen.getByTestId("custom-select")).toBeInTheDocument();
  });

  it("handles empty items gracefully", () => {
    renderWithTheme(<IconSelect {...defaultProps} items={[]} />);
    // If no item options provided, no content is rendered
    expect(screen.queryByText("Test Select")).not.toBeInTheDocument();

    const select = screen.getByTestId("icon-select");
    const combobox = within(select).getByRole("combobox");
    fireEvent.mouseDown(combobox);

    return waitFor(() =>
      expect(screen.queryAllByRole("option")).toHaveLength(0)
    );
  });

  it("renders icon-only mode correctly", () => {
    renderWithTheme(<IconSelect {...defaultProps} isIconOnly />);
    const select = screen.getByTestId("icon-select");
    expect(select).toBeInTheDocument();
    expect(screen.queryByText("Test Select")).not.toBeInTheDocument(); // No label in icon-only
    expect(screen.getByTestId("icon1")).toBeInTheDocument(); // Icon still renders
  });

  it("applies custom color config", () => {
    const customColorConfig = {
      defaultColor: "green",
      displayColor: "yellow",
      selectedColor: "blue",
      defaultBgColor: "gray",
      selectedBgColor: "black",
    };
    renderWithTheme(
      <IconSelect {...defaultProps} colorConfig={customColorConfig} />
    );
    const select = screen.getByTestId("icon-select");
    const combobox = within(select).getByRole("combobox");
    fireEvent.mouseDown(combobox);

    return waitFor(() => screen.getByTestId("icon")).then((icon) => {
      expect(icon).toHaveStyle(
        "fill: yellow; background-color: rgb(128, 128, 128);"
      ); // display gray color for MenuItem
    });
  });

  it("updates selectedItem when value prop changes", () => {
    const { rerender } = renderWithTheme(
      <IconSelect {...defaultProps} value="item1" />
    );
    expect(screen.getByTestId("icon-select-item1")).toBeInTheDocument();

    rerender(<IconSelect {...defaultProps} value="item2" />);
    expect(screen.getByTestId("icon-select-item2")).toBeInTheDocument();
    expect(screen.getByText("Item 2")).toBeInTheDocument();
  });

  it("renders number values correctly", () => {
    const numberItems: SelectItem<number>[] = [
      { value: 1, label: "One", icon: <svg data-testid="icon1" /> },
      { value: 2, label: "Two", icon: IconComponent },
    ];
    renderWithTheme(
      <IconSelect
        items={numberItems}
        selectName="Number Select"
        dataTestId="number-select"
      />
    );
    const select = screen.getByTestId("number-select");
    const combobox = within(select).getByRole("combobox");
    fireEvent.mouseDown(combobox);

    return waitFor(() =>
      expect(screen.getByText("Number Select")).toBeInTheDocument()
    ).then(() => {
      expect(screen.getByText("Two")).toBeInTheDocument();
    });
  });
});
