import { FC, useState } from "react";
import { Box, CardMedia, SxProps } from "@mui/material";
import defaultLogo from "@/assets/logos/default-logo.png";

interface OrganizationLogoProps {
  logo?: string;
  sx?: SxProps;
  defaultImageSrc?: string;
}
const OrganizationLogo: FC<OrganizationLogoProps> = ({
  logo,
  sx,
  defaultImageSrc = defaultLogo,
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
        loading="lazy"
        image={imageSrc ?? defaultImageSrc}
        onError={() => setImageSrc(defaultImageSrc)}
      />
    </Box>
  );
};

export default OrganizationLogo;
