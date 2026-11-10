import { pageDefault, detailPageDefault } from "@/components/common/constants";
import { OGCCollection } from "@/app/store/OGCCollectionDefinitions";
import { formatDate, toAppDayjs } from "@/utils/DateUtils";
import { Dayjs } from "@/utils/DayjsUtils";

const YEAR_PLACEHOLDER = /\[year-of-data-download(?:ed)?\]/gi;
const TITLE_PLACEHOLDER = /\[title\]/gi;
const ACCESS_URL_PLACEHOLDER = /\[data-access-url\]/gi;
const ACCESS_DATE_PLACEHOLDER = /\[date-of-access\]/gi;

const ACCESS_DATE_FORMAT = "DD-MMM-YYYY";

export const buildDataAccessUrl = (uuid: string): string =>
  `${window.location.origin}${pageDefault.details}/${uuid}?tab=${detailPageDefault.SUMMARY}`;

export const resolveSuggestedCitation = (
  suggestedCitation: string | undefined,
  uuid: string | undefined,
  title: string | undefined,
  accessDate: Dayjs = toAppDayjs()
): string => {
  if (!suggestedCitation) return "";

  const accessUrl = uuid ? buildDataAccessUrl(uuid) : "";

  return suggestedCitation
    .replace(YEAR_PLACEHOLDER, String(accessDate.year()))
    .replace(TITLE_PLACEHOLDER, title ?? "")
    .replace(ACCESS_URL_PLACEHOLDER, accessUrl)
    .replace(
      ACCESS_DATE_PLACEHOLDER,
      formatDate(accessDate, ACCESS_DATE_FORMAT)
    );
};

const normalizeConstraint = (constraint: string) =>
  constraint.trim().replace(/\s+/g, " ").toLowerCase();

// The usage constraints of a collection.
// The download dialog shows this list. The download request sends it too,
// so the emails show the same list as the dialog.
// It drops empty items, the licence text, and duplicates.
export const getUsageConstraints = (
  collection: OGCCollection | undefined
): string[] => {
  const citation = collection?.getCitation();
  const license = collection?.getLicense();
  const normalizedLicense = license ? normalizeConstraint(license) : "";
  const metadataConstraints = [
    ...(citation?.useLimitations ?? []),
    ...(citation?.otherConstraints ?? []),
  ].filter(
    (constraint) =>
      constraint && normalizeConstraint(constraint) !== normalizedLicense
  );
  const uniqueConstraints = new Set<string>();

  return metadataConstraints.filter((constraint) => {
    const normalizedConstraint = normalizeConstraint(constraint);

    if (uniqueConstraints.has(normalizedConstraint)) {
      return false;
    }

    uniqueConstraints.add(normalizedConstraint);
    return true;
  });
};
