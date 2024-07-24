import SideCardContainer from "./SideCardContainer";
import {
  Box,
  Grid,
  IconButton,
  Rating,
  Stack,
  Typography,
} from "@mui/material";
import { borderRadius, color, padding } from "../../../../styles/constants";
import twitterIcon from "../../../../assets/icons/twitter.png";
import facebookIcon from "../../../../assets/icons/facebook.png";
import instagramIcon from "../../../../assets/icons/instagram.png";
import emailIcon from "../../../../assets/icons/email.png";
import linkIcon from "../../../../assets/icons/link.png";
import commentsIcon from "../../../../assets/icons/comments.png";
import feedbackIcon from "../../../../assets/icons/feedback.png";

interface SocialIcon {
  name: string;
  icon?: JSX.Element;
  imgUrl?: string;
  url: string;
}

// TODO: add real social sites links
const socialIcons: SocialIcon[] = [
  { name: "twitter", imgUrl: twitterIcon, url: "#" },
  { name: "facebook", imgUrl: facebookIcon, url: "#" },
  { name: "instagram", imgUrl: instagramIcon, url: "#" },
  { name: "email", imgUrl: emailIcon, url: "#" },
  { name: "link", imgUrl: linkIcon, url: "#" },
];

const RatingsAndCommentsCard = () => {
  const renderSocialIcon = ({ name, icon, imgUrl, url }: SocialIcon) => (
    <Box>
      <IconButton>
        {imgUrl && (
          <img
            src={imgUrl}
            alt={name}
            style={{
              objectFit: "contain",
              width: "24px",
              height: "24px",
            }}
          />
        )}
      </IconButton>
    </Box>
  );
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
                Add your feedback
              </Typography>
            </Grid>
          </Grid>
          <Stack direction="column">
            <Typography>Share on social sites:</Typography>
            <Stack direction="row" spacing={1}>
              {socialIcons.map((icon, index) => (
                <Box
                  key={index}
                  sx={{
                    borderRadius: borderRadius.small,
                    backgroundColor: color.blue.extraLightSemiTransparent,
                    cursor: "pointer",
                  }}
                >
                  {renderSocialIcon(icon)}
                </Box>
              ))}
            </Stack>
          </Stack>
        </Stack>
      </Box>
    </SideCardContainer>
  );
};

export default RatingsAndCommentsCard;
