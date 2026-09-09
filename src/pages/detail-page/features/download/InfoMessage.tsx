import { Box, SxProps, Typography } from "@mui/material";
import { InformationIcon } from "../../../../assets/icons/download/information";
import { portalTheme } from "../../../../styles";
import { FC, ReactNode } from "react";

interface InfoMessageProps {
  infoText: ReactNode;
  iconColor?: string;
  sx?: SxProps;
  flushLeft?: boolean;
}

const InfoMessage: FC<InfoMessageProps> = ({
  infoText,
  iconColor,
  sx,
  flushLeft = false,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-start",
        width: "100%",
        ...sx,
      }}
    >
      <Box
        sx={{
          minWidth: 22,
          flexShrink: 0,
          pl: flushLeft ? 0 : "8px",
          pr: "8px",
        }}
      >
        <InformationIcon
          color={iconColor ? iconColor : portalTheme.palette.primary1}
          height={30}
          width={30}
        />
      </Box>
      <Typography
        sx={{ ...portalTheme.typography.body2Regular }}
        color={portalTheme.palette.text2}
        pt="3px"
      >
        {infoText}
      </Typography>
    </Box>
  );
};

export default InfoMessage;
