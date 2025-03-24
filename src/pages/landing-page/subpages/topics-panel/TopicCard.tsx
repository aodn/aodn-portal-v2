import { FC, useState } from "react";
import { Box, Paper, Typography } from "@mui/material";
import {
  borderRadius,
  fontSize,
  fontWeight,
  padding,
  shadow,
} from "../../../../styles/constants";
import { TOPICS_CARD_HEIGHT, TOPICS_CARD_ICON_BOX_SIZE } from "./constants";

export interface TopicCardType {
  title: string;
  icon: string;
  // Prop that determine if the click function on card is disabled or not
  disable: boolean;
  // Prop that determine if the card should be hidden or not before "show more" is clicked
  hide: boolean;
}

interface TopicCardProps {
  cardData: TopicCardType;
  handleClickTopicCard: (value: string) => void;
  hide: boolean;
}

const TopicCard: FC<TopicCardProps> = ({
  cardData,
  handleClickTopicCard,
  hide,
}) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const handleClick = (value: string) => {
    if (!cardData.disable) handleClickTopicCard(value);
  };

  if (hide) return null;

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      borderRadius={borderRadius.small}
      height={TOPICS_CARD_HEIGHT}
      sx={{
        cursor: "pointer",
      }}
      onClick={() => handleClick(cardData.title)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Paper
        sx={{
          width: TOPICS_CARD_ICON_BOX_SIZE,
          height: TOPICS_CARD_ICON_BOX_SIZE,
          padding: padding.medium,
          borderRadius: borderRadius.small,
          boxShadow: shadow.bottom,
        }}
      >
        <img
          src={cardData.icon}
          alt={cardData.icon}
          style={{
            objectFit: "contain",
            width: "100%",
            height: "100%",
            scale: isHovered ? "105%" : "none",
          }}
        />
      </Paper>
      <Box
        width={TOPICS_CARD_ICON_BOX_SIZE}
        height={TOPICS_CARD_HEIGHT - TOPICS_CARD_ICON_BOX_SIZE}
        textAlign="center"
      >
        <Typography
          fontSize={fontSize.label}
          fontWeight={isHovered ? fontWeight.bold : fontWeight.medium}
          sx={{
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: "2",
            WebkitBoxOrient: "vertical",
            wordBreak: "break-word",
          }}
        >
          {cardData.title}
        </Typography>
      </Box>
    </Box>
  );
};

export default TopicCard;
