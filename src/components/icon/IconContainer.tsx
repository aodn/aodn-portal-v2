import { FC } from "react";
import { Paper, SxProps, Theme, Typography } from "@mui/material";
import { border, color, fontSize } from "../../styles/constants";

interface IconContainerProps {
  icon?: () => JSX.Element;
  label?: string;
  imgUrl?: string;
  sx?: SxProps<Theme>;
}

const defaultSxProps = {
  width: "84px",
  height: "84px",
  backgroundColor: "transparent",
  border: `${border.sm} ${color.blue.darkSemiTransparent}`,
};

const IconContainer: FC<IconContainerProps> = ({ icon, label, imgUrl, sx }) => {
  return (
    <Paper
      elevation={0}
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        ...defaultSxProps,
        ...sx,
      }}
    >
      {icon && icon()}
      {imgUrl && (
        <img
          src={imgUrl}
          alt=""
          style={{
            objectFit: "scale-down",
            width: "60%",
          }}
        />
      )}
      {label && (
        <Typography fontSize={fontSize.icon} sx={{ paddingTop: 0 }}>
          {label}
        </Typography>
      )}
    </Paper>
  );
};

export default IconContainer;
