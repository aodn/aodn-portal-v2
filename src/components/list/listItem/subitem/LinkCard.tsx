import { createElement, FC, useMemo, useState } from "react";
import { Box, Link, Typography } from "@mui/material";
import { useClipboardContext } from "../../../../context/clipboard/ClipboardContext";
import useBreakpoint from "../../../../hooks/useBreakpoint";
import { ILink } from "../../../common/store/OGCCollectionDefinitions";
import { openInNewTab } from "../../../../utils/LinkUtils";
import { portalTheme } from "../../../../styles";
import { AnalyticsEvent } from "../../../../analytics/analyticsEvents";
import { trackCustomEvent } from "../../../../analytics/customEventTracker";
import { dataAccessParams } from "../../../../analytics/dataAccessEvent";
import CopyButton from "../../../common/buttons/CopyButton";

interface LinkCardProps {
  icon?: boolean;
  link: ILink;
  isCopyable?: boolean;
  isSideCard?: boolean;
  showCopyOnHover?: boolean;
}

const LinkCard: FC<LinkCardProps> = ({
  icon = true,
  link,
  isCopyable = true,
  isSideCard = false,
  showCopyOnHover = true,
}) => {
  const { checkIsCopied } = useClipboardContext();
  const [hoverOnContent, setHoverOnContent] = useState<boolean>(false);
  const { isUnderLaptop } = useBreakpoint();

  const isVisibleCopyButton = useMemo(() => {
    if (isUnderLaptop) {
      return true;
    }

    const isCopied = checkIsCopied(link.href, link.title);
    if (showCopyOnHover) {
      return isCopied || hoverOnContent;
    } else {
      return true;
    }
  }, [
    checkIsCopied,
    hoverOnContent,
    isUnderLaptop,
    link.href,
    link.title,
    showCopyOnHover,
  ]);

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
            <Box width={27}>
              {typeof link.getIcon() === "string" ? (
                <img src={link.getIcon() as string} alt={"link icon"} />
              ) : (
                createElement(link.getIcon(), { height: "100%", width: "100%" })
              )}
            </Box>
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
              component="span"
              sx={{
                ...(isSideCard
                  ? portalTheme.typography.body2Regular
                  : portalTheme.typography.title1Medium),
                color: portalTheme.palette.primary1,
                padding: 0,
                overflowWrap: "anywhere",
                display: "inline",
              }}
            >
              {link.title.replace(/_/g, " ")}
            </Typography>
          </Link>
          {isCopyable && (
            <CopyButton
              visible={isVisibleCopyButton}
              copyText={link.href}
              referenceId={link.title}
              copyButtonConfig={{
                onCopy: () => {
                  // Track data access copy event
                  trackCustomEvent(
                    AnalyticsEvent.DATA_ACCESS_CLICK,
                    dataAccessParams(link)
                  );
                },
                tooltipText: ["Copy link", "Link copied"],
              }}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default LinkCard;
