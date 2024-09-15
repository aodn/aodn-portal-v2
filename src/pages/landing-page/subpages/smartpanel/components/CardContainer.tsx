import { Card, SxProps } from "@mui/material";
import { FC, ReactNode } from "react";
import { border, color } from "../../../../../styles/constants";

interface CardContainerProps {
  children: ReactNode;
  containerStyle?: SxProps;
}

const CardContainer: FC<CardContainerProps> = ({
  children,
  containerStyle,
}) => (
  <Card
    elevation={0}
    sx={{
      height: "100%",
      width: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      overflow: "hidden",
      bgcolor: color.white.twoTenTransparent,
      border: `${border.xs} ${color.brightBlue.semiTransparentDark}`,
      color: "#fff",
      "&:hover": {
        cursor: "pointer",
      },
      ...containerStyle,
    }}
  >
    {children}
  </Card>
);

export default CardContainer;
