import { portalTheme } from "@/styles";
import { SearchKeys } from "@/components/search/constants";
import AADLogo from "@/assets/partners/aad-logo.webp";
import AIMSLogo from "@/assets/partners/aims-logo.webp";
import CSIROLogo from "@/assets/partners/csiro-logo.webp";
import GALogo from "@/assets/partners/ga-logo.webp";
import IMASLogo from "@/assets/partners/imas-logo.webp";
import NCILogo from "@/assets/partners/nci-logo.webp";
import EAtlasLogo from "@/assets/partners/eatlas-logo.webp";
import WAMSILogo from "@/assets/partners/wamsi-logo.webp";

/**
 * Shows the new partners section on the landing page. The production build
 * (mode "prod") keeps the old logo list until the new section is approved.
 */
export const isPartnersSectionEnabled = import.meta.env.MODE !== "prod";

export const PARTNERS_COLOURS = portalTheme.designTokens.colours.partners;

export const IMOS_STATS = [
  { value: "1,685+", label: "IMOS datasets in the AODN catalogue" },
  { value: "20 years", label: "Of sustained ocean observing, since 2006" },
  { value: "Trusted", label: "Discoverable and accessible" },
  { value: "Free", label: "To search, preview and download" },
];

// Logo size grows with its aspect ratio, but slower than the ratio itself.
// So wide logos do not shrink too much next to square ones.
export const LOGO_SIZE_POWER = 0.62;

export interface Contributor {
  datasetGroup: SearchKeys;
  shortName: string;
  fullName: string;
  website: string;
  description: string;
  logo: string;
  // Width / height of the logo file
  logoAspectRatio: number;
  // Below 1 for heavy logos, above 1 for light logos
  logoScale: number;
  accent: string;
  brand: string;
}

const { contributors } = portalTheme.designTokens.colours;

export const CONTRIBUTORS: Contributor[] = [
  {
    datasetGroup: SearchKeys.AAD,
    shortName: "AAD",
    fullName: "Australian Antarctic Division",
    website: "https://www.antarctica.gov.au",
    description:
      "Australia’s Antarctic and Southern Ocean research agency — operator of the RSV Nuyina and the continental research stations.",
    logo: AADLogo,
    logoAspectRatio: 0.978,
    logoScale: 1.05,
    ...contributors.aad,
  },
  {
    datasetGroup: SearchKeys.AIMS,
    shortName: "AIMS",
    fullName: "Australian Institute of Marine Science",
    website: "https://www.aims.gov.au",
    description:
      "Australia’s tropical marine research agency, monitoring the Great Barrier Reef and the reefs of Western Australia and the Northern Territory.",
    logo: AIMSLogo,
    logoAspectRatio: 3.985,
    logoScale: 1.1,
    ...contributors.aims,
  },
  {
    datasetGroup: SearchKeys.CSIRO,
    shortName: "CSIRO",
    fullName: "Commonwealth Scientific and Industrial Research Organisation",
    website: "https://www.csiro.au",
    description:
      "Australia’s national science agency — operator of RV Investigator, the regional Argo array and the national ocean forecasting and reanalysis systems.",
    logo: CSIROLogo,
    logoAspectRatio: 1.018,
    logoScale: 0.94,
    ...contributors.csiro,
  },
  {
    datasetGroup: SearchKeys.GA,
    shortName: "GA",
    fullName: "Geoscience Australia",
    website: "https://www.ga.gov.au",
    description:
      "The Australian Government’s geoscience agency, mapping the seabed, coastline and marine jurisdiction of the continent.",
    logo: GALogo,
    logoAspectRatio: 4.043,
    logoScale: 1.1,
    ...contributors.ga,
  },
  {
    datasetGroup: SearchKeys.IMAS,
    shortName: "IMAS",
    fullName:
      "Institute for Marine and Antarctic Studies, University of Tasmania",
    website: "https://www.utas.edu.au/imas",
    description:
      "The University of Tasmania’s marine and Antarctic research institute, and Lead Agent for the IMOS national observing program.",
    logo: IMASLogo,
    logoAspectRatio: 1.042,
    logoScale: 1,
    ...contributors.imas,
  },
  {
    datasetGroup: SearchKeys.NCI,
    shortName: "NCI",
    fullName: "National Computational Infrastructure",
    website: "https://nci.org.au",
    description:
      "Australia’s national research computing facility, hosting and serving the large gridded marine and climate collections.",
    logo: NCILogo,
    logoAspectRatio: 2.115,
    logoScale: 0.94,
    ...contributors.nci,
  },
  {
    datasetGroup: SearchKeys.EATLAS,
    shortName: "eAtlas",
    fullName: "eAtlas — Tropical Marine Data Portal",
    website: "https://eatlas.org.au",
    description:
      "A tropical marine data portal publishing mapping and monitoring products for the Great Barrier Reef, Torres Strait and north-west shelf.",
    logo: EAtlasLogo,
    logoAspectRatio: 2.723,
    logoScale: 1.06,
    ...contributors.eatlas,
  },
  {
    datasetGroup: SearchKeys.WAMSI,
    shortName: "WAMSI",
    fullName: "Western Australian Marine Science Institution",
    website: "https://wamsi.org.au",
    description:
      "A partnership of Western Australian marine research institutions delivering independent science for the state’s coast and marine estate.",
    logo: WAMSILogo,
    logoAspectRatio: 3.338,
    logoScale: 0.96,
    ...contributors.wamsi,
  },
];
