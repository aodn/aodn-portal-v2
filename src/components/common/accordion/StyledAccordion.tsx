import { styled } from "@mui/material/styles";
import MuiAccordion, { AccordionProps } from "@mui/material/Accordion";

// Accordion expand/collapse constants
export const COLLAPSE_DURATION = 200;
export const EXPAND_DURATION = 300;
export const EXPAND_DELAY = 150;

const StyledAccordion = styled((props: AccordionProps) => (
  <MuiAccordion
    disableGutters
    elevation={0}
    square
    slotProps={{
      transition: {
        timeout: {
          enter: EXPAND_DURATION + EXPAND_DELAY,
          exit: COLLAPSE_DURATION,
        },
        easing: {
          enter: "cubic-bezier(0.4, 0, 0.2, 1)",
          exit: "cubic-bezier(0.4, 0, 1, 1)",
        },
        mountOnEnter: true,
        unmountOnExit: true,
      },
    }}
    {...props}
  />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&::before": {
    display: "none",
  },
  "& .MuiCollapse-root": {
    transition: `height ${COLLAPSE_DURATION}ms cubic-bezier(0.4, 0, 1, 1)`,
  },
  "& .MuiCollapse-root.Mui-expanded": {
    transition: `height ${EXPAND_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1)`,
    transitionDelay: `${EXPAND_DELAY}ms`,
  },
}));

export default StyledAccordion;
