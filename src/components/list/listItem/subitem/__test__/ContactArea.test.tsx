import { render, screen } from "@testing-library/react";
import ContactArea from "../ContactArea";
import { CONTACT } from "../../../../../__mocks__/data/SPECIFIC_DETAILS";
import AppTheme from "../../../../../utils/AppTheme";
import { ThemeProvider } from "@mui/material/styles";
import { expect } from "vitest";

describe("ContactArea", async () => {
  const theme = AppTheme;
  test("should render ContactArea", async () => {
    render(
      <ThemeProvider theme={theme}>
        <ContactArea contact={CONTACT} />
      </ThemeProvider>
    );
    const deliveryPoint1 = screen.queryByText(
      CONTACT.addresses[0].delivery_point[0]
    );
    expect(deliveryPoint1).to.exist;

    const deliveryPoint2 = screen.queryByText(
      CONTACT.addresses[0].delivery_point[1]
    );
    expect(deliveryPoint2).to.exist;

    const city = screen.queryByText(CONTACT.addresses[0].city);
    expect(city).to.exist;

    const country = screen.queryByText(CONTACT.addresses[0].country);
    expect(country).to.exist;

    const postalCode = screen.queryByText(CONTACT.addresses[0].postal_code);
    expect(postalCode).to.exist;

    const administrativeArea = screen.queryByText(
      CONTACT.addresses[0].administrative_area
    );
    expect(administrativeArea).to.exist;

    const phone1 = screen.queryByText(
      CONTACT.phones[0].value + ` (${CONTACT.phones[0].roles[0]})`
    );
    expect(phone1).to.exist;

    const phone2 = screen.queryByText(
      CONTACT.phones[1].value + ` (${CONTACT.phones[1].roles[0]})`
    );
    expect(phone2).to.exist;

    const link = screen.queryByText(CONTACT.links[0].title);
    expect(link).to.exist;
    const href = link!.getAttribute("href");
    expect(href).toEqual(CONTACT.links[0].href);
  });
});
