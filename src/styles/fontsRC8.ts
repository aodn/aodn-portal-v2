/**
 * Centralized font configuration and imports for design system
 * Manages font imports and provides reusable font family definitions
 *
 * Current implementation method:
 * 1. Fonts are loaded via Fontsource npm packages (imported below)
 * 2. CSS variables are defined in index.css:
 *    :root {
 *      --font-poppins: "Poppins", sans-serif;
 *      --font-open-sans: "Open Sans", sans-serif;
 *    }
 * 3. FONT_FAMILIES use var() with fallback chains for reliability
 * 4. Import this file in main.tsx to load fonts and access constants
 *
 * Dependencies:
 * - @fontsource/poppins (weights: 300, 400, 500)
 * - @fontsource/open-sans (weights: 400, 500)
 *
 * Usage in components:
 * - import { FONT_FAMILIES } from './styles/fontsRC8'
 * - style={{ fontFamily: FONT_FAMILIES.poppins }}
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
