import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "@mui/material/styles";
import EmailInputStep from "@/pages/detail-page/features/download/download-dialog/EmailInputStep";
import { portalTheme } from "@/styles";

const EmailInputStepHarness = ({ error }: { error: string }) => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(error);

  return (
    <ThemeProvider theme={portalTheme}>
      <EmailInputStep
        isUnderLaptop={false}
        email={email}
        emailError={emailError}
        dataUsage={{ purposes: [], sectors: [], allow_contact: null }}
        onDataUsageChange={vi.fn()}
        onClearEmail={() => setEmail("")}
        setEmail={setEmail}
        setEmailError={setEmailError}
      />
    </ThemeProvider>
  );
};

describe("EmailInputStep", () => {
  it.each([
    "Please enter your email address.",
    "Please enter a valid email address.",
  ])("keeps focus while typing after validation: %s", async (error) => {
    const user = userEvent.setup();
    render(<EmailInputStepHarness error={error} />);

    expect(screen.getByText(error)).toBeVisible();
    const input = screen.getByRole("textbox", { name: /Email Address/ });
    await user.click(input);
    await user.keyboard("t");

    expect(screen.queryByText(error)).not.toBeInTheDocument();
    expect(input).toHaveFocus();

    await user.keyboard("est@example.com");

    expect(input).toHaveValue("test@example.com");
    expect(input).toHaveFocus();
  });
});
