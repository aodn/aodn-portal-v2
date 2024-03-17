import { Button, ButtonProps } from "@mui/material";
import { styled } from "@mui/material/styles";

const NoBorderButton = styled((props: ButtonProps) => <Button {...props} />)(
  () => ({
    border: "none",
    textTransform: "none",
    backgroundColor: "none",
    fontSize: "1rem",
    color: "white",
  })
);

export default NoBorderButton;
