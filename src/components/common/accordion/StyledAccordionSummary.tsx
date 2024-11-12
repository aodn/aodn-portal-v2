import { styled } from "@mui/material/styles";
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from "@mui/material/AccordionSummary";
import PushPinIcon from "@mui/icons-material/PushPin";
import { color, fontSize, gap, padding } from "../../../styles/constants";

const StyledAccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={
      <PushPinIcon
        sx={{
          fontSize: fontSize.info,
          color: color.blue.dark,
        }}
      />
    }
    sx={{ padding: padding.extraSmall }}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor: "rgba(0, 0, 0, .03)",
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    margin: 0,
    marginLeft: gap.lg,
  },
}));

export default StyledAccordionSummary;
