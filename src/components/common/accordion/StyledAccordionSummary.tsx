import { styled } from "@mui/material/styles";
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from "@mui/material/AccordionSummary";
import PushPinIcon from "@mui/icons-material/PushPin";
import { color, fontSize, gap, padding } from "../../../styles/constants";
import BookmarkButton from "../../bookmark/BookmarkButton";

const StyledAccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    // expandIcon={
    //   // <PushPinIcon
    //   //   sx={{
    //   //     fontSize: fontSize.info,
    //   //     color: color.blue.dark,
    //   //   }}
    //   // />
    //   <BookmarkButton />
    // }
    sx={{ padding: padding.extraSmall }}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor: color.blue.xLight,
  // flexDirection: "row-reverse",
  // "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
  //   transform: "none",
  // },
  "& .MuiAccordionSummary-content": {
    margin: 0,
  },
}));

export default StyledAccordionSummary;
