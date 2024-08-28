import { IContact } from "../../components/common/store/OGCCollectionDefinitions";

export const CONTACT: IContact = {
  name: "",
  organization: "Integrated Marine Observing System (IMOS)",
  position: "Data Officer",
  emails: ["info@aodn.org.au"],
  addresses: [
    {
      city: "Hobart",
      country: "Australia",
      delivery_point: ["University of Tasmania", "Private Bag 110"],
      administrative_area: "Tasmania",
      postal_code: "7001",
    },
  ],
  links: [
    {
      rel: "",
      href: "http://imos.org.au/aodn.html",
      type: "WWW:LINK-1.0-http--link",
      title: "Website of the Australian Ocean Data Network (AODN)",
    },
  ],
  roles: ["distributor", "metadata"],
  phones: [
    {
      value: "61 3 6226 7488",
      roles: ["voice"],
    },
    {
      value: "61 3 6226 2107",
      roles: ["facsimile"],
    },
  ],
  identifier: "",
};
