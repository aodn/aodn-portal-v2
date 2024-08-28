import { Typography } from "@mui/material";
import { FC } from "react";
import { CardData } from "../constants";
import CardContainer from "./CardContainer";

interface MediumCardProps {
  cardData: CardData;
}

const MediumCard: FC<MediumCardProps> = ({ cardData }) => (
  <CardContainer
    containerStyle={{
      textAlign: "center",
      backgroundImage: `url(${cardData.image})`,
      backgroundPosition: "center",
      backgroundSize: "cover",
    }}
  >
    <Typography padding={0} variant="h6">
      {cardData.title}
    </Typography>
  </CardContainer>
);

export default MediumCard;
