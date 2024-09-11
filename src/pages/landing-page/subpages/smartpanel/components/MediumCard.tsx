import { Box, Typography } from "@mui/material";
import { FC } from "react";
import { CardData } from "../constants";
import CardContainer from "./CardContainer";

interface MediumCardProps {
  cardData: CardData;
  handleClickSmartCard: (value: string) => void;
}

const MediumCard: FC<MediumCardProps> = ({
  cardData,
  handleClickSmartCard,
}) => {
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
    >
      <Box onClick={() => handleClick(cardData.title)}>
        <Typography padding={0} variant="h6">
          {cardData.title}
        </Typography>
      </Box>
    </CardContainer>
  );
};

export default MediumCard;
