import { Box, Card, SxProps, Typography } from "@mui/material";
import { FC, ReactNode } from "react";
import {
  border,
  borderRadius,
  color,
  fontSize,
  padding,
} from "../../../../styles/constants";

export interface CardProps {
  title: string;
  icon?: string;
  image?: string;
  additionalInfo?: string[];
  containerStyle?: SxProps;
  iconStyle?: SxProps;
  typoStyle?: SxProps;
}

interface CardContainerProps {
  children: ReactNode;
  containerStyle?: SxProps;
}
const CardContainer: FC<CardContainerProps> = ({
  children,
  containerStyle,
}) => (
  <Card
    elevation={0}
    sx={{
      height: "100%",
      width: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      bgcolor: color.white.twoTenTransparent,
      border: `${border.xs} ${color.brightBlue.semiTransparentDark}`,
      color: "#fff",
      "&:hover": {
        scale: "101%",
        cursor: "pointer",
      },
      ...containerStyle,
    }}
  >
    {children}
  </Card>
);

export const SmallCard: FC<CardProps> = ({
  title,
  icon,
  containerStyle,
  iconStyle,
  typoStyle,
}) => (
  <CardContainer containerStyle={containerStyle}>
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      width="100%"
      height="100%"
    >
      <Box
        height="50%"
        width="50%"
        padding={padding.extraSmall}
        sx={{ ...iconStyle }}
      >
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
      <Typography
        padding={padding.extraSmall}
        paddingTop={0}
        fontSize={fontSize.icon}
        color="#fff"
        sx={{
          overflow: "hidden",
          ...typoStyle,
        }}
        noWrap
      >
        {title}
      </Typography>
    </Box>
  </CardContainer>
);

export const MediumCard: FC<CardProps> = ({ title, image }) => (
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

export const LargeCard: FC<CardProps> = ({ title, image, additionalInfo }) => (
  <CardContainer>
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      width="100%"
      height="48%"
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
      height="52%"
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
  </CardContainer>
);
