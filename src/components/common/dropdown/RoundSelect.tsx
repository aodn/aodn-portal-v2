import { Select, SelectProps } from "@mui/material";
import { styled } from "@mui/material/styles";
import grey from "../colors/grey";

const RoundSelect = styled((props: SelectProps) => <Select {...props} />)(
  ({ theme }) => ({
    borderRadius: "10px",
    textTransform: "none",
    //backgroundColor: grey["search"],
    color: "black",
    width: "100%",
    maxHeight: "30px",
  })
);

export default RoundSelect;
