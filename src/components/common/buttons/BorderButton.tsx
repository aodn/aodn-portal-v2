import {Button, ButtonProps} from '@mui/material';
import { styled } from '@mui/material/styles';
import {border} from "../constants";

const BorderButton = styled((props: ButtonProps) => (
    <Button 
        {...props}
    />))(({ theme }) => ({
    border: border['frameBorder'],
    textTransform: "none",
    backgroundColor: 'none',
    fontSize: '1rem',
    color: 'white'
}));

export default BorderButton;