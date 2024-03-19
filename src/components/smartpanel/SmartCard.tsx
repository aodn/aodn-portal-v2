import * as React from "react";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardMedia,
  Typography,
} from "@mui/material";

enum CardType {
  OneOnOne,
  TwoOnOne,
  TwoOnTwo,
  ThreeOnTwo,
}

interface SmartcardProps {
  colour?: string;
  imageUrl?: string;
  caption: string;
  underline?: React.ReactNode;
  card?: CardType;
  isOutlined?: boolean;
  onCardClicked?: () => void;
}

const getPreferDimension = (type: CardType | undefined) => {
  switch (type) {
    case CardType.TwoOnTwo:
      return { cardHeight: "220px", imgWidth: "100%", imgHeight: "120px" };
    case CardType.TwoOnOne:
      return { cardHeight: "100px", imgWidth: "100%", imgHeight: "100px" };
    default:
      return { cardHeight: "90px", imgWidth: "60px", imgHeight: "60px" };
  }
};

const SmartCardContent = (props: SmartcardProps) => {
  const t = props.card;
  const dimension = getPreferDimension(t);
  const isLittleCard = t == CardType.OneOnOne;

  return (
    <Card
      elevation={isLittleCard ? 0 : 1}
      sx={{
        maxHeight: dimension.cardHeight,
        backgroundColor: "transparent",
        border: !isLittleCard ? "1px solid #FFFFFF" : "none",
        paddingTop: isLittleCard ? "12px" : "0",
      }}
    >
      <CardActionArea
        onClick={() => props.onCardClicked && props.onCardClicked()}
      >
        {props?.imageUrl ? (
          <>
            <CardMedia
              component="img"
              image={props.imageUrl}
              sx={{
                objectFit: "cover",
                marginLeft: "auto",
                marginRight: "auto",
                left: 0,
                right: 0,
                width: dimension.imgWidth,
                height: dimension.imgHeight,
              }}
            />
            {
              // Add text and position text in the middle of the image
            }
            {(props.card === CardType.TwoOnOne ||
              props.card === CardType.TwoOnTwo) && (
              <div
                style={{
                  position: "absolute",
                  marginLeft: "auto",
                  marginRight: "auto",
                  left: 0,
                  right: 0,
                  textAlign: "center",
                  color: props.colour ?? "white",
                  bottom: "40%",
                }}
              >
                <Typography
                  variant="body1"
                  color={props.colour ?? "white"}
                  fontWeight={300}
                  fontSize={"22px"}
                  mb={props.isOutlined ? 2 : 0}
                >
                  {props.caption}
                </Typography>
              </div>
            )}
            {props.card === CardType.OneOnOne && (
              <div
                style={{
                  justifyContent: "center",
                  display: "flex",
                }}
              >
                <Typography
                  variant="body1"
                  color={props.colour ?? "white"}
                  fontWeight={300}
                  pt={props.isOutlined ? 0 : 1}
                  pb={props.isOutlined ? 1 : 0}
                >
                  {props.caption}
                </Typography>
              </div>
            )}
          </>
        ) : (
          <>
            {(props.card === CardType.TwoOnOne ||
              props.card === CardType.TwoOnTwo) && (
              <Button
                variant="outlined"
                sx={{
                  fontSize: "22px",
                  fontWeight: "300",
                  color: props.colour ?? "white",
                  padding: "30px",
                }}
              >
                {props.caption}
              </Button>
            )}
          </>
        )}
      </CardActionArea>
      {props.underline && (
        <Box sx={{ paddingY: 1, paddingX: 2 }}>
          <Typography
            variant="subtitle1"
            color="white"
            fontWeight={300}
            textAlign="left"
          >
            {props.underline}
          </Typography>
        </Box>
      )}
    </Card>
  );
};
/**
 * A Card where is span two column and one row.
 * @param props
 * @constructor
 */
const SmartCard21 = (props: SmartcardProps) => {
  // Format string with Start / End column
  const p = { ...props };
  p.card = CardType.TwoOnOne;

  return (
    <Box
      sx={{
        gridColumn: "span 2",
        gridRow: "span 1",
      }}
    >
      <SmartCardContent {...p} />
    </Box>
  );
};
/**
 * A Card where is span one column and one row.
 * @param props
 * @constructor
 */
const SmartCard11 = (props: SmartcardProps) => {
  // Format string with Start / End column
  const p = { ...props };
  p.card = CardType.OneOnOne;

  return (
    <Box
      sx={{
        gridColumn: "span 1",
        gridRow: "span 1",
      }}
    >
      <SmartCardContent {...p} />
    </Box>
  );
};

/**
 * A Card where is span one column and one row.
 * @param props
 * @constructor
 */
const SmartCard22 = (props: SmartcardProps) => {
  // Format string with Start / End column
  const p = { ...props };
  p.card = CardType.TwoOnTwo;

  return (
    <Box
      sx={{
        gridColumn: "span 2",
        gridRow: "span 2",
      }}
    >
      <SmartCardContent {...p} />
    </Box>
  );
};

const SmartCard32 = (props: SmartcardProps) => {
  // Format string with Start / End column
  const p = { ...props };
  p.card = CardType.ThreeOnTwo;

  return (
    <Box
      sx={{
        gridColumn: "span 3",
        gridRow: "span 2",
      }}
    >
      <SmartCardContent {...p} />
    </Box>
  );
};

export { SmartCard11, SmartCard21, SmartCard22, SmartCard32 };
