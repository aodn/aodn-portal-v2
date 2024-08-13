import {
  FormControl,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  SxProps,
  Theme,
} from "@mui/material";
import { FC, useState } from "react";
import { capitalizeFirstLetter } from "../../../utils/StringUtils";

interface CommonSelectProps {
  items: string[];
  onSelectCallback?: (value: string) => void;
  sxProps?: SxProps<Theme>;
}

const defaultStyle: SxProps<Theme> = {
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
  onSelectCallback = () => {},
  sxProps = {} as SxProps<Theme>,
}) => {
  const [selectedItem, setSelectedItem] = useState(items[0]);

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
          ...defaultStyle,
          ...sxProps,
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

export default CommonSelect;
