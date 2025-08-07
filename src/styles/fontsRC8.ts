/**
 * Centralized font configuration and imports for design system
 * Manages font imports and provides reusable font family definitions
 */

/* eslint-disable import/extensions */
// Font imports - ESLint extension rule disabled for CSS imports from node_modules
import "@fontsource/poppins/300.css";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/open-sans/400.css";
import "@fontsource/open-sans/500.css";

// Font family constants with proper fallbacks
export const FONT_FAMILIES = {
  poppins:
    "var(--font-poppins, 'Poppins', system-ui, -apple-system, sans-serif)",
  openSans:
    "var(--font-open-sans, 'Open Sans', system-ui, -apple-system, sans-serif)",
} as const;

// Type definitions for better TypeScript support
export type FontFamily = (typeof FONT_FAMILIES)[keyof typeof FONT_FAMILIES];
