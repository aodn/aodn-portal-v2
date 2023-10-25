import * as React from 'react';
import {Box, Card, CardActionArea, CardMedia} from '@mui/material';

enum CardType {
    OneOnOne,
    TwoOnOne,
    TwoOnTwo
};

interface SmartcardProps {
    imageUrl: string,
    caption: string,
    card? : CardType
};

const getPreferDimension = (type: CardType | undefined) => {
    switch (type) {
        case CardType.TwoOnTwo:
            return {cardHeight: '200px', imgWidth: '100%', imgHeight: '120px'};
        case CardType.TwoOnOne:
            return {cardHeight: '90px', imgWidth: '100%', imgHeight: '80px'};
        default:
            return {cardHeight: '90px', imgWidth: '60px', imgHeight: '60px'};
    }
}

const SmartCardContent = (props: SmartcardProps) => {
    const t = props.card;
    const dimension = getPreferDimension(t);

    return(
        <Card sx={{
                height: dimension.cardHeight
            }}>
            <CardActionArea sx={{
                border: '5px solid #fff'
            }}>
                {props?.imageUrl &&
                  <>
                    <CardMedia
                        component='img'
                        image={props.imageUrl}
                        sx={{
                            objectFit: 'cover',
                            marginLeft: 'auto',
                            marginRight: 'auto',
                            left: 0,
                            right: 0,
                            width: dimension.imgWidth,
                            height: dimension.imgHeight
                        }}
                    />
                      {
                          // Add text and position text in the middle of the image
                      }
                      {(props.card === CardType.TwoOnOne || props.card === CardType.TwoOnTwo) &&
                        <div
                          style={{
                              position: "absolute",
                              marginLeft: 'auto',
                              marginRight: 'auto',
                              left: 0,
                              right: 0,
                              textAlign: 'center',
                              color: 'white',
                              fontSize: 'x-large',
                              fontWeight: 'bold',
                              bottom: '40%'
                          }}>
                            {props.caption}
                        </div>
                      }
                      {props.card === CardType.OneOnOne &&
                          <div style={{
                              justifyContent: 'center',
                              display: 'flex'
                          }}>
                              {props.caption}
                          </div>
                      }
                  </>
                }
            </CardActionArea>
        </Card>
    );
}
/**
 * A Card where is span two column and one row.
 * @param props
 * @constructor
 */
const SmartCard_2_1 = (props: SmartcardProps) => {
    // Format string with Start / End column
    const p = {...props};
    p.card = CardType.TwoOnOne;

    return(
        <Box
            sx = {{
                gridColumn: 'span 2',
                gridRow: 'span 1'
            }}
        >
            <SmartCardContent {...p}/>
        </Box>
    );
};
/**
 * A Card where is span one column and one row.
 * @param props
 * @constructor
 */
const SmartCard_1_1 = (props: SmartcardProps) => {
    // Format string with Start / End column
    const p = {...props};
    p.card = CardType.OneOnOne;

    return(
        <Box
            sx = {{
            gridColumn: 'span 1',
            gridRow: 'span 1'
        }}>
            <SmartCardContent {...p}/>
        </Box>
    );
};

/**
 * A Card where is span one column and one row.
 * @param props
 * @constructor
 */
const SmartCard_2_2 = (props: SmartcardProps) => {
    // Format string with Start / End column
    const p = {...props};
    p.card = CardType.TwoOnTwo;

    return(
        <Box
            sx = {{
                gridColumn: 'span 2',
                gridRow: 'span 2'
            }}
        >
            <SmartCardContent {...p}/>
        </Box>
    );
};

export {
    SmartCard_1_1,
    SmartCard_2_1,
    SmartCard_2_2
};