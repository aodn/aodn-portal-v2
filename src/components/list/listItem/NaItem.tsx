import React from "react";
import ItemBaseGrid from "./ItemBaseGrid";
import InfoCard from "../../info/InfoCard";
import { capitalizeFirstLetter } from "../../../utils/StringUtils";
import { InfoStatusType } from "../../info/InfoDefinition";
import { portalTheme } from "../../../styles";

interface NaItemProps {
  title: string;
  message?: string;
  cardSx?: React.CSSProperties;
  contentSx?: React.CSSProperties;
}

const NaItem: React.FC<NaItemProps> = ({
  title,
  message,
  cardSx,
  contentSx,
}) => {
  return (
    <ItemBaseGrid disableHover>
      <InfoCard
        infoContent={{
          body: message || `${capitalizeFirstLetter(title)} not available`,
        }}
        status={InfoStatusType.WARNING}
        sx={{
          height: "40px",
          width: "100%",
          padding: "4px",
          borderRadius: "4px",
          boxShadow: "none",
          bgcolor: portalTheme.palette.primary6,
          ...cardSx,
        }}
        contentSx={{
          padding: 0,
          textAlign: "center",
          bgcolor: portalTheme.palette.primary6,
          ...contentSx,
        }}
      />
    </ItemBaseGrid>
  );
};

export default NaItem;
