import {
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import React, { useCallback, useState } from "react";
import { borderRadius, fontSize } from "../../../styles/constants";
import { capitalizeFirstLetter } from "../../../utils/StringUtils";
import { disableScroll, enableScroll } from "../../../utils/ScrollUtils";

interface PlainDropdownMenuProps {
  items: string[];
  onSelectCallback: (selectedItem: string) => void;
}
const PlainDropdownMenu: React.FC<PlainDropdownMenuProps> = ({
  items,
  onSelectCallback,
}) => {
  const [selectedItem, setSelectedItem] = useState(items[0]);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleOnChange = useCallback(
    (event: SelectChangeEvent) => {
      setSelectedItem(event.target.value as string);
      onSelectCallback(event.target.value as string);
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
    <FormControl fullWidth>
      <Select
        value={selectedItem}
        onChange={handleOnChange}
        onOpen={handleOpen}
        onClose={handleClose}
        open={isOpen}
        MenuProps={{
          PaperProps: { sx: { borderRadius: borderRadius.small } },
        }}
        sx={{
          padding: "0",
          textAlign: "center",
          height: "30px",
          borderRadius: borderRadius.small,
          backgroundColor: "#fff",
          "& fieldset": {
            border: "none",
          },
          boxShadow: "2px 2px 4px 0px rgba(0, 0, 0, 0.15)",
          fontSize: fontSize.label,
        }}
      >
        {items.map((item) => (
          <MenuItem
            key={item}
            value={item}
            sx={{
              fontSize: fontSize.label,
            }}
          >
            {capitalizeFirstLetter(item)}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default PlainDropdownMenu;
