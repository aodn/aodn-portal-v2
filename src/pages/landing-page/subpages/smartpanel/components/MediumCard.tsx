import { Box, Typography } from "@mui/material";
import { FC, useState } from "react";
import { CardData } from "../constants";
import CardContainer from "./CardContainer";
import { fontWeight } from "../../../../../styles/constants";

interface MediumCardProps {
  cardData: CardData;
  handleClickSmartCard: (value: string) => void;
}

const MediumCard: FC<MediumCardProps> = ({
  cardData,
  handleClickSmartCard,
}) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const handleClick = (value: string) => {
    if (!cardData.disable) handleClickSmartCard(value);
  };

  return (
    <CardContainer
      containerStyle={{
        textAlign: "center",
        backgroundImage: `url(${cardData.image})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
      onClick={() => handleClick(cardData.title)}
    >
      <Box
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Typography
          padding={0}
          variant="h6"
          fontWeight={isHovered ? fontWeight.bold : fontWeight.regular}
        >
          {cardData.title}
        </Typography>
      </Box>
    </CardContainer>
  );
};

export default MediumCard;
