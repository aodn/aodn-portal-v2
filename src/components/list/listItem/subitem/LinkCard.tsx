import { FC, useCallback, useMemo, useState } from "react";
import { Box, Link, Typography } from "@mui/material";
import {
  DataAccessSubGroup,
  getSubgroup,
  ILink as LinkType,
} from "../../../common/store/OGCCollectionDefinitions";
import useClipboard from "../../../../hooks/useClipboard";
import { openInNewTab } from "../../../../utils/LinkUtils";
import rc8Theme from "../../../../styles/themeRC8";
import { AnalyticsEvent } from "../../../../analytics/analyticsEvents";
import { trackCustomEvent } from "../../../../analytics/customEventTracker";
import { dataAccessParams } from "../../../../analytics/dataAccessEvent";
import CopyButton, {
  CopyButtonConfig,
} from "../../../common/buttons/CopyButton";
import useBreakpoint from "../../../../hooks/useBreakpoint";

interface LinkCardProps extends CopyButtonConfig {
  icon?: boolean;
  link: LinkType;
  isCopyable?: boolean;
  showCopyOnHover?: boolean;
}

const LinkCard: FC<LinkCardProps> = ({
  icon = true,
  link,
  isCopyable = true,
  showCopyOnHover = true,
  copyButtonConfig,
}) => {
  const [hoverOnContent, setHoverOnContent] = useState<boolean>(false);
  const { checkIsCopied, copyToClipboard } = useClipboard();
  const { isUnderLaptop } = useBreakpoint();

  const isCopied = useMemo(() => {
    if (copyButtonConfig?.checkIsCopied) {
      return copyButtonConfig.checkIsCopied(link.href, link.title);
    } else {
      return checkIsCopied(link.href, link.title);
    }
  }, [copyButtonConfig, checkIsCopied, link.href, link.title]);

  const isVisibleCopyButton = useMemo(() => {
    if (isUnderLaptop) {
      return true;
    }
    if (showCopyOnHover) {
      return isCopied || hoverOnContent;
    } else {
      return true;
    }
  }, [hoverOnContent, isCopied, isUnderLaptop, showCopyOnHover]);

  const handleCopyLink = useCallback(async () => {
    if (copyButtonConfig?.copyToClipboard) {
      await copyButtonConfig.copyToClipboard(link.href, link.title);
    } else {
      await copyToClipboard(link.href, link.title);
    }

    // Track data access copy event
    trackCustomEvent(AnalyticsEvent.DATA_ACCESS_CLICK, dataAccessParams(link));
  }, [copyButtonConfig, copyToClipboard, link]);

  return (
    <Box
      onMouseEnter={() => setHoverOnContent(true)}
      onMouseLeave={() => setHoverOnContent(false)}
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
            minHeight: "40px",
            alignContent: "center",
          }}
        >
          <Link
            href={link.href}
            underline="hover"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
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
                // lineHeight: "40px",
                padding: 0,
                overflowWrap: "break-word",
                // textOverflow: "ellipsis",
                display: "inline",
                // WebkitLineClamp: "2",
                // WebkitBoxOrient: "vertical",
              }}
            >
              {link.title.replace(/_/g, " ")}
            </Typography>
          </Link>
          {isCopyable && (
            <CopyButton
              handleCopy={handleCopyLink}
              isCopied={isCopied}
              visible={isVisibleCopyButton}
              copyText={link.href}
              tooltipText={["Copy link", "Link copied"]}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default LinkCard;
