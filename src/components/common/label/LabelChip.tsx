import { FC, ReactNode } from "react";
import { Stack, SxProps, Typography } from "@mui/material";
import rc8Theme from "../../../styles/themeRC8";
import { removeDuplicatesAndEmpty } from "../../../utils/Helpers";
import { capitalizeFirstLetter } from "../../../utils/StringUtils";

interface LabelChipProps {
  text: string[];
  color?: string;
  sx?: SxProps;
  // Rendered inside each chip, ahead of its text. Chips without one are laid out exactly as before.
  startIcon?: ReactNode;
}

const LabelChip: FC<LabelChipProps> = ({
  text,
  color = "#fff",
  sx,
  startIcon,
}) => {
  // Remove duplicates and empty strings, then capitalize the first letter of each item
  const validItems = removeDuplicatesAndEmpty(text).map((item) =>
    capitalizeFirstLetter(item, false)
  );

  if (validItems.length === 0) return null;

  return (
    <Stack direction="row" flexWrap="wrap" alignItems="center" gap={1}>
      {validItems.map((item) => (
        <Typography
          key={item}
          sx={{
            ...rc8Theme.typography.body1Medium,
            backgroundColor: color,
            padding: "4px 10px",
            borderRadius: "6px",
            textAlign: "center",
            textWrap: "nowrap",
            // Only when there is an icon, so existing chips keep their block layout
            ...(startIcon && {
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
            }),
            ...sx,
          }}
          data-testid={`label-chip-${item}`}
        >
          {startIcon}
          {item}
        </Typography>
      ))}
    </Stack>
  );
};

export default LabelChip;
