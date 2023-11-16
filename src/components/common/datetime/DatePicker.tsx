import * as React from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import {DateTimePicker, DateTimePickerProps} from '@mui/x-date-pickers/DateTimePicker';

const DatePicker = (props: DateTimePickerProps<any>) => {
    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker {...props} />
        </LocalizationProvider>
    );
}

export default DatePicker;