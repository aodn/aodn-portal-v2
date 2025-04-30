import {
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
  SxProps,
} from "@mui/material";
import { FC, memo, useCallback, useState } from "react";
import { IconProps } from "../../icon/types";
import { useDetailPageContext } from "../../../pages/detail-page/context/detail-page-context";
import { disableScroll, enableScroll } from "../../../utils/ScrollUtils";

export interface SelectItem<T = string> {
  value: T;
  label: string;
  icon?: Element | FC<IconProps>;
}
export interface CommonSelectProps<T = string> {
  items: SelectItem<T>[];
  // Once value is provided, the component is controllable
  value?: T | null;
  onSelectCallback?: (value: T) => void;
  dataTestId?: string;
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

const CommonSelect: FC<CommonSelectProps> = memo(
  ({
    items,
    onSelectCallback,
    dataTestId = "common-select",
    sx,
  }: CommonSelectProps) => {
    const [selectedItem, setSelectedItem] = useState<string | undefined>(
      items[0]?.value
    );
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const { isCollectionNotFound } = useDetailPageContext();

    const handleOnChange = useCallback(
      (event: SelectChangeEvent<string>) => {
        const selectedItem = event.target.value as string;
        setSelectedItem(selectedItem);
        onSelectCallback?.(selectedItem);
      },
      [onSelectCallback]
    );

    const handleOpenState = useCallback(
      (open: boolean) => () => {
        open ? disableScroll() : enableScroll();
        setIsOpen(open);
      },
      []
    );

    return (
      <FormControl
        fullWidth
        disabled={isCollectionNotFound}
        data-testid={dataTestId}
      >
        <Select
          value={selectedItem}
          onOpen={handleOpenState(true)}
          onClose={handleOpenState(false)}
          open={isOpen}
          onChange={handleOnChange}
          sx={{
            ...DEFAULT_SELECT_STYLE,
            ...sx,
          }}
        >
          {items.map(({ value, label }) => (
            <MenuItem key={value} value={value}>
              {label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }
);

CommonSelect.displayName = "CommonSelect";

export default CommonSelect;
