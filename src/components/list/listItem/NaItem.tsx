import React from "react";
import ItemBaseGrid from "./ItemBaseGrid";
import InfoCard from "../../info/InfoCard";
import { capitalizeFirstLetter } from "../../../utils/StringUtils";
import { InfoStatusType } from "../../info/InfoDefinition";
import { portalTheme } from "../../../styles";

interface NaItemProps {
  title: string;
}

const NaItem: React.FC<NaItemProps> = ({ title }) => {
  return (
    <ItemBaseGrid disableHover>
      <InfoCard
        infoContent={{
          body: `${capitalizeFirstLetter(title)} not available`,
        }}
        status={InfoStatusType.WARNING}
        sx={{
          height: "40px",
          width: "100%",
          padding: "4px",
          borderRadius: "4px",
          boxShadow: "none",
          bgcolor: portalTheme.palette.primary6,
        }}
        contentSx={{
          padding: 0,
          textAlign: "center",
          bgcolor: portalTheme.palette.primary6,
        }}
      />
    </ItemBaseGrid>
  );
};

export default NaItem;
