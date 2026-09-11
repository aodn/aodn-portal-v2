// Helpers for naming the files a user downloads from the Download Service card.
// Naming convention (see aodn/backlog#8600):
//   single dataset : {collection_title}.{extension}
//   multi  dataset : {collection_title}-{dataset_title}.{extension}

// Characters that are not allowed in a file name on Windows / macOS / Linux
const ILLEGAL_FILE_NAME_CHARS = /[/\\:*?"<>|]/g;

// Control characters are legal on some file systems but break downstream tooling
// eslint-disable-next-line no-control-regex
const CONTROL_CHARS = /[\u0000-\u001f\u007f]/g;

// Keep the whole name comfortably under the 255 byte limit most file systems
// impose, while still leaving room for the extension
const MAX_FILE_NAME_PART_LENGTH = 120;

const DEFAULT_FILE_NAME_PART = "download";

// Maps a download format (the value used by the Format Selection dropdown, or
// the media type the server reports) to the extension of the file it sends back
const FORMAT_EXTENSIONS: Record<string, string> = {
  "text/csv": "csv",
  "shape-zip": "zip",
  "application/zip": "zip",
};

const DEFAULT_FILE_EXTENSION = "csv";

/**
 * Makes a single part of a file name (a collection title, a dataset title)
 * safe to write to disk: illegal characters are removed, whitespace becomes
 * underscores, and the result is trimmed to a sensible length.
 *
 * @param text The raw title to turn into a file name part
 * @returns A file-system safe string, or "download" when nothing usable is left
 *
 * @example
 * sanitiseFileNamePart('IMOS - Argo Profiles (delayed mode)');
 * // 'IMOS_-_Argo_Profiles_(delayed_mode)'
 */
export const sanitiseFileNamePart = (text?: string): string => {
  const sanitised = (text ?? "")
    .replace(ILLEGAL_FILE_NAME_CHARS, "")
    .replace(CONTROL_CHARS, "")
    .trim()
    .replace(/\s+/g, "_")
    // Leading dots hide the file on unix systems, trailing dots break Windows
    .replace(/^\.+/, "")
    .replace(/\.+$/, "")
    .slice(0, MAX_FILE_NAME_PART_LENGTH);

  return sanitised || DEFAULT_FILE_NAME_PART;
};

/**
 * Resolves the file extension for a download format, falling back to csv when
 * the format is unknown.
 *
 * @param format The selected download format or server media type, e.g. "text/csv"
 * @returns The matching file extension without the leading dot
 */
export const getDownloadFileExtension = (format?: string): string =>
  (format && FORMAT_EXTENSIONS[format]) || DEFAULT_FILE_EXTENSION;

interface DownloadFileNameProps {
  collectionTitle?: string;
  // Only supplied when the collection offers more than one dataset to download
  datasetTitle?: string;
  format?: string;
}

/**
 * Builds the name of a downloaded file from the collection title, plus the
 * selected dataset title when the collection has more than one dataset.
 *
 * @example
 * buildDownloadFileName({ collectionTitle: 'Argo Profiles', format: 'text/csv' });
 * // 'Argo_Profiles.csv'
 *
 * @example
 * buildDownloadFileName({
 *   collectionTitle: 'Argo Profiles',
 *   datasetTitle: 'Profile measurements',
 *   format: 'shape-zip',
 * });
 * // 'Argo_Profiles-Profile_measurements.zip'
 */
export const buildDownloadFileName = ({
  collectionTitle,
  datasetTitle,
  format,
}: DownloadFileNameProps): string => {
  const collectionPart = sanitiseFileNamePart(collectionTitle);
  const datasetPart = datasetTitle ? sanitiseFileNamePart(datasetTitle) : "";
  const baseName = datasetPart
    ? `${collectionPart}-${datasetPart}`
    : collectionPart;

  return `${baseName}.${getDownloadFileExtension(format)}`;
};
