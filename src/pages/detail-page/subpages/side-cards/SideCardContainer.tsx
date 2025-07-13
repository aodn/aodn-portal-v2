import { FC, ReactNode } from "react";
import { Card, CardHeader, Divider, IconButton } from "@mui/material";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import {
  borderRadius,
  fontWeight,
  fontSize,
} from "../../../../styles/constants";

interface SideCardContainerProps {
  title: string;
  onClick?: () => void;
  children: ReactNode;
}
const SideCardContainer: FC<SideCardContainerProps> = ({
  children,
  title,
  onClick,
}) => {
  return (
    <Card
      elevation={2}
      sx={{
        backgroundColor: "#fff",
        borderRadius: borderRadius.small,
        width: { xs: "100%", sm: "48.5%", md: "100%" },
      }}
    >
      <CardHeader
        title={title}
        action={
          onClick && (
            <IconButton aria-label="settings" size="small" onClick={onClick}>
              <ArrowOutwardIcon fontSize="small" />
            </IconButton>
          )
        }
        sx={{
          "& .MuiCardHeader-title": {
            fontSize: fontSize.slideCardTitle,
            fontWeight: fontWeight.bold,
            margin: "0", // No margins
            padding: "0", // No padding
            textAlign: "center", // Center the title text
          },
        }}
      />
      <Divider sx={{ width: "100%" }} component={"div"} />
      {children}
    </Card>
  );
};

export default SideCardContainer;
