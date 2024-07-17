import { Dispatch, SetStateAction, useState } from "react";
import { ILink as LinkType } from "../common/store/searchReducer";
import { Box, Grid, Link, Typography } from "@mui/material";
import { color, fontColor, padding } from "../../styles/constants";
import CopyLinkButton from "../common/buttons/CopyLinkButton";
import linkIcon from "../../assets/icons/link.png";

const LinkCard = ({
  link,
  index,
  clickedCopyLinkButtonIndex,
  setClickedCopyLinkButtonIndex,
}: {
  link: LinkType;
  index: number;
  clickedCopyLinkButtonIndex: number[];
  setClickedCopyLinkButtonIndex: Dispatch<SetStateAction<number[]>>;
}) => {
  const [isShowCopyLinkButton, setShowCopyLinkButton] =
    useState<boolean>(false);
  const hasBeenCopied = clickedCopyLinkButtonIndex.includes(index);

  return (
    <Box
      onMouseEnter={() => setShowCopyLinkButton(true)}
      onMouseLeave={() => setShowCopyLinkButton(false)}
      sx={{
        backgroundColor: "transparent",
        padding: padding.large,
        "&:hover": {
          backgroundColor: color.blue.light,
        },
      }}
    >
      <Grid container>
        <Grid item xs={2}>
          {(isShowCopyLinkButton || hasBeenCopied) && (
            <CopyLinkButton
              index={index}
              setClickedCopyLinkButtonIndex={setClickedCopyLinkButtonIndex}
              copyUrl={link.href}
            />
          )}
        </Grid>
        <Grid item xs={10}>
          <Grid container spacing={1} aria-label="link and title">
            <Grid
              item
              xs={1}
              sx={{
                display: "flex",
                justifyContent: "end",
                alignItems: "start",
              }}
            >
              <Box
                sx={{
                  width: "30%",
                  paddingTop: padding.extraSmall,
                }}
              >
                <img
                  src={linkIcon}
                  alt=""
                  style={{
                    objectFit: "scale-down",
                    width: "100%",
                    height: "100%",
                  }}
                />
              </Box>
            </Grid>
            <Grid item xs={11}>
              <Box>
                <Typography
                  sx={{
                    padding: 0,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: "2",
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {link.title}
                </Typography>
                <Link href={link.href} underline="hover">
                  <Typography
                    color={fontColor.blue.medium}
                    sx={{
                      padding: 0,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: "2",
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {link.href}
                  </Typography>
                </Link>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LinkCard;
