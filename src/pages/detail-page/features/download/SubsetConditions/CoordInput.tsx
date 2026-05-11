import React, { forwardRef, useCallback } from "react";
import { InputBase } from "@mui/material";
import { portalTheme } from "../../../../../styles";

const SOFT_SHADOW = "1px 1px 4px 0 rgba(0, 0, 0, 0.10)";
const ERROR_BORDER = `0 0 0 1px ${portalTheme.palette.error.main}`;

// Static styles hoisted so the object identity is stable across renders.
const ROOT_SX = {
  height: 28,
  p: 0,
  m: 0,
  backgroundColor: "common.white",
  borderRadius: "4px",
  ...portalTheme.typography.body2Regular,
  color: portalTheme.palette.text1,
  fontVariantNumeric: "tabular-nums",
};

const INPUT_SX = {
  ...portalTheme.typography.body2Regular,
  color: portalTheme.palette.text1,
  p: 0,
  m: 0,
  minHeight: 0,
  height: 28,
  lineHeight: "28px",
  boxSizing: "border-box",
  fontVariantNumeric: "tabular-nums",
  // Centre the placeholder so the "enter" hint reads as a label even when
  // typed values are otherwise right-aligned for column scanning.
  "&:placeholder-shown": { textAlign: "center", pr: 0 },
  "&::placeholder": { color: portalTheme.palette.text1, opacity: 1 },
};

export interface CoordInputProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  width?: number;
  align?: "left" | "center" | "right";
  error?: string;
  errorMessageId?: string;
  disabled?: boolean;
  selectOnFocus?: boolean;
  onSubmit?: () => void;
  onCancel?: () => void;
  ariaLabel?: string;
  id?: string;
}

const CoordInput = forwardRef<HTMLInputElement, CoordInputProps>(
  function CoordInput(
    {
      value,
      onChange,
      placeholder = "enter",
      width = 70,
      align = "center",
      error,
      errorMessageId,
      disabled,
      selectOnFocus,
      onSubmit,
      onCancel,
      ariaLabel,
      id,
    },
    ref
  ) {
    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value),
      [onChange]
    );

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
          // Prevent any wrapping <form> from picking this up as a submit.
          e.preventDefault();
          onSubmit?.();
        } else if (e.key === "Escape") {
          onCancel?.();
        }
      },
      [onSubmit, onCancel]
    );

    const handleFocus = useCallback(
      (e: React.FocusEvent<HTMLInputElement>) => {
        if (selectOnFocus) e.target.select();
      },
      [selectOnFocus]
    );

    return (
      <InputBase
        id={id}
        value={value}
        placeholder={placeholder}
        inputRef={ref}
        disabled={disabled}
        error={Boolean(error)}
        onChange={handleChange}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
        inputProps={{
          "aria-label": ariaLabel,
          "aria-invalid": Boolean(error),
          "aria-errormessage":
            error && errorMessageId ? errorMessageId : undefined,
          // `decimal` hints mobile keyboards to show the numeric pad with a
          // decimal separator; desktop browsers ignore it.
          inputMode: "decimal",
        }}
        sx={{
          ...ROOT_SX,
          width,
          // Composite shadow: ambient SOFT_SHADOW + 1px error ring overlay.
          // Using box-shadow (not outline) keeps the ring on the border-radius.
          boxShadow: error ? `${ERROR_BORDER}, ${SOFT_SHADOW}` : SOFT_SHADOW,
          "& .MuiInputBase-input": {
            ...INPUT_SX,
            textAlign: align,
            pr: align === "right" ? "6px" : 0,
          },
        }}
      />
    );
  }
);

export default CoordInput;
