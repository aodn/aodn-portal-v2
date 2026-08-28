/**
 * Download-size thresholds driving the advisory warnings on the download cards.
 */

// Over this size the download is still allowed, but the user is advised to subset
const LARGE_DOWNLOAD_BYTES = 10 * 1024 ** 3;

// Over this size the download is blocked until the user subsets their selection
const EXTRA_LARGE_DOWNLOAD_BYTES = 1024 ** 4;

export { LARGE_DOWNLOAD_BYTES, EXTRA_LARGE_DOWNLOAD_BYTES };
