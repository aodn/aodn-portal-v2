// SVG bubble shape from Figma design for cursor-following hints
// Used with DOM manipulation (innerHTML) rather than as a React component
export const CURSOR_HINT_BUBBLE_SVG =
  "<g opacity='0.8' filter='url(#hintFilter)'>" +
  "<path d='M8.99963 4C8.99963 1.79086 10.7905 0 12.9996 0L143.037 " +
  "0C145.231 0 147.016 1.76857 147.036 3.9633L147.463 50.4633C147.483 " +
  "52.6867 145.687 54.5 143.463 54.5H12.9996C10.7905 54.5 8.99963 " +
  "52.7091 8.99963 50.5V21.5995C8.99963 20.0187 8.06872 18.5862 " +
  "6.62424 17.9442L0 15L6.62424 12.0558C8.06872 11.4138 8.99963 " +
  "9.98128 8.99963 8.40055V4Z' fill='white'/></g>" +
  "<defs><filter id='hintFilter' x='0' y='0' width='149.463' " +
  "height='56.5' filterUnits='userSpaceOnUse' " +
  "color-interpolation-filters='sRGB'>" +
  "<feFlood flood-opacity='0' result='bg'/>" +
  "<feBlend mode='normal' in='SourceGraphic' in2='bg' result='shape'/>" +
  "<feColorMatrix in='SourceAlpha' type='matrix' " +
  "values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0' " +
  "result='hardAlpha'/>" +
  "<feOffset dx='2' dy='2'/><feGaussianBlur stdDeviation='3'/>" +
  "<feComposite in2='hardAlpha' operator='arithmetic' k2='-1' k3='1'/>" +
  "<feColorMatrix type='matrix' " +
  "values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0'/>" +
  "<feBlend mode='normal' in2='shape' result='shadow'/>" +
  "</filter></defs>";

export const CURSOR_HINT_BUBBLE_VIEWBOX = "0 0 148 55";
export const CURSOR_HINT_BUBBLE_WIDTH = 148;
export const CURSOR_HINT_BUBBLE_HEIGHT = 55;
