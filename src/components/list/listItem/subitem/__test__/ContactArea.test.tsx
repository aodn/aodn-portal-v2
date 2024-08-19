import { render, screen } from "@testing-library/react";
import ContactArea from "../ContactArea";
import { CONTACT } from "../../../../../__mocks__/data/DETAIL_DATA";
import AppTheme from "../../../../../utils/AppTheme";
import { ThemeProvider } from "@mui/material/styles";

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
    expect(deliveryPoint1).not.toBeNull;

    const deliveryPoint2 = screen.queryByText(
      CONTACT.addresses[0].delivery_point[1]
    );
    expect(deliveryPoint2).not.toBeNull;

    const city = screen.queryByText(CONTACT.addresses[0].city);
    expect(city).not.toBeNull;

    const country = screen.queryByText(CONTACT.addresses[0].country);
    expect(country).not.toBeNull;

    const postalCode = screen.queryByText(CONTACT.addresses[0].postal_code);
    expect(postalCode).not.toBeNull;

    const administrativeArea = screen.queryByText(
      CONTACT.addresses[0].administrative_area
    );
    expect(administrativeArea).not.toBeNull;

    const phone1 = screen.queryByText(CONTACT.phones[0].value);
    expect(phone1).not.toBeNull;

    const phone2 = screen.queryByText(CONTACT.phones[1].value);
    expect(phone2).not.toBeNull;

    const link = screen.queryByText(CONTACT.links[0].title);
    expect(link).not.toBeNull;
    const href = link!.getAttribute("href");
    expect(href).toEqual(CONTACT.links[0].href);
  });
});
