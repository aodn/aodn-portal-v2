import { Button, ButtonProps } from "@mui/material";
import { styled } from "@mui/material/styles";
import grey from "../colors/grey";

const SlightRoundButton = styled((props: ButtonProps) => <Button {...props} />)(
  () => ({
    textTransform: "none",
    color: grey["searchButtonText"],
  })
);

export default SlightRoundButton;
