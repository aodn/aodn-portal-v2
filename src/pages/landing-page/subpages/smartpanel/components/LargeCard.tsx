import { FC, useState } from "react";
import { CardData } from "../constants";
import CardContainer from "./CardContainer";
import { Box, Typography } from "@mui/material";
import {
  borderRadius,
  fontSize,
  fontWeight,
  padding,
} from "../../../../../styles/constants";

interface LargeCardProps {
  cardData: CardData;
  handleClickSmartCard: (value: string) => void;
}

const LargeCard: FC<LargeCardProps> = ({ cardData, handleClickSmartCard }) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const handleClick = (value: string) => {
    if (!cardData.disable) handleClickSmartCard(value);
  };

  return (
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
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => handleClick(cardData.title)}
      >
        <Typography
          variant="h6"
          fontWeight={isHovered ? fontWeight.bold : fontWeight.regular}
        >
          {cardData.title}
        </Typography>
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="space-evenly"
        alignItems="center"
        height="52%"
      >
        {cardData.additionalInfo &&
          cardData.additionalInfo.map((content) => (
            <Typography
              key={content}
              padding={0}
              fontSize={fontSize.label}
              color="#fff"
              onClick={() => handleClick(content)}
              sx={{ ":hover": { fontWeight: fontWeight.bold } }}
            >
              {content}
            </Typography>
          ))}
      </Box>
    </CardContainer>
  );
};

export default LargeCard;
