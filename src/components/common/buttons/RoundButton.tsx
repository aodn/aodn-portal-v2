import * as React from 'react';
import {Button, ButtonProps} from '@mui/material';
import { styled } from '@mui/material/styles';
import grey from '../colors/grey';

const RoundButton = styled(Button)<ButtonProps>(({ theme }) => ({
    borderRadius: '24px',
    textTransform: "none",
    backgroundColor: grey['search'],
    color: grey["searchButtonText"]
}));

export default RoundButton;