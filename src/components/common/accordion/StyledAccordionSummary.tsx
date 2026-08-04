import { styled } from "@mui/material/styles";
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from "@mui/material/AccordionSummary";
import { color, padding } from "@/styles/constants";

const StyledAccordionSummary = styled(
  MuiAccordionSummary
)<AccordionSummaryProps>({
  padding: padding.extraSmall,
  backgroundColor: color.blue.xLight,
  // Content is a flex span; force full width so child titles are not clipped.
  "& .MuiAccordionSummary-content": {
    margin: 0,
    width: "100%",
    minWidth: 0,
  },
  "&.Mui-expanded": {
    backgroundColor: "#fff",
  },
});

export default StyledAccordionSummary;
