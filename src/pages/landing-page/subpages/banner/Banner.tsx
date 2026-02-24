import { useState } from "react";
import { Box, Dialog, Stack, Tooltip, Typography } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import {
  fontSize,
  fontWeight,
  gap,
  padding,
} from "../../../../styles/constants";
import useBreakpoint from "../../../../hooks/useBreakpoint";
import bannerImage1 from "@/assets/images/banner_image_1.png";
import bannerImage2 from "@/assets/images/banner_image_2.png";
import bannerImage3 from "@/assets/images/banner_image_3.png";
import { portalTheme } from "../../../../styles";

const renderBannerText = () => {
  return (
    <Box flex={1} mt="-10%">
      <Stack
        direction="column"
        justifyContent="center"
        alignItems="start"
        data-testid="hero-text"
      >
        <Typography
          sx={{
            fontSize: {
              xs: fontSize.bannerTitleSmall,
              sm: fontSize.bannerTitleMedium,
              xl: fontSize.bannerTitleLarge,
            },
            letterSpacing: gap.xs,
            fontWeight: fontWeight.light,
            color: portalTheme.palette.text2,
            textAlign: "left",
            padding: 0,
          }}
        >
          IMOS Australian
        </Typography>
        <Typography
          sx={{
            fontSize: {
              xs: fontSize.bannerTitleMedium,
              sm: fontSize.bannerTitleLarge,
              xl: fontSize.bannerTitleExtraLarge,
            },
            letterSpacing: gap.xs,
            fontWeight: fontWeight.bold,
            color: portalTheme.palette.text2,
            textAlign: "left",
            padding: 0,
            mt: -2,
          }}
        >
          Ocean Data Portal
        </Typography>
        <Typography
          sx={{
            ...portalTheme.typography.heading4,
            color: portalTheme.palette.text2,
            whiteSpace: "wrap",
            p: 0,
            pr: padding.small,
          }}
        >
          &quot;Open access to Australian marine and climate science
          data.&rdquo;
        </Typography>
      </Stack>
    </Box>
  );
};

const renderBannerImages = (
  isMobile: boolean,
  onImageClick: (src: string) => void
) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: isMobile ? "100%" : "50%",
      }}
    >
      <Box pl="40%" pr="10%">
        <Box sx={{ position: "relative", display: "inline-block" }}>
          <button
            type="button"
            onClick={() => onImageClick(bannerImage2)}
            style={{
              padding: 0,
              border: "none",
              background: "none",
              cursor: "pointer",
              display: "block",
              width: "100%",
            }}
          >
            <img
              src={bannerImage2}
              alt="banner-image-2"
              style={{
                objectFit: "cover",
                width: "100%",
                height: "100%",
                display: "block",
              }}
            />
          </button>
          <Tooltip title="Nick Thake" placement="right">
            <InfoIcon
              sx={{
                position: "absolute",
                top: 8,
                left: 8,
                zIndex: 1,
                fontSize: 20,
                color: "rgba(255, 255, 255, 0.7)",
                cursor: "pointer",
              }}
            />
          </Tooltip>
        </Box>
      </Box>
      <Box
        mt="-10%"
        pr="20%"
        sx={{ zIndex: 2, position: "relative", pointerEvents: "none" }}
      >
        <button
          type="button"
          onClick={() => onImageClick(bannerImage1)}
          style={{
            padding: 0,
            border: "none",
            background: "none",
            cursor: "pointer",
            display: "block",
            width: "100%",
            pointerEvents: "auto",
          }}
        >
          <img
            src={bannerImage1}
            alt="banner-image-1"
            style={{
              objectFit: "cover",
              width: "100%",
              height: "100%",
              display: "block",
            }}
          />
        </button>
      </Box>
      <Box mt="-15%" pl="70%">
        <button
          type="button"
          onClick={() => onImageClick(bannerImage3)}
          style={{
            padding: 0,
            border: "none",
            background: "none",
            cursor: "pointer",
            display: "block",
            width: "100%",
          }}
        >
          <img
            src={bannerImage3}
            alt="banner-image-3"
            style={{
              objectFit: "cover",
              width: "100%",
              height: "100%",
              display: "block",
            }}
          />
        </button>
      </Box>
    </Box>
  );
};

const Banner = () => {
  const { isMobile } = useBreakpoint();
  const [openImage, setOpenImage] = useState<string | null>(null);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        paddingY: { xs: padding.medium, sm: padding.large },
      }}
      gap={2}
    >
      {renderBannerText()}
      {renderBannerImages(isMobile, setOpenImage)}
      <Dialog
        open={!!openImage}
        onClose={() => setOpenImage(null)}
        maxWidth={false}
        PaperProps={{
          sx: {
            backgroundColor: "transparent",
            boxShadow: "none",
          },
        }}
      >
        {openImage && (
          <button
            type="button"
            onClick={() => setOpenImage(null)}
            style={{
              padding: 0,
              border: "none",
              background: "none",
              cursor: "pointer",
            }}
          >
            <img
              src={openImage}
              alt="Full size"
              style={{
                maxWidth: "90vw",
                maxHeight: "90vh",
                objectFit: "contain",
              }}
            />
          </button>
        )}
      </Dialog>
    </Box>
  );
};

export default Banner;
