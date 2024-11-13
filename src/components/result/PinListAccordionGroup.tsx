import { FC, SyntheticEvent, useCallback, useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { OGCCollection } from "../common/store/OGCCollectionDefinitions";
import { color, fontColor, fontSize, fontWeight } from "../../styles/constants";
import StyledAccordion from "../common/accordion/StyledAccordion";
import StyledAccordionSummary from "../common/accordion/StyledAccordionSummary";
import StyledAccordionDetails from "../common/accordion/StyledAccordionDetails";
import PinListCard from "./PinListCard";

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

  // When click on an other accordion (if not click on the remove button) will collapse the current one and expand the click one
  // Always set the expanded accordion dataset as the selected dataset
  const handleChange = useCallback(
    (panel: string, hoverOnRemoveButton: boolean) =>
      (_: SyntheticEvent, newExpanded: boolean) => {
        if (hoverOnRemoveButton) return;
        setExpanded(newExpanded ? panel : false);
        setSelectedUuid?.(newExpanded ? [panel] : []);
      },
    [setSelectedUuid]
  );

  const handleRemove = useCallback(
    (currentPanel: string) => {
      // Keep the current expansion status when remove the other un-expanded pinned datasets
      setExpanded((prev) => {
        return prev === currentPanel ? false : prev;
      });
      if (onRemoveFromPinList) onRemoveFromPinList(currentPanel);
    },
    [onRemoveFromPinList]
  );

  // Always open the selected dataset, if none is selected then collapse all
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
          onChange={handleChange(item.id, hoverOnRemoveButton)}
        >
          <StyledAccordionSummary>
            <Box
              display="flex"
              flexDirection="row"
              justifyContent="space-between"
              flexWrap="nowrap"
              alignItems="center"
              width="100%"
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
                  minWidth: "15px",
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
                X
              </Button>
            </Box>
          </StyledAccordionSummary>
          <StyledAccordionDetails>
            <PinListCard collection={item} />
          </StyledAccordionDetails>
        </StyledAccordion>
      ))}
    </>
  );
};

export default PinListAccordionGroup;
