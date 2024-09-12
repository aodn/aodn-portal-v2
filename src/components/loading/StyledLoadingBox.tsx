import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";

// the top and left value may change if more components are using this one
const StyledLoadingBox = styled(Box)`
  position: absolute;
  top: 50%;
  left: 63%;
  transform: translate(-50%, -50%);
  width: 200px;
`;

export default StyledLoadingBox;
