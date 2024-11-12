import { FC, useCallback, useEffect, useRef, useState } from "react";
import { PinListButtonControlProps } from "../map/mapbox/controls/PinListButtonControl";
import { Box, IconButton, Popper } from "@mui/material";
import LibraryAddCheckIcon from "@mui/icons-material/LibraryAddCheck";
import { PIN_LIST_WIDTH } from "./constants";
import { borderRadius } from "../../styles/constants";
import PinListAccordionGroup from "./PinListAccordionGroup";

interface PinListButtonProps extends PinListButtonControlProps {}

const PinListButton: FC<PinListButtonProps> = ({
  showList = false,
  pinList = [],
  selectedUuid,
  setSelectedUuid,
  onRemoveFromPinList,
}) => {
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(showList);

  useEffect(() => {
    setOpen(showList);
  }, [showList]);

  useEffect(() => {
    if (!open && pinList && pinList.length > 0) {
      setOpen(true);
    }
    // only depends on change of pinList
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pinList]);

  const handleToggle = useCallback(() => {
    setOpen((prev) => !prev);
  }, [setOpen]);

  return (
    <>
      <IconButton
        aria-label="pinned-list-button"
        id="pinned-list-button"
        ref={anchorRef}
        onClick={handleToggle}
      >
        <LibraryAddCheckIcon />
      </IconButton>
      <Popper
        id="pinned-list"
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        placement="left-start"
        disablePortal
        modifiers={[
          {
            name: "offset",
            options: {
              offset: [0, 10],
            },
          },
        ]}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: PIN_LIST_WIDTH,
            maxHeight: "85vh",
            overflowY: "auto",
            borderRadius: borderRadius.menu,
            backgroundColor: "#fff",
            zIndex: 1,
          }}
        >
          <PinListAccordionGroup
            pinList={pinList}
            selectedUuid={selectedUuid}
            setSelectedUuid={setSelectedUuid}
            onRemoveFromPinList={onRemoveFromPinList}
          />
        </Box>
      </Popper>
    </>
  );
};

export default PinListButton;
