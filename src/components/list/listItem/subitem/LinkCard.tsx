import { FC, useCallback, useMemo, useState } from "react";
import { Box, Link, Typography } from "@mui/material";
import { ILink as LinkType } from "../../../common/store/OGCCollectionDefinitions";
import { useDetailPageContext } from "../../../../pages/detail-page/context/detail-page-context";
import { color, fontColor, padding } from "../../../../styles/constants";
import { openInNewTab } from "../../../../utils/LinkUtils";
import CopyButton, {
  COPY_BUTTON_HEIGHT,
} from "../../../common/buttons/CopyButton";
import rc8Theme from "../../../../styles/themeRC8";

interface LinkCardProps {
  icon?: boolean;
  link: LinkType;
}

const LinkCard: FC<LinkCardProps> = ({ icon = true, link }) => {
  const [hoverOnContainer, setHoverOnContainer] = useState<boolean>(false);
  const { checkIfCopied, copyToClipboard } = useDetailPageContext();

  const isCopied = useMemo(
    () => checkIfCopied(link.href, link.title),
    [checkIfCopied, link.href, link.title]
  );

  const showCopyButton = useMemo(
    () => isCopied || hoverOnContainer,
    [hoverOnContainer, isCopied]
  );

  const handleCopyLink = useCallback(async () => {
    await copyToClipboard(link.href, link.title);
  }, [copyToClipboard, link.href, link.title]);

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
          <Box display="flex" alignItems="center">
            <Box
              component="img"
              width={
                link.rel === "wfs"
                  ? "27px"
                  : link.rel === "wms"
                    ? "22px"
                    : "16px"
              }
              height={
                link.rel === "wfs"
                  ? "30px"
                  : link.rel === "wms"
                    ? "28px"
                    : "16px"
              }
              src={link.getIcon()}
              alt={"link icon"}
            />
          </Box>
        )}
        <Box
          sx={{
            overflow: "hidden",
            minHeight: COPY_BUTTON_HEIGHT,
            alignContent: "center",
          }}
        >
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
        <CopyButton
          handleClick={handleCopyLink}
          hasBeenCopied={isCopied}
          copyText={link.href}
          copyButtonConfig={{
            textBeforeCopy: "Copy Link",
            textAfterCopy: "Link Copied",
          }}
        />
      )}
    </Box>
  );
};

export default LinkCard;
