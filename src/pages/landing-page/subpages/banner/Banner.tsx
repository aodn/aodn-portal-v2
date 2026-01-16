import { Box, Stack, Typography } from "@mui/material";
import {
  fontColor,
  fontSize,
  fontWeight,
  gap,
  padding,
} from "../../../../styles/constants";
import useBreakpoint from "../../../../hooks/useBreakpoint";
import bannerImage1 from "@/assets/images/banner_image_1.png";
import bannerImage2 from "@/assets/images/banner_image_2.png";
import bannerImage3 from "@/assets/images/banner_image_3.png";
import rc8Theme from "../../../../styles/themeRC8";

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
            color: fontColor.gray.extraDark,
            textAlign: "left",
            padding: 0,
          }}
        >
          Open Access to
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
            color: fontColor.gray.extraDark,
            textAlign: "left",
            padding: 0,
            mt: -2,
          }}
        >
          Ocean Data
        </Typography>
        <Typography
          sx={{
            ...rc8Theme.typography.heading4,
            color: fontColor.gray.extraDark,
            whiteSpace: "wrap",
            p: 0,
            pr: padding.small,
          }}
        >
          &quot;The gateway to Australian marine and climate science data&rdquo;
        </Typography>
      </Stack>
    </Box>
  );
};

const renderBannerImages = (isMobile: boolean) => {
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
        <img
          src={bannerImage2}
          alt="banner-image-2"
          style={{
            objectFit: "cover",
            width: "100%",
            height: "100%",
          }}
        />
      </Box>
      <Box mt="-10%" pr="20%">
        <img
          src={bannerImage1}
          alt="banner-image-1"
          style={{
            objectFit: "cover",
            width: "100%",
            height: "100%",
          }}
        />
      </Box>
      <Box mt="-15%" pl="70%">
        <img
          src={bannerImage3}
          alt="banner-image-3"
          style={{
            objectFit: "cover",
            width: "100%",
            height: "100%",
          }}
        />
      </Box>
    </Box>
  );
};

const Banner = () => {
  const { isMobile } = useBreakpoint();

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
      {renderBannerImages(isMobile)}
    </Box>
  );
};

export default Banner;
