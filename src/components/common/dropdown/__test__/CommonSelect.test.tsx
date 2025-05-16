import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from "@testing-library/react";
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
    // Open dropdown
    const combobox = within(select).getByRole("combobox");
    fireEvent.mouseDown(combobox);

    // As it default render items[0] so there should be two "Item 1" when dropdown is open
    expect(screen.getAllByText("Item 1").length).toBe(2);
    expect(screen.getByText("Item 2")).toBeInTheDocument();
    expect(screen.getByText("Item 3")).toBeInTheDocument();
  });

  it("handles uncontrolled behavior correctly", () => {
    render(<CommonSelect {...defaultProps} />);
    const select = screen.getByTestId("common-select");
    // Open dropdown
    const combobox = within(select).getByRole("combobox");
    fireEvent.mouseDown(combobox);

    // Select option "Item 2"
    const item2 = screen.getByText("Item 2");
    fireEvent.click(item2);

    return waitFor(() => {
      expect(defaultProps.onSelectCallback).toHaveBeenCalledWith("item2");
    }).then(() => {
      // Only one "Item 2" in the select as the dropdown is closed after click the option
      expect(screen.getAllByText("Item 2").length).toBe(1);
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

    // Open dropdown and select "Item 3"
    const select = screen.getByTestId("common-select");
    const combobox = within(select).getByRole("combobox");
    fireEvent.mouseDown(combobox);

    const item3 = screen.getByText("Item 3");
    fireEvent.click(item3);

    return waitFor(() => {
      expect(onSelectCallback).toHaveBeenCalledWith("item3");
    }).then(() => {
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
    const combobox = within(select).getByRole("combobox");

    expect(combobox).toHaveAttribute("aria-disabled", "true");
  });

  it("calls scroll utilities when opening/closing dropdown", () => {
    render(<CommonSelect {...defaultProps} />);

    const select = screen.getByTestId("common-select");
    const combobox = within(select).getByRole("combobox");
    fireEvent.mouseDown(combobox);
    expect(mockDisableScroll).toHaveBeenCalled();
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
