import { FC } from "react";
import { Stack, SxProps, Typography } from "@mui/material";
import rc8Theme from "../../../styles/themeRC8";

interface LabelChipProps {
  text: string[];
  color?: string;
  sx?: SxProps;
}

const LabelChip: FC<LabelChipProps> = ({
  text,
  color = rc8Theme.palette.primary4,
  sx,
}) => {
  if (!text || text.some((i) => i.trim() === "")) return null;

  return (
    <Stack direction="row" flexWrap="wrap" alignItems="center" spacing={1}>
      {text.map((item) => (
        <Typography
          key={item}
          sx={{
            ...rc8Theme.typography.body1Medium,
            backgroundColor: color,
            padding: "4px 10px",
            borderRadius: "6px",
            ml: 2,
            textAlign: "center",
            textTransform: "capitalize",
            ...sx,
          }}
          data-testid={`label-chip-${item}`}
        >
          {item}
        </Typography>
      ))}
    </Stack>
  );
};

export default LabelChip;
