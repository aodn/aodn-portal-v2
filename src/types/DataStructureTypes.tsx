// TODO: mock interface
interface IKeyword {
  title: string;
  content: string[];
}

interface ILink {
  rel: string;
  href: string;
  type: string;
  title: string;
}

interface IAddress {
  delivery_point: string[];
  city: string;
  administrative_area: string;
  postal_code: string;
  country: string;
}

interface IInfo {
  value: string;
  roles: string[];
}

interface IContact {
  name: string;
  organization: string;
  identifier: string;
  position: string;
  emails: string[];
  addresses: IAddress[];
  phones: IInfo[];
  links: ILink[];
  roles: string[];
}

interface IConcept {
  id: string;
  url: string;
}

interface ITheme {
  scheme: string;
  description: string;
  title: string;
  concepts: IConcept[];
}

export type { IKeyword, ILink, IAddress, IContact, IConcept, ITheme };
