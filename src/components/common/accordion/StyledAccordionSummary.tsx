import { styled } from "@mui/material/styles";
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from "@mui/material/AccordionSummary";
import { color, padding } from "../../../styles/constants";

const StyledAccordionSummary = styled(
  MuiAccordionSummary
)<AccordionSummaryProps>({
  padding: padding.extraSmall,
  backgroundColor: color.blue.xLight,
  "& .MuiAccordionSummary-content": {
    margin: 0,
  },
  "&.Mui-expanded": {
    backgroundColor: "#fff",
  },
});

export default StyledAccordionSummary;
