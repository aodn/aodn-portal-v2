import { Button, ButtonProps } from "@mui/material";
import { styled } from "@mui/material/styles";
import grey from "../colors/grey";

import { borderRadius } from "../../../styles/constants";

const RoundButton = styled((props: ButtonProps) => <Button {...props} />)(
  () => ({
    borderRadius: borderRadius["button"],
    textTransform: "none",
    backgroundColor: grey["search"],
    color: grey["searchButtonText"],
  })
);

export default RoundButton;
