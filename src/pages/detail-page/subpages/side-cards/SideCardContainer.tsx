import { Box, Card, Divider, Stack, Typography } from "@mui/material";
import { FC, ReactNode } from "react";
import {
  borderRadius,
  fontWeight,
  padding,
} from "../../../../styles/constants";
interface SideCardContainerProps {
  children: ReactNode;
  title: string;
}
const SideCardContainer: FC<SideCardContainerProps> = ({ children, title }) => {
  return (
    <Card
      elevation={2}
      sx={{
        backgroundColor: "#fff",
        borderRadius: borderRadius.small,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography
          paddingY={padding.medium}
          fontSize="16px"
          fontWeight={fontWeight.bold}
        >
          {title}
        </Typography>
        <Divider sx={{ width: "100%" }} />
        {children}
      </Box>
    </Card>
  );
};

export default SideCardContainer;
