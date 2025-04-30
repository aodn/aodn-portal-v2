import { render, screen, fireEvent, waitFor } from "@testing-library/react";
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

// Setup mocks
const mockDisableScroll = disableScroll as Mock;
const mockEnableScroll = enableScroll as Mock;

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

    waitFor(() => screen.findByText(items[2].label)).then(() => {
      fireEvent.mouseDown(select); // Open dropdown
      items.forEach((item) => {
        expect(screen.getByText(item.label)).toBeInTheDocument();
        if (item.icon) {
          expect(
            screen.getByTestId(item.value === "item1" ? "icon1" : "icon")
          ).toBeInTheDocument();
        }
      });
    });
  });

  it("handles uncontrolled behavior correctly", () => {
    renderWithTheme(<IconSelect {...defaultProps} />);
    const select = screen.getByTestId("icon-select");

    waitFor(() => screen.findByText(items[2].label)).then(() => {
      fireEvent.mouseDown(select);
      const item2 = screen.getByText("Item 2");
      fireEvent.click(item2);
      waitFor(() => {
        expect(defaultProps.onSelectCallback).toHaveBeenCalledWith("item2");
        expect(screen.getByTestId("icon-select-item2")).toBeInTheDocument(); // Dynamic testId
        expect(screen.getByText("Item 2")).toBeInTheDocument();
      });
    });
  });

  it("handles controlled behavior correctly", () => {
    const onSelectCallback = vi.fn();
    const { rerender } = renderWithTheme(
      <IconSelect
        {...defaultProps}
        value="item1"
        onSelectCallback={onSelectCallback}
      />
    );
    const select = screen.getByTestId("icon-select-item1");

    waitFor(() => screen.findByText(items[2].label)).then(() => {
      fireEvent.mouseDown(select);
      const item3 = screen.getByText("Item 3");
      fireEvent.click(item3);
      waitFor(() => {
        expect(onSelectCallback).toHaveBeenCalledWith("item3");
      });
      rerender(
        <IconSelect
          {...defaultProps}
          value="item3"
          onSelectCallback={onSelectCallback}
        />
      );
      expect(screen.getByTestId("icon-select-item3")).toBeInTheDocument();
      expect(screen.getByText("Item 3")).toBeInTheDocument();
    });
  });

  it("applies custom sx styles", () => {
    const customSx = { borderColor: "purple" };
    renderWithTheme(<IconSelect {...defaultProps} sx={customSx} />);
    const select = screen.getByTestId("icon-select");
    waitFor(() => screen.findByText(items[2].label)).then(() => {
      expect(select).toHaveStyle("border-color: purple");
    });
  });

  it("renders with custom data-testid", () => {
    renderWithTheme(
      <IconSelect {...defaultProps} dataTestId="custom-select" />
    );
    expect(screen.getByTestId("custom-select")).toBeInTheDocument();
  });

  it("handles empty items gracefully", () => {
    renderWithTheme(<IconSelect {...defaultProps} items={[]} />);
    const select = screen.getByTestId("icon-select");

    waitFor(() => screen.findByText(items[2].label)).then(() => {
      expect(select).toBeInTheDocument();
      expect(screen.getByText("Test Select")).toBeInTheDocument(); // Default renderValue
      fireEvent.mouseDown(select);
      expect(screen.queryAllByRole("option")).toHaveLength(0);
    });
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
    waitFor(() => screen.findByText(items[2].label)).then(() => {
      fireEvent.mouseDown(select);
      const icon = screen.getByTestId("icon"); // IconComponent
      expect(icon).toHaveStyle("fill: yellow"); // displayColor for MenuItem
      expect(icon).toHaveStyle("background-color: gray"); // defaultBgColor
    });
  });

  it("calls scroll utilities when opening/closing dropdown", () => {
    renderWithTheme(<IconSelect {...defaultProps} />);
    const select = screen.getByTestId("icon-select");

    waitFor(() => screen.findByText(items[2].label)).then(() => {
      fireEvent.mouseDown(select);
      expect(mockDisableScroll).toHaveBeenCalled();
      fireEvent.keyDown(select, { key: "Escape" });
      expect(mockEnableScroll).toHaveBeenCalled();
    });
  });

  it("updates selectedItem when value prop changes", () => {
    const { rerender } = renderWithTheme(
      <IconSelect {...defaultProps} value="item1" />
    );
    waitFor(() => screen.findByText(items[2].label)).then(() => {
      expect(screen.getByTestId("icon-select-item1")).toBeInTheDocument();
      rerender(<IconSelect {...defaultProps} value="item2" />);
      expect(screen.getByTestId("icon-select-item2")).toBeInTheDocument();
      expect(screen.getByText("Item 2")).toBeInTheDocument();
    });
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

    waitFor(() => screen.findByText(items[2].label)).then(() => {
      expect(select).toBeInTheDocument();
      expect(screen.getByText("Number Select")).toBeInTheDocument();
      fireEvent.mouseDown(select);
      expect(screen.getByText("Two")).toBeInTheDocument();
      expect(screen.getByTestId("icon1")).toBeInTheDocument();
    });
  });
});
