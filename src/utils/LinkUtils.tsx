/**
 * Opens a URL in a new tab or window with security precautions.
 *
 * @param {string} url - The URL to open in the new tab/window.
 *
 * This function:
 * 1. Opens the specified URL in a new tab/window using 'noopener' and 'noreferrer'.
 * 2. Sets the opener to null as an additional security measure.
 *
 * Security benefits:
 * - Prevents the new page from accessing the window.opener property.
 * - Mitigates potential reverse tabnabbing attacks.
 * - Doesn't send the referrer information to the new page.
 */
export const openInNewTab = (url: string) => {
  const newWindow = window.open(url, "_blank", "noopener,noreferrer");
  if (newWindow) newWindow.opener = null;
};
