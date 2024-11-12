import { FC, SyntheticEvent, useEffect, useState } from "react";
import { Box, Button, Fade, Typography } from "@mui/material";
import { OGCCollection } from "../common/store/OGCCollectionDefinitions";
import { color, fontColor, fontSize, fontWeight } from "../../styles/constants";
import ComplexMapHoverTip from "../common/hover-tip/ComplexMapHoverTip";
import StyledAccordion from "../common/accordion/StyledAccordion";
import StyledAccordionSummary from "../common/accordion/StyledAccordionSummary";
import StyledAccordionDetails from "../common/accordion/StyledAccordionDetails";

interface PinListAccordionGroupProps {
  pinList: OGCCollection[] | undefined;
  selectedUuid?: string[];
  setSelectedUuid?: (uuids: Array<string>) => void;
  onRemoveFromPinList?: (idToRemove: string) => void;
}

const PinListAccordionGroup: FC<PinListAccordionGroupProps> = ({
  pinList,
  selectedUuid,
  setSelectedUuid,
  onRemoveFromPinList,
}) => {
  const [expanded, setExpanded] = useState<string | false>(false);
  const [hoverOnRemoveButton, setHoverOnRemoveButton] =
    useState<boolean>(false);

  const handleChange =
    (panel: string) => (_: SyntheticEvent, newExpanded: boolean) => {
      if (hoverOnRemoveButton) return;
      setExpanded(newExpanded ? panel : false);
      setSelectedUuid?.(newExpanded ? [panel] : []);
    };

  const handleRemove = (currentPanel: string) => {
    // Keep the current expansion status when remove the other un-expanded pinned datasets
    setExpanded((prev) => {
      if (prev === currentPanel) {
        return false;
      } else {
        return prev;
      }
    });
    if (onRemoveFromPinList) onRemoveFromPinList(currentPanel);
  };

  useEffect(() => {
    setExpanded(selectedUuid?.[0] || false);
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
            <Box
              display="flex"
              flexDirection="row"
              flexWrap="nowrap"
              alignItems="center"
            >
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
              <Button
                sx={{
                  minWidth: "18px",
                  color: color.gray.dark,
                  fontSize: fontSize.icon,
                  fontWeight: fontWeight.bold,
                  " &:hover": {
                    color: color.blue.dark,
                    fontSize: fontSize.info,
                  },
                }}
                onClick={() => handleRemove(item.id)}
                onMouseEnter={() => setHoverOnRemoveButton(true)}
                onMouseLeave={() => setHoverOnRemoveButton(false)}
              >
                x
              </Button>
            </Box>
          </StyledAccordionSummary>
          <StyledAccordionDetails>
            <Fade>
              <ComplexMapHoverTip collection={item} hideTittle />
            </Fade>
          </StyledAccordionDetails>
        </StyledAccordion>
      ))}
    </>
  );
};

export default PinListAccordionGroup;
