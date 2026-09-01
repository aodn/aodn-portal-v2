import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AppLocalizationProvider } from "@/app/providers/AppLocalizationProvider";
import PlainDatePicker from "../PlainDatePicker";
import dayjs from "@/utils/DayjsUtils";
import { dateDefault } from "@/components/common/constants";

describe("PlainDatePicker", () => {
  it("keeps the calendar popup on the same month and year as the field", async () => {
    const user = userEvent.setup();
    render(
      <AppLocalizationProvider>
        <PlainDatePicker
          value={dayjs.utc("1970-01-01T00:00:00Z")}
          format={dateDefault.DISPLAY_FORMAT}
        />
      </AppLocalizationProvider>
    );

    expect(screen.getByRole("textbox")).toHaveValue("01 Jan 1970");

    await user.click(screen.getByRole("button", { name: /choose date/i }));

    expect(screen.getByText("January 1970")).toBeInTheDocument();
    expect(screen.queryByText("December 1969")).not.toBeInTheDocument();
  });
});
