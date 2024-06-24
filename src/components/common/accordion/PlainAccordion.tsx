import { AccordionProps, styled } from "@mui/material";
import MuiAccordion from "@mui/material/Accordion";

const PlainAccordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} {...props} />
))(({ theme }) => ({
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&::before": {
    display: "none",
  },
}));

export default PlainAccordion;
