import { FC, ReactNode } from "react";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import Box from "@mui/material/Box";
import { Card, CardContent, Typography } from "@mui/material";
import {
  border,
  borderRadius,
  color,
  fontColor,
  fontSize,
  padding,
} from "../../styles/constants";
import {
  DEFAULT_CARD_SIZE,
  DEFAULT_GAP,
  ITEM_DATA,
  ItemType,
  SMART_PANEL_HEIGHT,
  SMART_PANEL_WIDTH,
} from "./constants";
import { getItemCols, getItemRows, getSmartPanelCols } from "./utils";

// TODO: use different card props for different card size
export interface CardProps {
  title: string;
  icon?: string;
  image?: string;
  additionalInfo?: string[];
}

const CardContainer = ({ children }: { children: ReactNode }) => (
  <Card
    elevation={0}
    sx={{
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      bgcolor: color.white.oneTenTransparent,
      border: `${border.xs} ${color.brightBlue.semiTransparentDark}`,
      color: "#fff",
    }}
  >
    {children}
  </Card>
);

const SmallCard: FC<CardProps> = ({ title, icon }) => (
  <CardContainer>
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      width="100%"
      height="100%"
    >
      {icon && (
        <Box height="50%" width="50%">
          <img
            src={icon}
            alt={icon}
            style={{
              objectFit: "contain",
              width: "100%",
              height: "100%",
            }}
          />
        </Box>
      )}

      <Typography
        padding={padding.extraSmall}
        fontSize={fontSize.label}
        color="#fff"
        sx={{
          overflow: "hidden",
        }}
        noWrap
      >
        {title}
      </Typography>
    </Box>
  </CardContainer>
);

const MediumCard: FC<CardProps> = ({ title, image }) => (
  <CardContainer>
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      width="100%"
      height="100%"
      textAlign="center"
      sx={{
        backgroundImage: `url(${image})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
    >
      <Typography padding={0} variant="h6">
        {title}
      </Typography>
    </Box>
  </CardContainer>
);

const LargeCard: FC<CardProps> = ({ title, image, additionalInfo }) => (
  <CardContainer>
    <Box sx={{ width: "100%", height: "100%" }}>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        width="100%"
        height="50%"
        borderRadius={`${borderRadius.small}  ${borderRadius.small} 0 0`}
        textAlign="center"
        sx={{
          backgroundImage: `url(${image})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      >
        <Typography variant="h6">{title}</Typography>
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="space-evenly"
        alignItems="start"
        height="50%"
        paddingX={padding.small}
      >
        {additionalInfo?.map((content) => (
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
    </Box>
  </CardContainer>
);

const SmartPanel = () => {
  return (
    <Box
      sx={{
        width: SMART_PANEL_WIDTH,
        height: SMART_PANEL_HEIGHT,
        overflowX: "auto",
        overflowY: "hidden",
      }}
    >
      <ImageList
        sx={{
          width: "fit-content",
          height: SMART_PANEL_HEIGHT,
          transform: "translateZ(0)",
          m: 0,
          p: 0,
        }}
        variant="quilted"
        cols={getSmartPanelCols(ITEM_DATA)}
        rowHeight={DEFAULT_CARD_SIZE - DEFAULT_GAP}
      >
        {ITEM_DATA.map((item) => (
          <ImageListItem
            key={item.title}
            cols={getItemCols(item.type)}
            rows={getItemRows(item.type)}
            sx={{
              width:
                item.type === ItemType.small
                  ? `${getItemCols(item.type) * DEFAULT_CARD_SIZE}px`
                  : `${getItemCols(item.type) * DEFAULT_CARD_SIZE + DEFAULT_GAP}px`,
              height: `${getItemRows(item.type) * (DEFAULT_CARD_SIZE - DEFAULT_GAP)}px`,
            }}
          >
            {item.type === "small" && (
              <SmallCard title={item.title} icon={item.icon} />
            )}
            {item.type === "medium" && (
              <MediumCard title={item.title} image={item.image} />
            )}
            {item.type === "large" && (
              <LargeCard
                title={item.title}
                image={item.image}
                additionalInfo={item.additionalInfo}
              />
            )}
          </ImageListItem>
        ))}
      </ImageList>
    </Box>
  );
};

export default SmartPanel;
