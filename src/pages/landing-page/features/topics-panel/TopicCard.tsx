import { FC, useState } from "react";
import { Box, Paper, Typography } from "@mui/material";
import {
  TOPICS_CARD_HEIGHT,
  TOPICS_CARD_ICON_BOX_SIZE,
  TOPICS_CARD_DEFAULT_ICON_SIZE,
} from "./constants";
import { portalTheme } from "../../../../styles";

export interface TopicCardType {
  title: string;
  icon: string;
  handler?: () => void;
  iconSize?: number;
  iconOpacity?: number;
}

interface TopicCardProps {
  cardData: TopicCardType;
}

const { designTokens } = portalTheme;

const TopicCard: FC<TopicCardProps> = ({ cardData }) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const iconSize = cardData.iconSize ?? TOPICS_CARD_DEFAULT_ICON_SIZE;

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="flex-start"
      alignItems="center"
      height={TOPICS_CARD_HEIGHT}
      sx={{
        cursor: "pointer",
      }}
      onClick={cardData.handler}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Paper
        sx={{
          flex: "none",
          width: TOPICS_CARD_ICON_BOX_SIZE,
          height: TOPICS_CARD_ICON_BOX_SIZE,
          borderRadius: designTokens.borderRadius.card,
          boxShadow: designTokens.elevation.card,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            flex: "none",
            width: iconSize,
            height: iconSize,
            opacity: cardData.iconOpacity ?? 0.9,
            transform: isHovered ? "scale(1.05)" : "none",
            backgroundColor: portalTheme.palette.grey700,
            maskImage: `url("${cardData.icon}")`,
            maskRepeat: "no-repeat",
            maskPosition: "center",
            maskSize: "contain",
          }}
          role="presentation"
        />
      </Paper>
      <Box width={TOPICS_CARD_ICON_BOX_SIZE} textAlign="center">
        <Typography
          variant="body3Small"
          color={portalTheme.palette.text2}
          sx={{
            mt: "8px",
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: "2",
            WebkitBoxOrient: "vertical",
            wordBreak: "break-word",
            lineHeight: 1.2,
          }}
        >
          {cardData.title}
        </Typography>
      </Box>
    </Box>
  );
};

export default TopicCard;
