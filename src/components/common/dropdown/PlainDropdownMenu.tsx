import {
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import React, { useState } from "react";

interface PlainDropdownMenuProps {
  items: string[];
  onSelectCallback: (selectedItem: string) => void;
}
const PlainDropdownMenu: React.FC<PlainDropdownMenuProps> = ({
  items,
  onSelectCallback,
}) => {
  const [selectedItem, setSelectedItem] = useState(items[0]);

  const handleOnChange = (event: SelectChangeEvent) => {
    setSelectedItem(event.target.value as string);
    onSelectCallback(event.target.value as string);
  };

  const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <FormControl fullWidth>
      <Select
        value={selectedItem}
        onChange={handleOnChange}
        sx={{
          padding: "0",
          textAlign: "center",
          height: "44px",
          borderRadius: "4px",
          backgroundColor: "#fff",
          "& fieldset": {
            border: "none",
          },
          boxShadow: "2px 2px 4px 0px rgba(0, 0, 0, 0.15)",
          fontSize: "18px",
        }}
      >
        {items.map((item) => (
          <MenuItem key={item} value={item}>
            {capitalizeFirstLetter(item)}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default PlainDropdownMenu;
