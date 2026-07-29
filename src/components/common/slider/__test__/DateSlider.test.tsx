import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import DateSliderRange, { DateSliderPoint } from "../DateSlider";
import dayjs from "dayjs";
import { dateDefault } from "../../constants";
import { dateToValue } from "@/utils/DateUtils";

const DAY_MS = 24 * 60 * 60 * 1000;

describe("DateSliderRange keyboard", () => {
  it("moves the focused thumb by one day on ArrowLeft/ArrowRight", async () => {
    const user = userEvent.setup();
    const onDateRangeChange = vi.fn();
    const minDate = "2020-01-01";
    const maxDate = "2020-01-31";

    render(
      <DateSliderRange
        currentMinDate={minDate}
        currentMaxDate={maxDate}
        minDate={minDate}
        maxDate={maxDate}
        onDateRangeChange={onDateRangeChange}
      />
    );

    const inputs = screen.getAllByRole("slider");
    // Two thumbs: start and end. Focus the start thumb.
    const startThumb = inputs[0];
    startThumb.focus();
    expect(startThumb).toHaveFocus();

    const startBefore = Number(startThumb.getAttribute("aria-valuenow"));

    await user.keyboard("{ArrowRight}");

    const startAfterRight = Number(startThumb.getAttribute("aria-valuenow"));
    expect(startAfterRight - startBefore).toBe(DAY_MS);
    expect(onDateRangeChange).toHaveBeenCalled();

    await user.keyboard("{ArrowLeft}");

    const startAfterLeft = Number(startThumb.getAttribute("aria-valuenow"));
    expect(startAfterLeft).toBe(startBefore);
  });
});

describe("DateSliderRange min floor", () => {
  it("defaults the min thumb to 1 Jan 1970 when dataset min is earlier", () => {
    const onDateRangeChange = vi.fn();
    const floorValue = dateToValue(dayjs(dateDefault.min));

    render(
      <DateSliderRange
        currentMinDate={undefined}
        currentMaxDate={undefined}
        minDate="1950-06-15"
        maxDate="2020-01-31"
        onDateRangeChange={onDateRangeChange}
      />
    );

    const inputs = screen.getAllByRole("slider");
    const startThumb = inputs[0];
    expect(Number(startThumb.getAttribute("aria-valuenow"))).toBe(floorValue);
    expect(Number(startThumb.getAttribute("aria-valuemin"))).toBe(floorValue);
    // Bottom rail label shows the floored min (value labels may also render it)
    expect(screen.getAllByText("01/01/1970").length).toBeGreaterThan(0);
  });

  it("keeps the dataset min when it is on or after 1 Jan 1970", () => {
    const onDateRangeChange = vi.fn();
    const minDate = "1980-03-01";
    const expected = dateToValue(dayjs(minDate, dateDefault.DATE_FORMAT));

    render(
      <DateSliderRange
        currentMinDate={undefined}
        currentMaxDate={undefined}
        minDate={minDate}
        maxDate="2020-01-31"
        onDateRangeChange={onDateRangeChange}
      />
    );

    const startThumb = screen.getAllByRole("slider")[0];
    expect(Number(startThumb.getAttribute("aria-valuenow"))).toBe(expected);
    expect(Number(startThumb.getAttribute("aria-valuemin"))).toBe(expected);
  });

  it("places thumbs at rail ends on init (start-of-day min, end-of-day max)", () => {
    const onDateRangeChange = vi.fn();
    const minDate = "2020-01-01";
    const maxDate = "2020-01-31";
    const minValue = dateToValue(dayjs(minDate, dateDefault.DATE_FORMAT));
    const maxValue = dateToValue(dayjs(maxDate, dateDefault.DATE_FORMAT), true);

    render(
      <DateSliderRange
        currentMinDate={undefined}
        currentMaxDate={undefined}
        minDate={minDate}
        maxDate={maxDate}
        onDateRangeChange={onDateRangeChange}
      />
    );

    const inputs = screen.getAllByRole("slider");
    expect(Number(inputs[0].getAttribute("aria-valuenow"))).toBe(minValue);
    expect(Number(inputs[1].getAttribute("aria-valuenow"))).toBe(maxValue);
    expect(Number(inputs[0].getAttribute("aria-valuemin"))).toBe(minValue);
    expect(Number(inputs[0].getAttribute("aria-valuemax"))).toBe(maxValue);
    // Distinct ends — not both stuck on the left
    expect(Number(inputs[0].getAttribute("aria-valuenow"))).toBeLessThan(
      Number(inputs[1].getAttribute("aria-valuenow"))
    );
  });

  it("places thumbs at both ends when min and max are the same calendar day", () => {
    // Regression: end thumb used start-of-day while rail max used end-of-day,
    // so both values equaled min and MUI stacked both dots on the left.
    const onDateRangeChange = vi.fn();
    const day = "1970-01-21";
    const minValue = dateToValue(dayjs(day, dateDefault.DATE_FORMAT));
    const maxValue = dateToValue(dayjs(day, dateDefault.DATE_FORMAT), true);

    render(
      <DateSliderRange
        currentMinDate={undefined}
        currentMaxDate={undefined}
        minDate={day}
        maxDate={day}
        onDateRangeChange={onDateRangeChange}
      />
    );

    const inputs = screen.getAllByRole("slider");
    expect(Number(inputs[0].getAttribute("aria-valuenow"))).toBe(minValue);
    expect(Number(inputs[1].getAttribute("aria-valuenow"))).toBe(maxValue);
    expect(Number(inputs[0].getAttribute("aria-valuemin"))).toBe(minValue);
    expect(Number(inputs[0].getAttribute("aria-valuemax"))).toBe(maxValue);
    expect(maxValue).toBeGreaterThan(minValue);
  });
});

describe("DateSliderPoint keyboard", () => {
  it("steps between discrete marks with ArrowLeft/ArrowRight", async () => {
    const user = userEvent.setup();
    const onDatePointChange = vi.fn();
    const points = [
      dayjs("2020-01-01").valueOf(),
      dayjs("2020-01-15").valueOf(),
      dayjs("2020-02-01").valueOf(),
    ];

    render(
      <DateSliderPoint
        valid_points={[...points]}
        onDatePointChange={onDatePointChange}
      />
    );

    const thumb = screen.getByRole("slider");
    thumb.focus();
    expect(thumb).toHaveFocus();

    // Default selection is the last mark
    expect(Number(thumb.getAttribute("aria-valuenow"))).toBe(points[2]);

    await user.keyboard("{ArrowLeft}");
    expect(Number(thumb.getAttribute("aria-valuenow"))).toBe(points[1]);
    expect(onDatePointChange).toHaveBeenLastCalledWith(
      expect.anything(),
      points[1]
    );

    await user.keyboard("{ArrowLeft}");
    expect(Number(thumb.getAttribute("aria-valuenow"))).toBe(points[0]);

    // At the first mark, ArrowLeft should not move further
    await user.keyboard("{ArrowLeft}");
    expect(Number(thumb.getAttribute("aria-valuenow"))).toBe(points[0]);

    await user.keyboard("{ArrowRight}");
    expect(Number(thumb.getAttribute("aria-valuenow"))).toBe(points[1]);
  });
});
