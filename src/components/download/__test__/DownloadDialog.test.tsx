import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import DownloadDialog from "../DownloadDialog";

// Mock the custom hook
const mockUseDownloadDialog = {
  emailInputRef: { current: null },
  activeStep: 0,
  isProcessing: false,
  isSuccess: false,
  processingStatus: "",
  email: "",
  dataUsage: { purposes: [], sectors: [], allow_contact: null },
  snackbar: { open: false, message: "", severity: "error" as const },
  hasDownloadConditions: false,
  handleIsClose: vi.fn(),
  handleStepClick: vi.fn(),
  handleStepperButtonClick: vi.fn(),
  handleDataUsageChange: vi.fn(),
  handleFormSubmit: vi.fn(),
  getProcessStatusText: vi.fn(() => ""),
  getStepperButtonTitle: vi.fn(() => "Next"),
  setSnackbar: vi.fn(),
};

vi.mock("@/hooks/useDownloadDialog", () => ({
  useDownloadDialog: vi.fn(() => mockUseDownloadDialog),
}));

// Mock other components
vi.mock("@/components/download/stepper/StepperButton", () => ({
  default: ({ title, onClick, disabled }: any) => (
    <button onClick={onClick} disabled={disabled} data-testid="stepper-button">
      {title}
    </button>
  ),
}));

vi.mock("@/components/download/stepper/StyledStepper", () => ({
  default: ({ steps, activeStep, onStepClick }: any) => (
    <div data-testid="styled-stepper">
      {steps.map((step: any, index: number) => (
        <button
          key={step.number}
          onClick={() => onStepClick(index)}
          data-testid={`step-${index}`}
          className={activeStep === index ? "active" : ""}
        >
          {step.label}
        </button>
      ))}
    </div>
  ),
}));

vi.mock("@/components/download/DataSelection", () => ({
  default: () => (
    <div data-testid="data-selection">Data Selection Component</div>
  ),
}));

vi.mock("@/components/download/LicenseContent", () => ({
  default: () => <div data-testid="license-content">License Content</div>,
}));

vi.mock("@/components/download/EmailInputStep", () => ({
  default: ({ isMobile, emailInputRef, dataUsage, onDataUsageChange }: any) => (
    <div data-testid="email-input-step">
      <input
        ref={emailInputRef}
        data-testid="email-input"
        placeholder="Enter email"
      />
      <div>Email Input Step</div>
    </div>
  ),
}));

vi.mock("@/components/download/ValidationSnackbar", () => ({
  ValidationSnackbar: ({ snackbar, onClose }: any) =>
    snackbar.open ? (
      <button data-testid="validation-snackbar" onClick={onClose}>
        {snackbar.message}
      </button>
    ) : null,
}));

// Test wrapper component
const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const theme = createTheme();
  const mockStore = {
    getState: () => ({}),
    subscribe: () => () => {},
    dispatch: () => {},
  };

  return (
    <Provider store={mockStore as any}>
      <BrowserRouter>
        <ThemeProvider theme={theme}>{children}</ThemeProvider>
      </BrowserRouter>
    </Provider>
  );
};

describe("DownloadDialog", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render dialog when open", () => {
    render(
      <TestWrapper>
        <DownloadDialog isOpen={true} setIsOpen={vi.fn()} />
      </TestWrapper>
    );

    expect(screen.getByText("Dataset Download")).toBeInTheDocument();
  });

  it("should not render dialog when closed", () => {
    render(
      <TestWrapper>
        <DownloadDialog isOpen={false} setIsOpen={vi.fn()} />
      </TestWrapper>
    );

    expect(screen.queryByText("Dataset Download")).not.toBeInTheDocument();
  });

  it("should display stepper with correct steps", () => {
    render(
      <TestWrapper>
        <DownloadDialog isOpen={true} setIsOpen={vi.fn()} />
      </TestWrapper>
    );

    expect(screen.getByTestId("styled-stepper")).toBeInTheDocument();
    expect(screen.getByTestId("step-0")).toBeInTheDocument();
    expect(screen.getByTestId("step-1")).toBeInTheDocument();
  });

  it("should render email input step by default (step 0)", () => {
    render(
      <TestWrapper>
        <DownloadDialog isOpen={true} setIsOpen={vi.fn()} />
      </TestWrapper>
    );

    expect(screen.getByTestId("email-input-step")).toBeInTheDocument();
    expect(screen.getByTestId("email-input")).toBeInTheDocument();
  });

  it("should call handleStepperButtonClick when next button is clicked", () => {
    render(
      <TestWrapper>
        <DownloadDialog isOpen={true} setIsOpen={vi.fn()} />
      </TestWrapper>
    );

    const nextButton = screen.getByTestId("stepper-button");
    fireEvent.click(nextButton);

    expect(
      mockUseDownloadDialog.handleStepperButtonClick
    ).toHaveBeenCalledTimes(1);
  });

  it("should call handleIsClose when close button is clicked", () => {
    render(
      <TestWrapper>
        <DownloadDialog isOpen={true} setIsOpen={vi.fn()} />
      </TestWrapper>
    );

    // Find the close button by looking for the CloseIcon
    const closeButton = screen.getByTestId("CloseIcon").closest("button");
    expect(closeButton).toBeInTheDocument();

    fireEvent.click(closeButton!);

    expect(mockUseDownloadDialog.handleIsClose).toHaveBeenCalledTimes(1);
  });

  it("should show license content when activeStep is 1", () => {
    mockUseDownloadDialog.activeStep = 1;

    render(
      <TestWrapper>
        <DownloadDialog isOpen={true} setIsOpen={vi.fn()} />
      </TestWrapper>
    );

    expect(screen.getByTestId("license-content")).toBeInTheDocument();

    // Reset activeStep
    mockUseDownloadDialog.activeStep = 0;
  });

  it("should disable stepper button when processing", () => {
    mockUseDownloadDialog.isProcessing = true;

    render(
      <TestWrapper>
        <DownloadDialog isOpen={true} setIsOpen={vi.fn()} />
      </TestWrapper>
    );

    const stepperButton = screen.getByTestId("stepper-button");
    expect(stepperButton).toBeDisabled();

    // Reset state
    mockUseDownloadDialog.isProcessing = false;
  });

  it("should display data selection when hasDownloadConditions is true", () => {
    mockUseDownloadDialog.hasDownloadConditions = true;

    render(
      <TestWrapper>
        <DownloadDialog isOpen={true} setIsOpen={vi.fn()} />
      </TestWrapper>
    );

    expect(screen.getByTestId("data-selection")).toBeInTheDocument();
    expect(screen.getByText("Data Selection")).toBeInTheDocument();

    // Reset state
    mockUseDownloadDialog.hasDownloadConditions = false;
  });

  it("should show validation snackbar when snackbar is open", () => {
    mockUseDownloadDialog.snackbar = {
      open: true,
      message: "Email is required",
      severity: "error",
    };

    render(
      <TestWrapper>
        <DownloadDialog isOpen={true} setIsOpen={vi.fn()} />
      </TestWrapper>
    );

    // Reset state
    mockUseDownloadDialog.snackbar = {
      open: false,
      message: "",
      severity: "error",
    };
  });

  it("should show loading indicator when processing", () => {
    mockUseDownloadDialog.isProcessing = true;

    render(
      <TestWrapper>
        <DownloadDialog isOpen={true} setIsOpen={vi.fn()} />
      </TestWrapper>
    );

    expect(screen.getByRole("progressbar")).toBeInTheDocument();

    // Reset state
    mockUseDownloadDialog.isProcessing = false;
  });
});
