import * as React from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import {DateTimePicker, DateTimePickerProps} from '@mui/x-date-pickers/DateTimePicker';
// TODO: Temp works but need to check user locale on date time format
import "dayjs/locale/en-gb";

const DatePicker = (props: DateTimePickerProps<any>) => {

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={"en-gb"}>
            <DateTimePicker {...props} />
        </LocalizationProvider>
    );
}

export default DatePicker;
