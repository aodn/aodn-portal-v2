import { styled } from "@mui/material/styles";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import { padding } from "../../../styles/constants";
import { EXPAND_DELAY, EXPAND_DURATION } from "../../result/constants";

const StyledAccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: padding.extraSmall,
  borderTop: "1px solid rgba(0, 0, 0, .125)",
  opacity: 0,
  transition: `opacity ${EXPAND_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1)`,
  ".Mui-expanded &": {
    opacity: 1,
    transitionDelay: `${EXPAND_DELAY}ms`,
  },

  // Minimal button overrides needed since mapboxgl control will override button styles
  "& .MuiButton-root": {
    display: "inline-flex",
    overflow: "visible",
    width: "auto",
  },
}));

export default StyledAccordionDetails;
