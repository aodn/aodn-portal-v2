import Menu from "@mui/material/Menu";
import {
  forwardRef,
  MouseEvent,
  useCallback,
  useImperativeHandle,
  useState,
} from "react";
import { MenuItem, SxProps } from "@mui/material";
import { OpenType } from "../../hooks/useTabNavigation";

export interface ContextMenuRef {
  openContextMenu: (e: MouseEvent<HTMLElement>) => void; // User call this to open the menu
}

interface ContextMenuProps {
  onClick?: (type: OpenType | undefined) => void;
  sx?: SxProps;
}

const ContextMenu = forwardRef<ContextMenuRef, ContextMenuProps>(
  ({ onClick, sx }, ref) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleClose = useCallback((e: MouseEvent<HTMLElement>) => {
      e.stopPropagation(); // prevent event bubbling trigger other click event.
      setAnchorEl(null);
    }, []);

    const handleClick = useCallback(
      (e: MouseEvent<HTMLElement>, type: OpenType) => {
        handleClose(e);
        setTimeout(() => onClick?.(type), 0);
      },
      [handleClose, onClick]
    );

    useImperativeHandle(ref, () => ({
      openContextMenu: (e: MouseEvent<HTMLElement>) => {
        e.preventDefault();
        setAnchorEl(e.currentTarget);
      },
    }));

    return (
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem sx={sx} onClick={(e) => handleClick(e, OpenType.TAB)}>
          Open in new tab..
        </MenuItem>
        <MenuItem sx={sx} onClick={(e) => handleClick(e, OpenType.WINDOW)}>
          Open in new window..
        </MenuItem>
      </Menu>
    );
  }
);

ContextMenu.displayName = "ContextMenu";
export default ContextMenu;
