import { FC, SyntheticEvent, useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import { OGCCollection } from "../common/store/OGCCollectionDefinitions";
import { fontColor, fontSize, fontWeight } from "../../styles/constants";
import ComplexMapHoverTip from "../common/hover-tip/ComplexMapHoverTip";
import StyledAccordion from "../common/accordion/StyledAccordion";
import StyledAccordionSummary from "../common/accordion/StyledAccordionSummary";
import StyledAccordionDetails from "../common/accordion/StyledAccordionDetails";

interface PinListAccordionGroupProps {
  pinList: OGCCollection[] | undefined;
  selectedUuid?: string[];
  setSelectedUuid?: (uuids: Array<string>) => void;
}

const PinListAccordionGroup: FC<PinListAccordionGroupProps> = ({
  pinList,
  selectedUuid,
  setSelectedUuid,
}) => {
  const [expanded, setExpanded] = useState<string | false>(false);

  const handleChange =
    (panel: string) => (_: SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
      if (setSelectedUuid) {
        setSelectedUuid([panel]);
      }
    };

  useEffect(() => {
    if (selectedUuid && selectedUuid.length > 0) {
      setExpanded(selectedUuid[0]);
    }
  }, [selectedUuid]);

  if (!pinList) return;

  return (
    <>
      {pinList.map((item) => (
        <StyledAccordion
          key={item.id}
          expanded={expanded === item.id}
          onChange={handleChange(item.id)}
        >
          <StyledAccordionSummary>
            <Typography
              color={fontColor.gray.dark}
              fontSize={fontSize.label}
              fontWeight={fontWeight.bold}
              sx={{
                padding: 0,
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: "2",
                WebkitBoxOrient: "vertical",
              }}
            >
              {item.title}
            </Typography>
          </StyledAccordionSummary>
          <StyledAccordionDetails>
            <ComplexMapHoverTip collection={item} hideTittle />
          </StyledAccordionDetails>
        </StyledAccordion>
      ))}
    </>
  );
};

export default PinListAccordionGroup;
