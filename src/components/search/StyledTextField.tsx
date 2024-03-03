import { styled } from '@mui/material/styles';
import { TextField, TextFieldProps } from '@mui/material';

const StyledTextField = styled((props: TextFieldProps) => (
  <TextField {...props} />
))(() => ({
  minWidth: '100%',
  //marginInline: '2px',
  //backgroundColor: grey['search'],
  '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
    borderColor: 'white',
  },
  // "& .MuiOutlinedInput-input": {
  //     color: "black"
  // },
  // "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
  //     borderColor: "red"
  // },
  // "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
  //     borderColor: "purple"
  // },
  // "&:hover .MuiOutlinedInput-input": {
  //     color: "red"
  // },
  // "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-input": {
  //     color: "purple"
  // },
  // "& .MuiInputLabel-outlined": {
  //     color: "green"
  // },
  // "&:hover .MuiInputLabel-outlined": {
  //     color: "red"
  // },
  // "& .MuiInputLabel-outlined.Mui-focused": {
  //     color: "purple"
  // }
}));

export default StyledTextField;
