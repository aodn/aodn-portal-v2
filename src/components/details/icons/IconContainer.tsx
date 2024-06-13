import { Paper, SxProps, Theme, Typography } from "@mui/material";
import { border, color, fontSize } from "../../../styles/constants";
import { FC } from "react";

interface IconContainerProps {
  icon?: () => JSX.Element;
  label: string;
  imgUrl?: string;
  sxProps?: SxProps<Theme>;
}

const defaultSxProps = {
  width: "84px",
  height: "84px",
  backgroundColor: "transparent",
  border: `${border.sm} ${color.blue.darkSemiTransparent}`,
};

const IconContainer: FC<IconContainerProps> = ({
  icon = null,
  label,
  imgUrl = "",
  sxProps = {} as SxProps<Theme>,
}) => {
  return (
    <Paper
      elevation={0}
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        ...defaultSxProps,
        ...sxProps,
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
            height: "60%",
          }}
        />
      )}
      <Typography fontSize={fontSize.icon} sx={{ paddingTop: 0 }}>
        {label}
      </Typography>
    </Paper>
  );
};

export default IconContainer;
