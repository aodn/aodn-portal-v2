/**
 * Figma Design Tokens RC8
 *
 * Design tokens extracted from Figma "Interaction Specification for RC8" design system.
 * These tokens follow the specifications from:
 * - Component Library
 *  - Usage_typography
 *  - Usage_color palette
 *
 * Used for maintaining design consistency between designs and React components.
 * Apply these tokens to MUI theme instead of hardcoded values.
 *
 * @location src/styles/designTokensRC8.ts
 * @version RC8
 */

import { FONT_FAMILIES } from "./fontsRC8";

export const designTokensRC8 = {
  version: "rc8",

  // ===========================
  // Typography - Usage_typography
  // TODO: RC8 design update not complete yet, temporarily not using new fonts
  // ===========================
  typography: {
    // Typeface
    fontFamily: FONT_FAMILIES,

    // Hierarchy
    variants: {
      // Slogan styles - Size: 64, Line Height: 96
      slogan1: {
        fontFamily: FONT_FAMILIES.poppins,
        fontSize: "64px",
        fontWeight: 500,
        lineHeight: "96px",
        color: "#090C02",
      },

      // Slogan styles - Size: 48, Line Height: 72
      slogan2: {
        fontFamily: FONT_FAMILIES.poppins,
        fontSize: "48px",
        fontWeight: 300,
        lineHeight: "72px",
        color: "#090C02",
      },

      // Heading styles - Size: 40, Line Height: 48
      heading1: {
        fontFamily: FONT_FAMILIES.poppins,
        fontSize: "40px",
        fontWeight: 500,
        lineHeight: "48px",
        color: "#090C02",
      },

      // Heading styles - Size: 24, Line Height: 36
      heading2: {
        fontFamily: FONT_FAMILIES.poppins,
        fontSize: "24px",
        fontWeight: 500,
        lineHeight: "36px",
        color: "#090C02",
      },

      // Heading styles - Size: 20, Line Height: 30
      heading3: {
        fontFamily: FONT_FAMILIES.poppins,
        fontSize: "20px",
        fontWeight: 500,
        lineHeight: "30px",
        color: "#090C02",
      },

      // Heading styles - Size: 16, Line Height: 22
      heading4: {
        fontFamily: FONT_FAMILIES.poppins,
        fontSize: "16px",
        fontWeight: 500,
        lineHeight: "22px",
        color: "#090C02",
      },

      // Title styles - Size: 16, Line Height: 26
      title1Medium: {
        fontFamily: FONT_FAMILIES.openSans,
        fontSize: "16px",
        fontWeight: 400,
        lineHeight: "26px",
        color: "#090C02",
      },

      // Title styles - Size: 16, Line Height: 26
      title2Regular: {
        fontFamily: FONT_FAMILIES.openSans,
        fontSize: "16px",
        fontWeight: 400,
        lineHeight: "26px",
        color: "#090C02",
      },

      // Body styles - Size: 14, Line Height: 22
      body1Medium: {
        fontFamily: FONT_FAMILIES.openSans,
        fontSize: "14px",
        fontWeight: 500,
        lineHeight: "22px",
        color: "#090C02",
      },

      // Body styles - Size: 14, Line Height: 22
      body2Regular: {
        fontFamily: FONT_FAMILIES.openSans,
        fontSize: "14px",
        fontWeight: 400,
        lineHeight: "22px",
        color: "#090C02",
      },

      // Body styles - Size: 13, Line Height: 20
      body3Small: {
        fontFamily: FONT_FAMILIES.openSans,
        fontSize: "13px",
        fontWeight: 400,
        lineHeight: "20px",
        color: "#090C02",
      },
    },
  },

  // ===========================
  // Colours - Usage_color palette
  // ===========================
  colours: {
    // System Colours
    // Definition and Purpose:
    // System colours are a set of predefined colours used across various applications and interfaces within our ecosystem.
    // These colours are designed to represent different status and functions, such as warning (red), success (green), information (blue), and neutral (grey).
    system: {
      complete: "#88C057",
      warning: "#E9C46A",
      error: "#E76F51",
      info: "#3A86FF",
    },

    // Text
    text: {
      text1: "#090C02",
      text2: "#3C3C3C",
      text3: "#FFF",
    },

    // Background
    background: {
      background: "#F7F7F7",
    },

    // Grey
    grey: {
      grey100: "#FAFAFA",
      grey300: "#F0F0F0",
      grey500: "#BFBFBF",
      grey600: "#8C8C8C",
      grey700: "#595959",
    },

    // Product Colours
    // Definition and Purpose:
    // Product colours are unique colour patterns tailored to individual projects or product lines within the company.
    // These colours reflect the brand identity and thematic elements of the specific product, differentiating it from other company offerings.
    product: {
      // Primary series
      primary1: "#3B6E8F",
      primary2: "#182C3A",
      primary3: "#0C161D",
      primary4: "#C5D8E7",
      primary5: "#E2ECF3",
      primary6: "#F1F6F9",

      // Secondary
      secondary1: "#54BCEB",

      // Neutral series
      neutral1: "#090C02",
      neutral2: "#FFF",
      neutral3: "#D9D7BD",
      neutral4: "#BCB98A",

      // Tag series
      tag1: "#D7F4F2",
      tag2: "#F6F0ED",
    },
  },
};

// Convenience exports
export const { colours, typography } = designTokensRC8;
