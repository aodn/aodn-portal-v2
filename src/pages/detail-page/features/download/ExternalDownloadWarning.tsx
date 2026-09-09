import { FC } from "react";
import { Box, SxProps } from "@mui/material";
import InfoMessage from "./InfoMessage";
import { portalTheme } from "../../../../styles";

interface ExternalDownloadWarningProps {
  sx?: SxProps;
}

const ExternalDownloadWarning: FC<ExternalDownloadWarningProps> = ({ sx }) => (
  <Box data-testid="external-download-warning" sx={{ width: "100%", ...sx }}>
    <InfoMessage
      infoText="This dataset is downloaded from an external service that is not managed by AODN. Download speed, formats and availability depend on that external provider."
      iconColor={portalTheme.palette.warning.main}
      flushLeft
    />
  </Box>
);

export default ExternalDownloadWarning;
