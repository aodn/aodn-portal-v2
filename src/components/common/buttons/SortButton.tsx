import { IconButton } from "@mui/material";
import ArrowDropDownSharpIcon from "@mui/icons-material/ArrowDropDownSharp";
import SouthSharpIcon from "@mui/icons-material/SouthSharp";
import SortSharpIcon from "@mui/icons-material/SortSharp";

const SortButton = () => {
  return (
    <>
      <IconButton>
        <SouthSharpIcon
          sx={{ width: "16px", marginLeft: "-10px", marginRight: "-3px" }}
        />
        <SortSharpIcon sx={{ marginRight: "-3px" }} />
        <ArrowDropDownSharpIcon />
      </IconButton>
    </>
  );
};

export default SortButton;
