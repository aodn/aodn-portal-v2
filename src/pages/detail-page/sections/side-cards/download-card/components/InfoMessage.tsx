import { Box, SxProps, Typography } from "@mui/material";
import { InformationIcon } from "../../../../../../assets/icons/download/information";
import { portalTheme } from "../../../../../../styles";
import { FC } from "react";

interface InfoMessageProps {
  infoText: string;
  iconColor?: string;
  sx?: SxProps;
}

const InfoMessage: FC<InfoMessageProps> = ({ infoText, iconColor, sx }) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-start",
        width: "100%",
        ...sx,
      }}
    >
      <Box sx={{ minWidth: 22, flexShrink: 0, px: "8px" }}>
        <InformationIcon
          color={iconColor ? iconColor : portalTheme.palette.primary1}
          height={24}
          width={24}
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
