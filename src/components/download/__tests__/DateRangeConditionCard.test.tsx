import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import dayjs from "dayjs";

// Tests for DateRangeConditionCard:
// - the From/To pickers respect cross-field constraints (From <= To)
// - invalid/null dates are ignored
// - external minDate/maxDate clamp the picker bounds together with the current range

// --- Mocks -----------------------------------------------------------------

// Stub MUI's date picker with a plain <input> so we can fire change events
// and read back min/max bounds without MUI's localization context.
vi.mock("../../common/datetime/PlainDatePicker", () => ({
  default: ({ value, minDate, maxDate, onChange, disabled }: any) => (
    <input
      data-testid="date-picker"
      data-min={minDate?.format?.("YYYY-MM-DD") ?? ""}
      data-max={maxDate?.format?.("YYYY-MM-DD") ?? ""}
      value={value?.format?.("YYYY-MM-DD") ?? ""}
      disabled={disabled}
      onChange={(e) =>
        onChange(e.target.value === "" ? null : dayjs(e.target.value))
      }
    />
  ),
}));

// BaseConditionCard owns layout/expand state — not under test here.
vi.mock("../DataSelection/BaseConditionCard", () => ({
  default: ({ children }: any) => <div>{children}</div>,
}));

import DateRangeConditionCard from "../DataSelection/DateRangeConditionCard";
import {
  DateRangeCondition,
  DownloadConditionType,
} from "../../../pages/detail-page/context/DownloadDefinitions";

// --- Test data -------------------------------------------------------------

// External dataset bounds (e.g. the collection's full temporal extent).
const DATASET_MIN = "2020-01-01";
const DATASET_MAX = "2025-12-31";
// The user's currently-selected range, sitting strictly inside the dataset.
const RANGE_START = "2021-01-01";
const RANGE_END = "2023-12-31";
// Probe dates: one inside the range, one earlier than start, one later than end.
const INSIDE_RANGE = "2022-06-15";
const BEFORE_START = "2020-05-01";
const AFTER_END = "2024-08-01";

const buildCondition = (start: string, end: string): DateRangeCondition => ({
  id: "test-date-range",
  type: DownloadConditionType.DATE_RANGE,
  start,
  end,
});

// --- DOM helpers -----------------------------------------------------------

// Pickers are rendered in DOM order: [From, To].
const fromPicker = () =>
  screen.getAllByTestId("date-picker")[0] as HTMLInputElement;
const toPicker = () =>
  screen.getAllByTestId("date-picker")[1] as HTMLInputElement;

// Simulate a user picking a date; pass "" to simulate clearing the field.
const pickFromDate = (value: string) =>
  fireEvent.change(fromPicker(), { target: { value } });
const pickToDate = (value: string) =>
  fireEvent.change(toPicker(), { target: { value } });

describe("DateRangeConditionCard", () => {
  const onChange = vi.fn();

  beforeEach(() => {
    onChange.mockClear();
  });

  describe("From date selection", () => {
    it("propagates the new start when the picked date is inside the range", () => {
      render(
        <DateRangeConditionCard
          dateRangeCondition={buildCondition(RANGE_START, RANGE_END)}
          onChange={onChange}
        />
      );

      pickFromDate(INSIDE_RANGE);

      expect(onChange).toHaveBeenCalledWith(INSIDE_RANGE, RANGE_END);
    });

    it("ignores a date that is after the current end (cross-field constraint)", () => {
      render(
        <DateRangeConditionCard
          dateRangeCondition={buildCondition(RANGE_START, RANGE_END)}
          onChange={onChange}
        />
      );

      pickFromDate(AFTER_END);

      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe("To date selection", () => {
    it("propagates the new end when the picked date is inside the range", () => {
      render(
        <DateRangeConditionCard
          dateRangeCondition={buildCondition(RANGE_START, RANGE_END)}
          onChange={onChange}
        />
      );

      pickToDate(INSIDE_RANGE);

      expect(onChange).toHaveBeenCalledWith(RANGE_START, INSIDE_RANGE);
    });

    it("ignores a date that is before the current start (cross-field constraint)", () => {
      render(
        <DateRangeConditionCard
          dateRangeCondition={buildCondition(RANGE_START, RANGE_END)}
          onChange={onChange}
        />
      );

      pickToDate(BEFORE_START);

      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe("Invalid input", () => {
    it("ignores a null/cleared date from either picker", () => {
      render(
        <DateRangeConditionCard
          dateRangeCondition={buildCondition(RANGE_START, RANGE_END)}
          onChange={onChange}
        />
      );

      pickFromDate("");
      pickToDate("");

      expect(onChange).not.toHaveBeenCalled();
    });
  });

  describe("Bound clamping", () => {
    it("clamps the From picker by the dataset min and the current end", () => {
      render(
        <DateRangeConditionCard
          dateRangeCondition={buildCondition(RANGE_START, RANGE_END)}
          onChange={onChange}
          minDate={dayjs(DATASET_MIN)}
          maxDate={dayjs(DATASET_MAX)}
        />
      );

      expect(fromPicker().dataset.min).toBe(DATASET_MIN);
      expect(fromPicker().dataset.max).toBe(RANGE_END);
    });

    it("clamps the To picker by the current start and the dataset max", () => {
      render(
        <DateRangeConditionCard
          dateRangeCondition={buildCondition(RANGE_START, RANGE_END)}
          onChange={onChange}
          minDate={dayjs(DATASET_MIN)}
          maxDate={dayjs(DATASET_MAX)}
        />
      );

      expect(toPicker().dataset.min).toBe(RANGE_START);
      expect(toPicker().dataset.max).toBe(DATASET_MAX);
    });
  });
});
