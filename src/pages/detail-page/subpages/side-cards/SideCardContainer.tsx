import { Card, Divider, Typography } from "@mui/material";
import { FC, ReactNode } from "react";
import {
  borderRadius,
  fontWeight,
  padding,
  shadow,
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
        width: { xs: "100%", sm: "48.5%", md: "100%" },
      }}
    >
      <Card
        sx={{
          display: "flex",
          flexDirection: "column",
          borderRadius: 0,
          boxShadow: shadow.bottom,
        }}
      >
        <Typography
          paddingY={padding.medium}
          fontSize="16px"
          fontWeight={fontWeight.bold}
          align="center"
        >
          {title}
        </Typography>
        <Divider sx={{ width: "100%" }} />
      </Card>
      {children}
    </Card>
  );
};

export default SideCardContainer;
