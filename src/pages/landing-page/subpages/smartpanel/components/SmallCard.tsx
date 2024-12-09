import { FC, useState } from "react";
import { Box, Typography } from "@mui/material";
import { CardData } from "../constants";
import CardContainer from "./CardContainer";
import { fontSize, fontWeight, padding } from "../../../../../styles/constants";

interface SmallCardProps {
  cardData: CardData;
  handleClickSmartCard: (value: string) => void;
}

const SmallCard: FC<SmallCardProps> = ({ cardData, handleClickSmartCard }) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const handleClick = (value: string) => {
    if (!cardData.disable) handleClickSmartCard(value);
  };

  return (
    <CardContainer onClick={() => handleClick(cardData.title)}>
      <Box
        height="50%"
        width="50%"
        padding={padding.extraSmall}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
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
      </Box>
      <Box
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Typography
          padding={padding.extraSmall}
          paddingTop={0}
          fontSize={fontSize.icon}
          color="#fff"
          fontWeight={isHovered ? fontWeight.bold : fontWeight.regular}
          sx={{
            overflow: "hidden",
          }}
          noWrap
        >
          {cardData.title}
        </Typography>
      </Box>
    </CardContainer>
  );
};

export default SmallCard;
