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

describe("DateSliderPoint empty marks", () => {
  // Reachable on the tile path (marks arrive async) and on the WMS path, where
  // discreteTimeSliderValues.get() misses whenever the selected layer name
  // differs from the stored key. Both used to throw on sorted_marks[0].value.
  it.each([[[]], [undefined]])(
    "renders nothing for %j without throwing",
    (points) => {
      const onDatePointChange = vi.fn();

      expect(() =>
        render(
          <DateSliderPoint
            valid_points={points}
            onDatePointChange={onDatePointChange}
          />
        )
      ).not.toThrow();

      expect(screen.queryByRole("slider")).not.toBeInTheDocument();
      expect(onDatePointChange).not.toHaveBeenCalled();
    }
  );
});

describe("DateSliderPoint resync", () => {
  it("snaps to the new last mark when marks change, without notifying", () => {
    const onDatePointChange = vi.fn();
    const first = [
      dayjs("2020-01-01").valueOf(),
      dayjs("2020-01-15").valueOf(),
    ];
    const second = [
      dayjs("2021-06-01").valueOf(),
      dayjs("2021-06-02").valueOf(),
    ];

    const { rerender } = render(
      <DateSliderPoint
        valid_points={[...first]}
        onDatePointChange={onDatePointChange}
      />
    );
    expect(
      Number(screen.getByRole("slider").getAttribute("aria-valuenow"))
    ).toBe(first[1]);

    rerender(
      <DateSliderPoint
        valid_points={[...second]}
        onDatePointChange={onDatePointChange}
      />
    );

    expect(
      Number(screen.getByRole("slider").getAttribute("aria-valuenow"))
    ).toBe(second[1]);
    // The parent derives the same default from the same source; notifying here
    // would be a render loop.
    expect(onDatePointChange).not.toHaveBeenCalled();
  });
});

describe("DateSliderPoint display", () => {
  const points = [Date.UTC(2024, 0, 1), Date.UTC(2024, 0, 2)];

  it("shows the selected date formatted as DD/MM/YYYY", () => {
    render(<DateSliderPoint valid_points={[...points]} />);

    expect(
      screen.getByText("Displaying 02/01/2024", { selector: "p" })
    ).toBeInTheDocument();
  });

  it("applies sx overrides on the container", () => {
    render(
      <DateSliderPoint
        valid_points={[...points]}
        sx={{ mx: 0, borderRadius: 0, backgroundColor: "#fff" }}
      />
    );

    const container = screen.getByTestId("dateslider-daterange-menu-button");
    expect(container).toHaveStyle({
      marginLeft: "0px",
      marginRight: "0px",
      borderRadius: "0px",
      backgroundColor: "#fff",
    });
  });
});
