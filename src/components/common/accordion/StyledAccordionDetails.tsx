import { styled } from "@mui/material/styles";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import { padding } from "@/styles/constants";
import { EXPAND_DURATION, EXPAND_DELAY } from "./StyledAccordion";

const StyledAccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: padding.extraSmall,
  borderTop: `1px solid ${theme.palette.divider}`,
  opacity: 0,
  transition: `opacity ${EXPAND_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1)`,
  ".MuiAccordion-root.Mui-expanded &": {
    opacity: 1,
    transitionDelay: `${EXPAND_DELAY}ms`,
    borderTop: "none",
  },
  "& .MuiButton-root": {
    display: "inline-flex",
    overflow: "visible",
    width: "auto",
  },
}));

export default StyledAccordionDetails;
