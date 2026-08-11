import { alpha, styled } from "@mui/material/styles";
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from "@mui/material/AccordionSummary";
import { padding } from "@/styles/constants";
import { portalTheme } from "@/styles";

const StyledAccordionSummary = styled(
  MuiAccordionSummary
)<AccordionSummaryProps>({
  padding: padding.extraSmall,
  // Design draws the collapsed fill as primary-4 at 10% opacity.
  backgroundColor: alpha(portalTheme.palette.primary4, 0.1),
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
