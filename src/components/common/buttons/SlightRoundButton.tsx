import {Button, ButtonProps} from '@mui/material';
import { styled } from '@mui/material/styles';
import grey from '../colors/grey';
import { borderRadius, border } from '../constants';

const SlightRoundButton = styled((props: ButtonProps) => (
    <Button 
        {...props}
    />))(({ theme }) => ({
        borderRadius: borderRadius['filter'],
        textTransform: "none",
        backgroundColor: grey['search'],
        border: border['buttonBorder'],
        color: grey["searchButtonText"]
}));

export default SlightRoundButton;