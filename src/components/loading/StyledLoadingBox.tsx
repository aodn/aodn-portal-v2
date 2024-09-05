import { styled } from "@mui/material/styles";
import { Box } from "@mui/material";

const StyledLoadingBox = styled(Box)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 200px;
`;

export default StyledLoadingBox;
