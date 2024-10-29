import {
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
  SxProps,
} from "@mui/material";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import { IconProps } from "../../icon/types";
import { useDetailPageContext } from "../../../pages/detail-page/context/detail-page-context";

export interface SelectItem<T = string> {
  value: T;
  label: string;
  icon?: JSX.Element | FC<IconProps>;
}
export interface CommonSelectProps<T = string> {
  items: SelectItem<T>[];
  onSelectCallback?: (value: T) => void;
  sx?: SxProps;
}

const DEFAULT_SELECT_STYLE: SxProps = {
  padding: "0",
  textAlign: "center",
  height: "44px",
  borderRadius: "4px",
  backgroundColor: "#fff",
  "& fieldset": {
    border: "none",
  },
  boxShadow: "2px 2px 4px 0px rgba(0, 0, 0, 0.15)",
  fontSize: "14px",
};

const CommonSelect: FC<CommonSelectProps> = ({
  items,
  onSelectCallback,
  sx,
}) => {
  const selectRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string>(items[0].value);
  const { isCollectionNotFound } = useDetailPageContext();

  const handleOnChange = useCallback(
    (event: SelectChangeEvent<string>) => {
      const selectedItem = event.target.value as string;
      setSelectedItem(selectedItem);
      onSelectCallback && onSelectCallback(selectedItem);
    },
    [onSelectCallback]
  );
  // If the select is outside of viewport, close the menu item
  // otherwise the menuitem will flow on top of screen.
  const checkIfSelectIsOffScreen = useCallback(() => {
    if (selectRef.current) {
      const rect = selectRef.current.getBoundingClientRect();

      // Check if any part of the Select component is outside the viewport
      const isOffScreenNow =
        rect.top < 0 ||
        rect.left < 0 ||
        rect.bottom >
          (window.innerHeight || document.documentElement.clientHeight) ||
        rect.right >
          (window.innerWidth || document.documentElement.clientWidth);

      isOffScreenNow && setOpen(false);
    }
  }, [selectRef]);

  useEffect(() => {
    window.addEventListener("scroll", checkIfSelectIsOffScreen);
    window.addEventListener("resize", checkIfSelectIsOffScreen); // Also handle viewport resizing
    checkIfSelectIsOffScreen(); // Initial check

    // Cleanup listeners on component unmount
    return () => {
      window.removeEventListener("scroll", checkIfSelectIsOffScreen);
      window.removeEventListener("resize", checkIfSelectIsOffScreen);
    };
  }, [checkIfSelectIsOffScreen]);

  return (
    <FormControl fullWidth disabled={isCollectionNotFound}>
      <Select
        ref={selectRef}
        value={selectedItem}
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        onChange={handleOnChange}
        sx={{
          ...DEFAULT_SELECT_STYLE,
          ...sx,
        }}
        MenuProps={{
          // Make the menuitem stick to select on scroll, however
          // this cannot fix issue where the menuitem flow on top
          // even select is off viewport
          disableScrollLock: true,
        }}
      >
        {items.map((item) => (
          <MenuItem key={item.value} value={item.value}>
            {item.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default CommonSelect;
