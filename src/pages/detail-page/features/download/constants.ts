/**
 * Download-size thresholds driving the advisory warnings on the download cards.
 */

// Over this size the download is still allowed, but the user is advised to subset
const LARGE_DOWNLOAD_BYTES = 10 * 1024 ** 3;

// Over this size the download is blocked until the user subsets their selection.
// Kept under the 200 GB Fargate disk limit, which the download job writes to.
const EXTRA_LARGE_DOWNLOAD_BYTES = 180 * 1024 ** 3;

enum DownloadFileType {
  NETCDF = "netcdf",
  CSV = "csv",
  EXCEL = "xlsx",
  GEOTIFF = "geotiff",
}

const DOWNLOAD_FORMAT: { label: string; value: DownloadFileType }[] = [
  { label: "NetCDFs", value: DownloadFileType.NETCDF },
  { label: "Excel", value: DownloadFileType.EXCEL },
  { label: "CSV", value: DownloadFileType.CSV },
  { label: "GeoTIFF", value: DownloadFileType.GEOTIFF },
];

export {
  LARGE_DOWNLOAD_BYTES,
  EXTRA_LARGE_DOWNLOAD_BYTES,
  DOWNLOAD_FORMAT,
  DownloadFileType,
};
