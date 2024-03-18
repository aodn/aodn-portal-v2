import { Select, SelectProps } from "@mui/material";
import { styled } from "@mui/material/styles";

type RoundSelectProps = Partial<SelectProps>;

const RoundSelect = styled((props: RoundSelectProps) => <Select {...props} />)(
  () => ({
    borderRadius: "10px",
    textTransform: "none",
    color: "black",
    width: "100%",
    maxHeight: "30px",
  })
);

export default RoundSelect;
