import { Box, Paper, Stack, Typography } from "@mui/material";
import SideCardContainer from "./SideCardContainer";
import { borderRadius, color, padding } from "../../../../styles/constants";

// TODO: replace with real categories from real data
const themes = [
  "Ocean",
  "IMOS content",
  "Moorings",
  "Temperature",
  "Time series",
];

const ThemesCard = () => {
  const renderCategoryCard = (content: string) => (
    <Paper
      elevation={0}
      sx={{
        border: "none",
        borderRadius: borderRadius.small,
        backgroundColor: color.blue.extraLightSemiTransparent,
        padding: padding.extraSmall,
      }}
    >
      <Typography padding={0}>{content}</Typography>
    </Paper>
  );
  return (
    <SideCardContainer title="Themes">
      <Stack
        spacing={1}
        direction="row"
        useFlexGap
        flexWrap="wrap"
        padding={padding.medium}
      >
        {themes.map((content, index) => (
          <Box key={index}>{renderCategoryCard(content)}</Box>
        ))}
      </Stack>
    </SideCardContainer>
  );
};

export default ThemesCard;
