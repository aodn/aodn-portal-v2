import { ComponentType, createElement, FC, SVGProps, useState } from "react";
import { Box, Paper, Typography } from "@mui/material";
import { borderRadius, padding, shadow } from "../../../../styles/constants";
import { TOPICS_CARD_HEIGHT, TOPICS_CARD_ICON_BOX_SIZE } from "./constants";
import { portalTheme } from "../../../../styles";

export interface TopicCardType {
  title: string;
  icon: string | ComponentType<SVGProps<SVGSVGElement>>;
  searchKey?: string;
}

interface TopicCardProps {
  cardData: TopicCardType;
  handleClickTopicCard: (value: string) => void;
}

const TopicCard: FC<TopicCardProps> = ({ cardData, handleClickTopicCard }) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const handleClick = (value: string) => {
    handleClickTopicCard(value);
  };

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
      onClick={() => handleClick(cardData.searchKey || cardData.title)}
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
        {typeof cardData.icon === "string" ? (
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
        ) : (
          createElement(cardData.icon, {
            width: "100%",
            height: "100%",
            style: {
              transform: isHovered ? "scale(1.05)" : "none",
            },
          })
        )}
      </Paper>
      <Box
        width={TOPICS_CARD_ICON_BOX_SIZE}
        height={TOPICS_CARD_HEIGHT - TOPICS_CARD_ICON_BOX_SIZE}
        textAlign="center"
      >
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
