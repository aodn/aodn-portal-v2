import { FC, useCallback, useMemo, useState } from "react";
import { Box, Link, Typography } from "@mui/material";
import {
  DataAccessSubGroup,
  getSubgroup,
  ILink as LinkType,
} from "../../../common/store/OGCCollectionDefinitions";
import { useDetailPageContext } from "../../../../pages/detail-page/context/detail-page-context";
import { openInNewTab } from "../../../../utils/LinkUtils";
import CopyButton, {
  COPY_BUTTON_HEIGHT,
} from "../../../common/buttons/CopyButton";
import rc8Theme from "../../../../styles/themeRC8";
import { AnalyticsEvent } from "../../../../analytics/analyticsEvents";
import { trackCustomEvent } from "../../../../analytics/customEventTracker";
import { dataAccessParams } from "../../../../analytics/dataAccessEvent";

interface LinkCardProps {
  icon?: boolean;
  link: LinkType;
  showTitleOnly?: boolean;
}

const LinkCard: FC<LinkCardProps> = ({
  icon = true,
  link,
  showTitleOnly = false,
}) => {
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

    // Track data access copy event
    trackCustomEvent(AnalyticsEvent.DATA_ACCESS_CLICK, dataAccessParams(link));
  }, [copyToClipboard, link]);

  return (
    <Box
      onMouseEnter={() => setHoverOnContainer(true)}
      onMouseLeave={() => setHoverOnContainer(false)}
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "transparent",
        gap: 1,
      }}
      data-testid={`link-card-${link.href}`}
    >
      <Box
        flex={1}
        display="flex"
        flexDirection="row"
        gap={2}
        aria-label="link and title"
      >
        {icon && link.getIcon && (
          <Box display="flex" alignItems="center">
            <Box
              component="img"
              width={
                getSubgroup(link) === DataAccessSubGroup.WFS
                  ? "27px" // Fixed WFS icon size as per design
                  : getSubgroup(link) === DataAccessSubGroup.WMS
                    ? "22px" // Fixed WMS icon size as per design
                    : "16px" // Fixed Link icon size as per design
              }
              height={
                getSubgroup(link) === DataAccessSubGroup.WFS
                  ? "30px"
                  : getSubgroup(link) === DataAccessSubGroup.WMS
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

              // Track data access event click
              trackCustomEvent(
                AnalyticsEvent.DATA_ACCESS_CLICK,
                dataAccessParams(link)
              );
            }}
          >
            <Typography
              sx={{
                ...rc8Theme.typography.title1Medium,
                color: rc8Theme.palette.primary.main,
                padding: 0,
                overflowWrap: "break-word",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                // WebkitLineClamp: "2",
                WebkitBoxOrient: "vertical",
              }}
            >
              {showTitleOnly ? (
                link.title.replace(/_/g, " ")
              ) : (
                <>
                  {link.title.replace(/_/g, " ")}
                  {link.description && link.description !== link.title && (
                    <>
                      <br />
                      {link.description.replace(/_/g, " ")}
                    </>
                  )}
                </>
              )}
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
