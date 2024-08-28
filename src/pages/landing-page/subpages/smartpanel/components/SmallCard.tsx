import { FC } from "react";
import { Box, Typography } from "@mui/material";
import { CardData } from "../constants";
import CardContainer from "./CardContainer";
import { fontSize, padding } from "../../../../../styles/constants";

interface SmallCardProps {
  cardData: CardData;
}
const SmallCard: FC<SmallCardProps> = ({ cardData }) => (
  <CardContainer>
    <Box height="50%" width="50%" padding={padding.extraSmall}>
      <img
        src={cardData.icon}
        alt={cardData.icon}
        style={{
          objectFit: "contain",
          width: "100%",
          height: "100%",
        }}
      />
    </Box>
    <Typography
      padding={padding.extraSmall}
      paddingTop={0}
      fontSize={fontSize.icon}
      color="#fff"
      sx={{
        overflow: "hidden",
      }}
      noWrap
    >
      {cardData.title}
    </Typography>
  </CardContainer>
);

export default SmallCard;
