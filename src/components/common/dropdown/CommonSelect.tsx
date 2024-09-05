import {
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
  SxProps,
} from "@mui/material";
import { FC, useState } from "react";
import { IconProps } from "../../icon/types";

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
  const [selectedItem, setSelectedItem] = useState<string>(items[0].value);

  const handleOnChange = (event: SelectChangeEvent<string>) => {
    const selectedItem = event.target.value as string;
    setSelectedItem(selectedItem);
    if (onSelectCallback) onSelectCallback(selectedItem);
  };

  return (
    <FormControl fullWidth>
      <Select
        value={selectedItem}
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

export default CommonSelect;
