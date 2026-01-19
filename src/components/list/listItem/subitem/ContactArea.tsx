import React from "react";
import {
  IAddress,
  IContact,
} from "../../../common/store/OGCCollectionDefinitions";
import { portalTheme } from "../../../../styles";
import { Grid, Link, Typography, Box } from "@mui/material";
import { LocationOnOutlinedIcon } from "../../../../assets/icons/details/location";
import { LanguageOutlinedIcon } from "../../../../assets/icons/details/language";
import { LocalPhoneOutlinedIcon } from "../../../../assets/icons/details/phone";
import { PrintOutlinedIcon } from "../../../../assets/icons/details/fax";

interface ContactAreaProps {
  contact: IContact;
}

const ContactArea: React.FC<ContactAreaProps> = ({ contact }) => {
  const address = contact?.addresses?.[0] || ({} as IAddress);
  const { delivery_point, city, country, postal_code, administrative_area } =
    address;

  const phones = contact?.phones || [];
  const links = contact?.links || [];
  const hasAddress =
    delivery_point || city || country || postal_code || administrative_area;

  const getPhoneIcon = (role: string) => {
    switch (role) {
      case "voice":
        return <LocalPhoneOutlinedIcon />;
      case "facsimile":
        return <PrintOutlinedIcon />;
      default:
        return null; // TODO: Add toast warning
    }
  };

  const renderTextLine = (text: string, key?: string) => (
    <Typography
      key={key}
      sx={{ ...portalTheme.typography.body2Regular, pt: "2px", mt: "4px" }}
      display="block"
    >
      {text}
    </Typography>
  );

  return (
    <Grid container spacing={2} sx={{ mt: "1px", mb: "14px" }}>
      <Grid item container spacing={2}>
        {/* Address */}
        <Grid item xs={12} sm={12} md={6}>
          <Box
            display="flex"
            alignItems="flex-start"
            gap={1.5}
            data-testid="contact-address"
          >
            {hasAddress && (
              <>
                <Box sx={{ mt: "4px", flexShrink: 0 }}>
                  <LocationOnOutlinedIcon />
                </Box>
                <Box>
                  {delivery_point?.map((line) => renderTextLine(line, line))}
                  {city && renderTextLine(city)}
                  {administrative_area && renderTextLine(administrative_area)}
                  {postal_code && renderTextLine(postal_code)}
                  {country && renderTextLine(country)}
                </Box>
              </>
            )}
          </Box>
        </Grid>

        {/* Phones */}
        <Grid item xs={12} sm={12} md={6} data-testid="contact-phone">
          {phones.length > 0 &&
            phones.map((phone) => (
              <Box
                key={phone.value}
                display="flex"
                alignItems="center"
                gap={1.5}
                mb={0.5}
              >
                {phone.roles.length > 1 && (
                  <Typography color="error" variant="caption">
                    Multiple roles found - please implement
                  </Typography>
                )}

                <Box sx={{ mt: "4px", flexShrink: 0 }}>
                  {getPhoneIcon(phone.roles[0])}
                </Box>

                <Typography
                  sx={{
                    ...portalTheme.typography.body2Regular,
                    pt: 0,
                  }}
                >
                  {`${phone.value} (${phone.roles[0]})`}
                </Typography>
              </Box>
            ))}
        </Grid>
      </Grid>

      {/* Links */}
      <Grid item xs={12}>
        <Box
          display="flex"
          alignItems="flex-start"
          gap={1.5}
          data-testid="contact-link"
        >
          {links.length > 0 && <LanguageOutlinedIcon />}
          <Box sx={{ minWidth: 0 }}>
            {links.length > 0 &&
              links.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  display="block"
                  sx={{
                    ...portalTheme.typography.body2Regular,
                    color: portalTheme.palette.primary1,
                    wordBreak: "break-word",
                  }}
                >
                  {link.title}
                </Link>
              ))}
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};

export default ContactArea;
