import { Grid, Link, Typography } from "@mui/material";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import React from "react";
import {
  IAddress,
  IContact,
} from "../../../common/store/OGCCollectionDefinitions";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import PrintOutlinedIcon from "@mui/icons-material/PrintOutlined";

interface ContactAreaProps {
  contact: IContact;
}

const ContactArea: React.FC<ContactAreaProps> = ({ contact }) => {
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
      // TODO: toast warning
    }
  };
  return (
    <Grid container>
      <Grid item container md={12}>
        <Grid item container md={1} display="flex" justifyContent="center">
          <LocationOnOutlinedIcon />
        </Grid>
        <Grid item container md={5} data-testid="contact-address">
          {!delivery_point &&
            !city &&
            !country &&
            !postal_code &&
            !administrative_area && (
              <Grid item md={12}>
                [NO ADDRESS]
              </Grid>
            )}
          {delivery_point?.map((line) => {
            return (
              <Grid item md={12} key={line}>
                <Typography variant="detailContent">{line}</Typography>
              </Grid>
            );
          })}
          {city && (
            <Grid item md={12}>
              <Typography variant="detailContent">{city}</Typography>
            </Grid>
          )}
          {administrative_area && (
            <Grid item md={12}>
              <Typography variant="detailContent">
                {administrative_area}
              </Typography>
            </Grid>
          )}
          {postal_code && (
            <Grid item md={12}>
              <Typography variant="detailContent">{postal_code}</Typography>
            </Grid>
          )}
          {country && (
            <Grid item md={12}>
              <Typography variant="detailContent">{country}</Typography>
            </Grid>
          )}
        </Grid>
        <Grid item md={6} data-testid="contact-phone">
          {(!phones || phones.length === 0) && (
            <Grid item md={12}>
              [NO CONTACT]
            </Grid>
          )}
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
                    <Typography variant="detailContent">
                      {`\u00A0 ${phone.value} (${phone.roles[0]})`}
                    </Typography>
                  </Grid>
                </Grid>
              );
            })}
        </Grid>
      </Grid>
      <Grid item container md={12}>
        <Grid item container md={12} data-testid="contact-link">
          <Grid item md={1} display="flex" justifyContent="center">
            <LanguageOutlinedIcon />
          </Grid>
          {(!links || links.length === 0) && (
            <Grid item md={11}>
              [NO URL]
            </Grid>
          )}
          {links &&
            links.map((link, index) => {
              return (
                <Grid item md={11} key={index}>
                  <Link href={link.href}>{link.title}</Link>
                </Grid>
              );
            })}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ContactArea;
