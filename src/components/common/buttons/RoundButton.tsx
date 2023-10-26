import {Button, ButtonProps} from '@mui/material';
import { styled } from '@mui/material/styles';
import grey from '../colors/grey';
import { borderRadius } from '../constants';

const RoundButton = styled(Button)<ButtonProps>(({ theme }) => ({
    borderRadius: borderRadius,
    textTransform: "none",
    backgroundColor: grey['search'],
    color: grey["searchButtonText"]
}));

export default RoundButton;