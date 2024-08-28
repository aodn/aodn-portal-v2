import { FC } from "react";
import { CardData } from "../constants";
import CardContainer from "./CardContainer";
import { Box, Typography } from "@mui/material";
import {
  borderRadius,
  fontSize,
  padding,
} from "../../../../../styles/constants";

interface LargeCardProps {
  cardData: CardData;
}

const LargeCard: FC<LargeCardProps> = ({ cardData }) => (
  <CardContainer>
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="100%"
      height="48%"
      borderRadius={`${borderRadius.small}  ${borderRadius.small} 0 0`}
      textAlign="center"
      sx={{
        backgroundImage: `url(${cardData.image})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
    >
      <Typography variant="h6">{cardData.title}</Typography>
    </Box>
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-evenly"
      alignItems="start"
      height="52%"
      paddingX={padding.small}
    >
      {cardData.additionalInfo &&
        cardData.additionalInfo.map((content) => (
          <Typography
            key={content}
            padding={0}
            fontSize={fontSize.label}
            color="#fff"
          >
            {content}
          </Typography>
        ))}
    </Box>
  </CardContainer>
);

export default LargeCard;
