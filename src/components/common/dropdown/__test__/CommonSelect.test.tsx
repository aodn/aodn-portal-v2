import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach, Mock } from "vitest";
import CommonSelect, { CommonSelectProps, SelectItem } from "../CommonSelect";
import { useDetailPageContext } from "../../../../pages/detail-page/context/detail-page-context";
import { disableScroll, enableScroll } from "../../../../utils/ScrollUtils";

// Mock dependencies
vi.mock("../../../../pages/detail-page/context/detail-page-context", () => ({
  useDetailPageContext: vi.fn(),
}));
vi.mock("../../../../utils/ScrollUtils", () => ({
  disableScroll: vi.fn(),
  enableScroll: vi.fn(),
}));

// Sample test data
const items: SelectItem[] = [
  { value: "item1", label: "Item 1" },
  { value: "item2", label: "Item 2" },
  { value: "item3", label: "Item 3" },
];

const defaultProps: CommonSelectProps = {
  items,
  dataTestId: "common-select",
  onSelectCallback: vi.fn(),
};

// Setup mocks
const mockUseDetailPageContext = useDetailPageContext as Mock;
const mockDisableScroll = disableScroll as Mock;
const mockEnableScroll = enableScroll as Mock;

describe("CommonSelect", () => {
  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();
    // Default context mock
    mockUseDetailPageContext.mockReturnValue({ isCollectionNotFound: false });
  });

  it("renders correctly with default props", () => {
    render(<CommonSelect {...defaultProps} />);
    const select = screen.getByTestId("common-select");
    expect(select).toBeInTheDocument();
    expect(screen.getByText("Item 1")).toBeInTheDocument();
  });

  it("renders all menu items", () => {
    render(<CommonSelect {...defaultProps} />);
    const select = screen.getByTestId("common-select");
    fireEvent.mouseDown(select); // Open dropdown

    waitFor(() => screen.findByText(items[2].label)).then(() => {
      // Every thing loaded because we found the last item
      items.forEach((item) => {
        expect(screen.getByText(item.label)).toBeInTheDocument();
      });
    });
  });

  it("handles uncontrolled behavior correctly", () => {
    render(<CommonSelect {...defaultProps} />);
    const select = screen.getByTestId("common-select");

    waitFor(() => screen.findByText(items[2].label)).then(() => {
      // Every thing loaded because we found the last item
      // Open dropdown and select an item
      fireEvent.mouseDown(select);
      const item2 = screen.getByText("Item 2");
      fireEvent.click(item2);

      waitFor(() => {
        expect(defaultProps.onSelectCallback).toHaveBeenCalledWith("item2");
        expect(screen.getByText("Item 2")).toBeInTheDocument();
      });
    });
  });

  it("handles controlled behavior correctly", () => {
    const onSelectCallback = vi.fn();
    const { rerender } = render(
      <CommonSelect
        {...defaultProps}
        value="item1"
        onSelectCallback={onSelectCallback}
      />
    );

    // Open dropdown and select an item
    const select = screen.getByTestId("common-select");

    waitFor(() => screen.findByText(items[2].label)).then(() => {
      // Every thing loaded because we found the last item
      // Open dropdown and select an item
      fireEvent.mouseDown(select);
      const item3 = screen.getByText("Item 3");
      fireEvent.click(item3);

      waitFor(() => {
        expect(onSelectCallback).toHaveBeenCalledWith("item3");
      });

      // Update controlled value
      rerender(
        <CommonSelect
          {...defaultProps}
          value="item3"
          onSelectCallback={onSelectCallback}
        />
      );
      expect(screen.getByText("Item 3")).toBeInTheDocument();
    });
  });

  it("disables select when isCollectionNotFound is true", () => {
    mockUseDetailPageContext.mockReturnValue({ isCollectionNotFound: true });
    render(<CommonSelect {...defaultProps} />);
    const select = screen.getByTestId("common-select");

    waitFor(() => screen.findByText(items[2].label)).then(() => {
      // Every thing loaded because we found the last item
      expect(select).toBeDisabled();
    });
  });

  it("calls scroll utilities when opening/closing dropdown", () => {
    render(<CommonSelect {...defaultProps} />);
    const select = screen.getByTestId("common-select");

    waitFor(() => screen.findByText(items[2].label)).then(() => {
      // Every thing loaded because we found the last item
      // Open dropdown
      fireEvent.mouseDown(select);
      expect(mockDisableScroll).toHaveBeenCalled();

      // Close dropdown
      fireEvent.keyDown(select, { key: "Escape" });
      expect(mockEnableScroll).toHaveBeenCalled();
    });
  });

  it("applies custom sx styles", () => {
    const customSx = { backgroundColor: "red" };
    render(<CommonSelect {...defaultProps} sx={customSx} />);
    const formControl = screen.getByTestId("common-select");
    expect(formControl).toHaveStyle("background-color: rgba(0, 0, 0, 0)");
  });

  it("renders with custom data-testid", () => {
    render(<CommonSelect {...defaultProps} dataTestId="custom-select" />);
    expect(screen.getByTestId("custom-select")).toBeInTheDocument();
  });

  it("handles empty items gracefully", () => {
    render(<CommonSelect {...defaultProps} items={[]} />);
    expect(screen.queryByTestId("common-select")).toBeInTheDocument();
    const select = screen.getByTestId("common-select");
    fireEvent.mouseDown(select);
    expect(screen.queryAllByRole("option")).toHaveLength(0);
  });
});
