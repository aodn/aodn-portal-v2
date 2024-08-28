import { FC, useState } from "react";
import { OGCCollection } from "../common/store/OGCCollectionDefinitions";
import { Box, CardMedia, SxProps } from "@mui/material";
import imosLogo from "@/assets/logos/imos-logo-transparent.png";

interface OrganizationLogoProps {
  dataset: OGCCollection;
  sx?: SxProps;
  defaultImageSrc?: string;
}
const OrganizationLogo: FC<OrganizationLogoProps> = ({
  dataset,
  sx,
  defaultImageSrc = imosLogo,
}) => {
  const iconSrc = dataset.findIcon();
  const [imageSrc, setImageSrc] = useState<string | null | undefined>(iconSrc);

  return (
    <Box sx={{ ...sx }}>
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
