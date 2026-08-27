import { FC, ReactNode } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "@/utils/DayjsUtils";
// Registers en-au into dayjs.Ls for adapterLocale below to look up
// Does not change dayjs's global default locale
import "dayjs/locale/en-au";

interface AppLocalizationProviderProps {
  children: ReactNode;
}

export const AppLocalizationProvider: FC<AppLocalizationProviderProps> = ({
  children,
}) => (
  <LocalizationProvider
    dateAdapter={AdapterDayjs}
    adapterLocale="en-au"
    dateLibInstance={dayjs}
  >
    {children}
  </LocalizationProvider>
);
