import { FC, useCallback, useEffect, useRef, useState } from "react";
import { PinListButtonControlProps } from "../map/mapbox/controls/PinListButtonControl";
import { IconButton, Popper } from "@mui/material";
import LibraryAddCheckIcon from "@mui/icons-material/LibraryAddCheck";

import PinList from "./PinList";

interface PinListButtonProps extends PinListButtonControlProps {}

const PinListButton: FC<PinListButtonProps> = ({
  showList = false,
  datasetsSelected = [],
}) => {
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(showList);
  console.log("pin list selected dataset", datasetsSelected);

  useEffect(() => {
    setOpen(showList);
  }, [showList]);

  useEffect(() => {
    if (!open && datasetsSelected && datasetsSelected.length > 0) {
      setOpen(true);
    }
    // only depend on change of datasetsSelected
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [datasetsSelected]);

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
        <PinList showList={showList} datasetsSelected={datasetsSelected} />
      </Popper>
    </>
  );
};

export default PinListButton;
