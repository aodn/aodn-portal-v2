import { styled } from "@mui/material/styles";
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from "@mui/material/AccordionSummary";
import PushPinIcon from "@mui/icons-material/PushPin";
import { fontSize, gap } from "../../../styles/constants";

const StyledAccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={<PushPinIcon sx={{ fontSize: fontSize.info }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor: "rgba(0, 0, 0, .03)",
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(60deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: gap.lg,
  },
}));

export default StyledAccordionSummary;
