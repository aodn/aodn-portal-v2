import { Grid, Link, Typography } from "@mui/material";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import React from "react";
import {
  IAddress,
  IContact,
} from "../../common/store/OGCCollectionDefinitions";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import PrintOutlinedIcon from "@mui/icons-material/PrintOutlined";

interface ContactItemProps {
  contact: IContact;
}

const ContactItem: React.FC<ContactItemProps> = ({ contact }) => {
  let addresses: IAddress;
  if (contact && Array.isArray(contact.addresses) && contact.addresses[0]) {
    addresses = contact.addresses[0];
  } else {
    addresses = {} as IAddress;
  }
  const { delivery_point, city, country, postal_code, administrative_area } =
    addresses;
  const phones = contact.phones;
  const links = contact.links;

  const getIconByRole = (role: string) => {
    switch (role) {
      case "voice":
        return <LocalPhoneOutlinedIcon />;
      case "facsimile":
        return <PrintOutlinedIcon />;
      default:
        // debug usage. Should be existing for long term
        <Typography>UNKNOWN PHONE ROLE. PLEASE IMPLEMENT</Typography>;
    }
  };
  return (
    <Grid container>
      <Grid item container md={12}>
        <Grid item container md={1}>
          <LocationOnOutlinedIcon />
        </Grid>
        <Grid item container md={5}>
          {delivery_point?.map((line) => {
            return (
              <Grid item md={12} key={line}>
                <Typography>{line}</Typography>
              </Grid>
            );
          })}
          {city && (
            <Grid item md={12}>
              <Typography>{city}</Typography>
            </Grid>
          )}
          {administrative_area && (
            <Grid item md={12}>
              <Typography>{administrative_area}</Typography>
            </Grid>
          )}
          {postal_code && (
            <Grid item md={12}>
              <Typography>{postal_code}</Typography>
            </Grid>
          )}
          {country && (
            <Grid item md={12}>
              <Typography>{country}</Typography>
            </Grid>
          )}
        </Grid>
        <Grid item md={6}>
          {phones &&
            phones.map((phone) => {
              return (
                <Grid container item md={12} key={phone.value}>
                  <Grid item md={1}>
                    {/*Debug usage. Should be existing for long term*/}
                    {phone.roles.length > 1 &&
                      "MORE ROLES FOUND IN PHONE. PLEASE IMPLEMENT"}
                    {getIconByRole(phone.roles[0])}
                  </Grid>
                  <Grid item md={11}>
                    {`${phone.value} (${phone.roles[0]})`}
                  </Grid>
                </Grid>
              );
            })}
        </Grid>
      </Grid>
      <Grid item container md={12}>
        {links &&
          links.map((link) => {
            return (
              <Grid item container md={12} key={link.href}>
                <Grid item md={1}>
                  <LanguageOutlinedIcon />
                </Grid>
                <Grid item md={11}>
                  <Link href={link.href}>{link.title}</Link>
                </Grid>
              </Grid>
            );
          })}
        {/*</Grid>*/}
      </Grid>
    </Grid>
  );
};

export default ContactItem;
