import { styled } from "@mui/material/styles";
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from "@mui/material/AccordionSummary";
import { color, padding } from "../../../styles/constants";

const StyledAccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary sx={{ padding: padding.extraSmall }} {...props} />
))(() => ({
  backgroundColor: color.blue.xLight,

  "& .MuiAccordionSummary-content": {
    margin: 0,
  },
}));

export default StyledAccordionSummary;
