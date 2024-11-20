/**
 * Disables page scrolling and saves the current scroll position.
 * Useful for modal dialogs, overlays, or any UI element that requires
 * the background content to be fixed in place.
 *
 * This function:
 * 1. Captures the current scroll position
 * 2. Fixes the body position to prevent scrolling
 * 3. Maintains the page width to prevent layout shifts
 * 4. Adjusts the body position to maintain visual consistency
 */
export const disableScroll = () => {
  const scrollY = window.scrollY;
  document.body.style.position = "fixed";
  document.body.style.width = "100%";
  document.body.style.top = `-${scrollY}px`;
};

/**
 * Enables page scrolling and restores the previous scroll position.
 * Should be called as a cleanup function after disableScroll().
 *
 * This function:
 * 1. Retrieves the saved scroll position from body's top style
 * 2. Removes the fixed positioning
 * 3. Restores the original body width
 * 4. Scrolls back to the original position, converting the negative top value
 *    back to a positive scroll position
 */
export const enableScroll = () => {
  const scrollY = document.body.style.top;
  document.body.style.position = "";
  document.body.style.width = "";
  window.scrollTo(0, parseInt(scrollY || "0", 10) * -1);
};
