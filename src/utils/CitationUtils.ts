import { pageDefault, detailPageDefault } from "@/components/common/constants";
import { formatDate, toAppDayjs } from "@/utils/DateUtils";
import { Dayjs } from "@/utils/DayjsUtils";

const YEAR_PLACEHOLDER = /\[year-of-data-download(?:ed)?\]/gi;
const ACCESS_URL_PLACEHOLDER = /\[data-access-url\]/gi;
const ACCESS_DATE_PLACEHOLDER = /\[date-of-access\]/gi;

const ACCESS_DATE_FORMAT = "DD-MMM-YYYY";

export const buildDataAccessUrl = (uuid: string): string =>
  `${window.location.origin}${pageDefault.details}/${uuid}?tab=${detailPageDefault.SUMMARY}`;

export const resolveSuggestedCitation = (
  suggestedCitation: string | undefined,
  uuid: string | undefined,
  accessDate: Dayjs = toAppDayjs()
): string => {
  if (!suggestedCitation) return "";

  const accessUrl = uuid ? buildDataAccessUrl(uuid) : "";

  return suggestedCitation
    .replace(YEAR_PLACEHOLDER, String(accessDate.year()))
    .replace(ACCESS_URL_PLACEHOLDER, accessUrl)
    .replace(
      ACCESS_DATE_PLACEHOLDER,
      formatDate(accessDate, ACCESS_DATE_FORMAT)
    );
};
