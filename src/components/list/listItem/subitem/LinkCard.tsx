import { FC, useMemo, useState } from "react";
import { Box, Grid, Link, Typography } from "@mui/material";
import { ILink as LinkType } from "../../../common/store/OGCCollectionDefinitions";
import { useDetailPageContext } from "../../../../pages/detail-page/context/detail-page-context";
import { color, fontColor, padding } from "../../../../styles/constants";
import CopyLinkButton from "../../../common/buttons/CopyLinkButton";
import { openInNewTab } from "../../../../utils/LinkUtils";

interface LinkCardProps {
  icon?: boolean;
  link: LinkType;
}

const LinkCard: FC<LinkCardProps> = ({ icon = true, link }) => {
  const [hoverOnContainer, setHoverOnContainer] = useState<boolean>(false);
  const { clipboardText, handleCopyToClipboard } = useDetailPageContext();
  const hasBeenCopied = useMemo(
    () => link.href === clipboardText,
    [clipboardText, link.href]
  );
  const showCopyButton = useMemo(
    () => hasBeenCopied || hoverOnContainer,
    [hasBeenCopied, hoverOnContainer]
  );

  return (
    <Box
      onMouseEnter={() => setHoverOnContainer(true)}
      onMouseLeave={() => setHoverOnContainer(false)}
      sx={{
        backgroundColor: "transparent",
        padding: padding.small,
        "&:hover": {
          backgroundColor: color.blue.light,
        },
      }}
      data-testid={`link-card-${link.href}`}
    >
      <Grid container>
        <Grid item xs={showCopyButton ? 10 : 12}>
          <Grid container spacing={1} aria-label="link and title">
            {icon && link.getIcon && (
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
            <Grid item xs={11}>
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
        <Grid item xs={showCopyButton ? 2 : 0}>
          <Box
            sx={{
              visibility: showCopyButton ? "visible" : "hidden",
            }}
            data-testid={`copylinkbutton-container-${link.href}`}
          >
            <CopyLinkButton
              handleClick={handleCopyToClipboard}
              hasBeenCopied={hasBeenCopied}
              copyUrl={link.href}
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LinkCard;
