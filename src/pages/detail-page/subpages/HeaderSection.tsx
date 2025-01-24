import { Box, Card, Grid, IconButton, Paper, Typography } from "@mui/material";
import {
  borderRadius,
  fontColor,
  fontSize,
  fontWeight,
  padding,
} from "../../../styles/constants";
import { useCallback } from "react";
import ReplyIcon from "@mui/icons-material/Reply";

import { useDetailPageContext } from "../context/detail-page-context";
import imosLogoWithTitle from "@/assets/logos/imos_logo_with_title.png";
import OrganizationLogo from "../../../components/logo/OrganizationLogo";
import useRedirectSearch from "../../../hooks/useRedirectSearch";

const HeaderSection = () => {
  const redirectSearch = useRedirectSearch();
  const { collection } = useDetailPageContext();

  const title = collection?.title;

  const onGoBack = useCallback(() => {
    redirectSearch("HeaderSection", true, false);
  }, [redirectSearch]);

  // TODO: implement the goNext and goPrevious function
  // This will require the entire search results (their ids and indexes) based on search params
  // and current-collection-index

  return (
    <Box
      display="flex"
      flexDirection="row"
      flexWrap="nowrap"
      gap={1}
      height="100%"
    >
      <Paper
        aria-label="go-back button"
        elevation={3}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: borderRadius.small,
        }}
        onClick={onGoBack}
        data-testid="go-back-button"
      >
        <IconButton>
          <ReplyIcon />
        </IconButton>
      </Paper>
      <Card
        aria-label="header panel"
        elevation={3}
        sx={{
          padding: padding.medium,
          paddingX: padding.large,
          backgroundColor: "#fff",
          borderRadius: borderRadius.small,
          flex: 1,
        }}
      >
        <Grid container>
          <Grid
            item
            xs={10}
            sx={{
              display: "flex",
              justifyContent: "start",
              alignItems: "center",
            }}
          >
            <Typography
              aria-label="collection title"
              fontSize={fontSize.detailPageHeading}
              fontWeight={fontWeight.bold}
              color={fontColor.gray.dark}
              sx={{
                padding: 0,
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: "2",
                WebkitBoxOrient: "vertical",
              }}
            >
              {title}
            </Typography>
          </Grid>
          <Grid
            item
            xs={2}
            sx={{
              display: "flex",
              justifyContent: "right",
              alignItems: "center",
            }}
          >
            {collection && (
              <OrganizationLogo
                logo={collection.findIcon()}
                sx={{
                  width: "100%",
                  height: "60px",
                  paddingX: padding.extraSmall,
                }}
                defaultImageSrc={imosLogoWithTitle}
              />
            )}
          </Grid>
        </Grid>
      </Card>
    </Box>
  );
};

export default HeaderSection;
