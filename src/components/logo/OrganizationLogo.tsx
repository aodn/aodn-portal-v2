import { FC, useState } from "react";
import { Box, CardMedia, SxProps } from "@mui/material";
import imosLogo from "@/assets/logos/imos-logo-transparent.png";

interface OrganizationLogoProps {
  logo?: string;
  sx?: SxProps;
  defaultImageSrc?: string;
}
const OrganizationLogo: FC<OrganizationLogoProps> = ({
  logo,
  sx,
  defaultImageSrc = imosLogo,
}) => {
  const [imageSrc, setImageSrc] = useState<string | null | undefined>(logo);

  return (
    <Box sx={{ width: "100%", height: "100%", ...sx }}>
      <CardMedia
        sx={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
        }}
        component="img"
        image={imageSrc ?? defaultImageSrc}
        onError={() => setImageSrc(defaultImageSrc)}
      />
    </Box>
  );
};

export default OrganizationLogo;