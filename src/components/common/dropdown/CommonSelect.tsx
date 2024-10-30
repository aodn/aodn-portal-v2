import {
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
  SxProps,
} from "@mui/material";
import { FC, useCallback, useState } from "react";
import { IconProps } from "../../icon/types";
import { useDetailPageContext } from "../../../pages/detail-page/context/detail-page-context";

export interface SelectItem<T = string> {
  value: T;
  label: string;
  icon?: JSX.Element | FC<IconProps>;
}
export interface CommonSelectProps<T = string> {
  items: SelectItem<T>[];
  // Once value is provided, the component is controllable
  value?: T | null;
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

const disableScroll = () => {
  // Save current scroll position and disable the page scroll to avoid menuitem
  // flow on top of page
  const scrollY = window.scrollY;
  document.body.style.position = "fixed";
  document.body.style.width = "100%";
  document.body.style.top = `-${scrollY}px`;
};

const enableScroll = () => {
  // Restore scroll position
  const scrollY = document.body.style.top;
  document.body.style.position = "";
  document.body.style.width = "";
  window.scrollTo(0, parseInt(scrollY || "0", 10) * -1);
};

const CommonSelect: FC<CommonSelectProps> = ({
  items,
  onSelectCallback,
  sx,
}) => {
  const [selectedItem, setSelectedItem] = useState<string>(items[0].value);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { isCollectionNotFound } = useDetailPageContext();

  const handleOnChange = useCallback(
    (event: SelectChangeEvent<string>) => {
      const selectedItem = event.target.value as string;
      setSelectedItem(selectedItem);
      onSelectCallback && onSelectCallback(selectedItem);
    },
    [onSelectCallback]
  );

  const handleOpen = useCallback(() => {
    setIsOpen(true);
    disableScroll();
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    enableScroll();
  }, []);

  return (
    <FormControl fullWidth disabled={isCollectionNotFound}>
      <Select
        value={selectedItem}
        onOpen={handleOpen}
        onClose={handleClose}
        open={isOpen}
        onChange={handleOnChange}
        sx={{
          ...DEFAULT_SELECT_STYLE,
          ...sx,
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

export { disableScroll, enableScroll };
export default CommonSelect;
