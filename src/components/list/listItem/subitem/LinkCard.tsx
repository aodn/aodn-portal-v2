import { Dispatch, FC, SetStateAction, useState } from "react";
import { ILink as LinkType } from "../../../common/store/OGCCollectionDefinitions";
import { Box, Grid, Link, Typography } from "@mui/material";
import { color, fontColor, padding } from "../../../../styles/constants";
import CopyLinkButton from "../../../common/buttons/CopyLinkButton";
import { openInNewTab } from "../../../../utils/LinkUtils";

interface LinkCardProps {
  icon?: boolean;
  link: LinkType;
  index: number;
  clickedCopyLinkButtonIndex?: number[];
  setClickedCopyLinkButtonIndex?: Dispatch<SetStateAction<number[]>>;
}

const LinkCard: FC<LinkCardProps> = ({
  icon = true,
  link,
  index,
  clickedCopyLinkButtonIndex,
  setClickedCopyLinkButtonIndex,
}) => {
  const [isShowCopyLinkButton, setShowCopyLinkButton] =
    useState<boolean>(false);
  const hasBeenCopied = clickedCopyLinkButtonIndex?.includes(index);

  return (
    <Box
      onMouseEnter={() =>
        setClickedCopyLinkButtonIndex && setShowCopyLinkButton(true)
      }
      onMouseLeave={() =>
        setClickedCopyLinkButtonIndex && setShowCopyLinkButton(false)
      }
      sx={{
        backgroundColor: "transparent",
        padding: padding.small,
        "&:hover": {
          backgroundColor: color.blue.light,
        },
      }}
      data-testid="links-card"
    >
      <Grid container>
        {setClickedCopyLinkButtonIndex && (
          <Grid item xs={2}>
            <Box
              sx={{
                visibility:
                  isShowCopyLinkButton || hasBeenCopied ? "visible" : "hidden",
              }}
            >
              <CopyLinkButton
                index={index}
                setClickedCopyLinkButtonIndex={setClickedCopyLinkButtonIndex}
                copyUrl={link.href}
              />
            </Box>
          </Grid>
        )}
        <Grid item xs={setClickedCopyLinkButtonIndex ? 10 : 12}>
          <Grid container spacing={1} aria-label="link and title">
            {icon && (
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
                  component="img"
                  width="22px"
                  height="22px"
                  src={link.getIcon()}
                  alt={""}
                />
              </Grid>
            )}
            <Grid item>
              <Box>
                <Link
                  href={link.href}
                  underline="hover"
                  onClick={(e) => {
                    e.preventDefault();
                    openInNewTab(link.href);
                  }}
                >
                  <Typography
                    color={fontColor.blue.medium}
                    sx={{
                      padding: 0,
                      overflowWrap: "break-word",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: "2",
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {link.title.replace(/_/g, " ")}
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
