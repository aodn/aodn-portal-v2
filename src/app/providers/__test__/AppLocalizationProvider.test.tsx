import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AppLocalizationProvider } from "../AppLocalizationProvider";
import PlainDatePicker from "@/components/common/datetime/PlainDatePicker";

describe("AppLocalizationProvider", () => {
  it("starts every calendar's week on Monday (en-au)", async () => {
    const user = userEvent.setup();
    render(
      <AppLocalizationProvider>
        <PlainDatePicker />
      </AppLocalizationProvider>
    );

    await user.click(screen.getByRole("button", { name: /choose date/i }));

    const weekdayHeaders = screen.getAllByRole("columnheader");
    expect(weekdayHeaders[0]).toHaveAccessibleName("Monday");
    expect(weekdayHeaders[6]).toHaveAccessibleName("Sunday");
  });
});
