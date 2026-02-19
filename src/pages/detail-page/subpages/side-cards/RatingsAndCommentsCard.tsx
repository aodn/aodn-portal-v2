import SideCardContainer from "./SideCardContainer";
import { Box, Grid, Rating, Stack, Typography } from "@mui/material";
import { borderRadius, color, padding } from "../../../../styles/constants";
import commentsIcon from "../../../../assets/icons/comments.png";
import feedbackIcon from "../../../../assets/icons/feedback.png";

const RatingsAndCommentsCard = () => {
  return (
    <SideCardContainer title="Ratings and Comments">
      <Box sx={{ width: "100%" }}>
        <Stack direction="column" padding={padding.medium} spacing={2}>
          <Stack
            direction="row"
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Rating
              defaultValue={4}
              precision={0.5}
              readOnly
              sx={{
                paddingRight: padding.medium,
                "& .MuiRating-iconFilled": {
                  color: color.gray.light,
                },
              }}
            />
            <Typography padding={0}>4.0</Typography>
          </Stack>
          <Grid
            container
            sx={{
              border: "none",
              borderRadius: borderRadius.small,
              backgroundColor: color.blue.extraLightSemiTransparent,
              padding: padding.small,
              cursor: "pointer",
            }}
          >
            <Grid
              item
              xs={3}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignContent: "center",
              }}
            >
              <img
                src={commentsIcon}
                alt="all_comments"
                style={{
                  objectFit: "contain",
                  width: "24px",
                  height: "24px",
                }}
              />
            </Grid>
            <Grid item xs={9}>
              <Typography padding={0} textAlign="center">
                All Comments
              </Typography>
            </Grid>
          </Grid>
          <Grid
            container
            sx={{
              border: "none",
              borderRadius: borderRadius.small,
              backgroundColor: color.blue.extraLightSemiTransparent,
              padding: padding.small,
              cursor: "pointer",
            }}
          >
            <Grid
              item
              xs={3}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignContent: "center",
              }}
            >
              <img
                src={feedbackIcon}
                alt="add_your_feedback"
                style={{
                  objectFit: "contain",
                  width: "20px",
                  height: "20px",
                }}
              />
            </Grid>
            <Grid item xs={9}>
              <Typography padding={0} textAlign="center">
                Add Your Feedback
              </Typography>
            </Grid>
          </Grid>
        </Stack>
      </Box>
    </SideCardContainer>
  );
};

export default RatingsAndCommentsCard;
