import { Select, SelectProps } from "@mui/material";
import { styled } from "@mui/material/styles";

const RoundSelect = styled((props: SelectProps) => <Select {...props} />)(
  () => ({
    borderRadius: "10px",
    textTransform: "none",
    color: "black",
    width: "100%",
    maxHeight: "30px",
  })
);

export default RoundSelect;
