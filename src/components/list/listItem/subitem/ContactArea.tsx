import { Grid, Link, Typography, Box } from "@mui/material";
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
        <Grid item md={6}>
          {/* Address section */}
          {!(
            !delivery_point &&
            !city &&
            !country &&
            !postal_code &&
            !administrative_area
          ) && (
            <Box
              display="flex"
              alignItems="flex-start"
              gap={1}
              data-testid="contact-address"
            >
              <LocationOnOutlinedIcon sx={{ mt: 0.5, flexShrink: 0 }} />
              <Box>
                {delivery_point?.map((line) => (
                  <Typography
                    variant="detailContent"
                    key={line}
                    display="block"
                  >
                    {line}
                  </Typography>
                ))}
                {city && (
                  <Typography variant="detailContent" display="block">
                    {city}
                  </Typography>
                )}
                {administrative_area && (
                  <Typography variant="detailContent" display="block">
                    {administrative_area}
                  </Typography>
                )}
                {postal_code && (
                  <Typography variant="detailContent" display="block">
                    {postal_code}
                  </Typography>
                )}
                {country && (
                  <Typography variant="detailContent" display="block">
                    {country}
                  </Typography>
                )}
              </Box>
            </Box>
          )}
          {!delivery_point &&
            !city &&
            !country &&
            !postal_code &&
            !administrative_area && (
              <></>
              // todo
              // <Grid item md={12}>
              //   [NO ADDRESS]
              // </Grid>
            )}
        </Grid>
        <Grid item md={6} data-testid="contact-phone">
          {(!phones || phones.length === 0) && (
            <></>
            // todo
            // <Grid item md={12}>
            //   [NO CONTACT]
            // </Grid>
          )}
          {phones &&
            phones.map((phone) => {
              return (
                <Box
                  display="flex"
                  alignItems="center"
                  gap={1}
                  key={phone.value}
                  mb={0.5}
                >
                  {/*Debug usage. Should be existing for long term*/}
                  {phone.roles.length > 1 &&
                    "MORE ROLES FOUND IN PHONE. PLEASE IMPLEMENT"}
                  {getIconByRole(phone.roles[0])}
                  <Typography variant="detailContent">
                    {`${phone.value} (${phone.roles[0]})`}
                  </Typography>
                </Box>
              );
            })}
        </Grid>
      </Grid>
      <Grid item container md={12}>
        <Grid item container md={12} data-testid="contact-link">
          <Box display="flex" alignItems="flex-start" gap={1}>
            {!(!links || links.length === 0) && (
              <LanguageOutlinedIcon sx={{ mt: 0.5, flexShrink: 0 }} />
            )}
            <Box sx={{ mt: "4px" }}>
              {(!links || links.length === 0) && (
                <></>
                // todo
                // <Grid item md={11}>
                //   [NO URL]
                // </Grid>
              )}
              {links &&
                links.map((link, index) => {
                  return (
                    <Link href={link.href} key={index}>
                      {link.title}
                    </Link>
                  );
                })}
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ContactArea;
