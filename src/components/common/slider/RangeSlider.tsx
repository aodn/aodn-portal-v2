import * as React from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import {SxProps, Theme} from "@mui/material";
import {useCallback, useEffect} from "react";

interface NumberRangeSliderProps {
    title: string,
    label: (value: number, min: number, max: number) => string,
    min: number,
    max: number,
    sx?: SxProps<Theme>
}

interface DateRangeSliderProps {
    title: string,
    label: (value: number, min: number, max: number) => string,
    min: Date,
    max: Date,
    sx?: SxProps<Theme>
}

/**
 * The range allow value within 0 to 100, so we need to map value if out of boundary
 * @param min
 * @param max
 * @param i
 */
const mapRangeToZeroHundred = (min :number, max: number, i : number) : number => {
    if(i === min) {
        return 0;
    }
    else if(i === max) {
        return 100;
    }
    else {
        return i / (max - min) * 100;
    }
}
/**
 * Reverse the above
 * @param min
 * @param max
 * @param i
 */
const mapRangeToRealValue = (min :number, max: number, i : number) : number => (max - min) * i / 100;

const NumberRangeSlider = ({title, label, min, max, sx}: NumberRangeSliderProps) => {

    const [value, setValue] = React.useState<number[]>([
        mapRangeToZeroHundred(min, max, min),
        mapRangeToZeroHundred(min, max, max)
    ]);

    useEffect(() => {
        setValue([mapRangeToZeroHundred(min, max, min), mapRangeToZeroHundred(min, max, max)]);
    }, [min, max, setValue]);

    const handleChange = useCallback((event: Event, newValue: number | number[]) => {
        setValue(newValue as number[]);
    },[setValue]);

    return (
        <Box sx={sx}>
            <Slider
                getAriaLabel={() => title}
                value={value}
                onChange={handleChange}
                valueLabelDisplay="auto"
                getAriaValueText={(v) => label(v, min, max)}
                valueLabelFormat={(v) => label(v, min, max)}
            />
        </Box>
    );
}

const DateRangeSlider = (props : DateRangeSliderProps) =>
    NumberRangeSlider({
        title: props.title,
        label: props.label,
        min: props.min.getTime(),
        max: props.max.getTime()
    });

NumberRangeSlider.defaultProps = {
    title: 'TODO',
    label: (value: number, min: number, max: number) => mapRangeToRealValue(min, max, value),
    min: Number.MIN_SAFE_INTEGER,
    max: Number.MAX_SAFE_INTEGER
}

DateRangeSlider.defaultProps = {
    title: 'TODO',
    label: (value: number, min: number, max: number) => new Date(mapRangeToRealValue(min, max, value)).toLocaleDateString(),
    min: new Date('01/01/1980'),
    max: new Date()
}

export {
    NumberRangeSlider,
    DateRangeSlider
};