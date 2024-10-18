import { Tune } from "@mui/icons-material";
import { Box, Button } from "@mui/material";
import StyledBadge, { Position } from "../common/badge/StyledBadge";
import {
  borderRadius,
  color,
  fontColor,
  gap,
  padding,
} from "../../styles/constants";
const SearchbarExpandableButton = () => {
  return (
    <Box
      sx={{
        height: "100%",
        padding: gap.md,
        // minWidth: `${FILTER_BUTTON_WIDTH}px`,
      }}
    >
      <StyledBadge badgeContent={1} position={Position.topRight}>
        <Button
          fullWidth
          sx={{
            height: "100%",
            color: fontColor.blue.medium,
            paddingX: padding.large,
            backgroundColor: color.blue.xLight,
            borderRadius: borderRadius.small,
            "&:hover": { backgroundColor: color.blue.light },
          }}
          startIcon={<Tune />}
          onClick={() => {}}
          data-testid="filtersBtn"
        >
          Filters
        </Button>
      </StyledBadge>
    </Box>
  );
};

export default SearchbarExpandableButton;
