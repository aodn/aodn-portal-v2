import { FC, useState } from "react";
import { Box, Paper, Typography } from "@mui/material";
import {
  borderRadius,
  fontSize,
  fontWeight,
  padding,
  shadow,
} from "../../../../styles/constants";
import { SMART_CARD_HEIGHT, SMART_CARD_ICON_BOX_SIZE } from "./constants";

export interface SmartCardType {
  title: string;
  // Prop that determine if the click function on card is disabled or not
  disable: boolean;
  icon: string;
}

interface SmartCardProps {
  cardData: SmartCardType;
  handleClickSmartCard: (value: string) => void;
}

const SmartCard: FC<SmartCardProps> = ({ cardData, handleClickSmartCard }) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const handleClick = (value: string) => {
    if (!cardData.disable) handleClickSmartCard(value);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      borderRadius={borderRadius.small}
      height={SMART_CARD_HEIGHT}
      sx={{
        cursor: "pointer",
      }}
      onClick={() => handleClick(cardData.title)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Paper
        sx={{
          width: SMART_CARD_ICON_BOX_SIZE,
          height: SMART_CARD_ICON_BOX_SIZE,
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
      <Box width="100%" textAlign="center">
        <Typography
          fontSize={fontSize.label}
          fontWeight={isHovered ? fontWeight.bold : fontWeight.medium}
        >
          {cardData.title}
        </Typography>
      </Box>
    </Box>
  );
};

export default SmartCard;
