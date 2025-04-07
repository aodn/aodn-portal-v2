import { FC, useMemo, useState } from "react";
import { Box, Link, Typography } from "@mui/material";
import { ILink as LinkType } from "../../../common/store/OGCCollectionDefinitions";
import { useDetailPageContext } from "../../../../pages/detail-page/context/detail-page-context";
import { color, fontColor, padding } from "../../../../styles/constants";
import CopyLinkButton from "../../../common/buttons/CopyLinkButton";
import { openInNewTab } from "../../../../utils/LinkUtils";

const COPY_LINK_BUTTON_WIDTH = 140;
const COPY_LINK_BUTTON_HEIGHT = 32;

interface LinkCardProps {
  icon?: boolean;
  link: LinkType;
}

const LinkCard: FC<LinkCardProps> = ({ icon = true, link }) => {
  const [hoverOnContainer, setHoverOnContainer] = useState<boolean>(false);
  const { checkIfCopied, copyToClipboard } = useDetailPageContext();

  const isCopied = useMemo(
    () => checkIfCopied(link.href),
    [checkIfCopied, link.href]
  );
  const showCopyButton = useMemo(
    () => isCopied || hoverOnContainer,
    [hoverOnContainer, isCopied]
  );
  return (
    <Box
      onMouseEnter={() => setHoverOnContainer(true)}
      onMouseLeave={() => setHoverOnContainer(false)}
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "transparent",
        padding: padding.small,
        "&:hover": {
          backgroundColor: color.blue.light,
        },
        gap: 1,
      }}
      data-testid={`link-card-${link.href}`}
    >
      <Box
        flex={1}
        display="flex"
        flexDirection="row"
        gap={1}
        aria-label="link and title"
      >
        {icon && link.getIcon && (
          <Box
            component="img"
            width="16px"
            height="16px"
            src={link.getIcon()}
            alt={"link icon"}
          />
        )}
        <Box sx={{ overflow: "hidden", minHeight: COPY_LINK_BUTTON_HEIGHT }}>
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
      </Box>

      {showCopyButton && (
        <CopyLinkButton
          handleClick={copyToClipboard}
          hasBeenCopied={isCopied}
          copyUrl={link.href}
          sx={{
            width: COPY_LINK_BUTTON_WIDTH,
            height: COPY_LINK_BUTTON_HEIGHT,
          }}
        />
      )}
    </Box>
  );
};

export default LinkCard;
