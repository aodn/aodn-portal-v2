import {
  FormControl,
  FormLabel,
  MenuItem,
  MenuProps,
  Select,
  SelectChangeEvent,
  SxProps,
} from "@mui/material";
import {
  ComponentType,
  FC,
  memo,
  ReactElement,
  SVGProps,
  useCallback,
  useState,
} from "react";
import { disableScroll, enableScroll } from "../../../utils/ScrollUtils";
import { portalTheme } from "../../../styles";
import { ExpandMore } from "@mui/icons-material";

export interface SelectItem<T = string> {
  queryable?: boolean;
  value: T;
  label: string;
  icon?: ReactElement | ComponentType<SVGProps<SVGSVGElement>>;
}
export interface CommonSelectProps<T = string> {
  items: SelectItem<T>[];
  // Once value is provided, the component is controllable
  value?: T | null;
  label?: string;
  onSelectCallback?: (value: T) => void;
  disabled?: boolean;
  dataTestId?: string;
  selectSx?: SxProps;
  labelSx?: SxProps;
  menuProps?: Partial<MenuProps>;
}

const DEFAULT_SELECT_STYLE: SxProps = {
  ...portalTheme.typography.body1Medium,
  color: portalTheme.palette.text1,
  border: `1px solid ${portalTheme.palette.primary1}`,
  padding: "0",
  textAlign: "center",
  height: "44px",
  borderRadius: "6px",
  backgroundColor: "#fff",
  "& fieldset": {
    border: "none",
  },
  boxShadow: "2px 2px 4px 0px rgba(0, 0, 0, 0.15)",
};

const DEFAULT_MENU_PROPS = {
  PaperProps: {
    sx: {
      backgroundColor: "#fff",
      border: `1px solid ${portalTheme.palette.primary1}`,
      borderRadius: "6px",
      mt: "6px",
      "& .MuiMenuItem-root": {
        color: portalTheme.palette.text1,
        "&.Mui-selected": {
          backgroundColor: portalTheme.palette.primary5,
        },
      },
    },
  },
};

const CommonSelect: FC<CommonSelectProps> = memo(
  ({
    items,
    value,
    label,
    onSelectCallback,
    disabled = false,
    dataTestId = "common-select",
    selectSx,
    labelSx,
    menuProps,
  }: CommonSelectProps) => {
    const [selectedItem, setSelectedItem] = useState<string | undefined>(
      value || items[0]?.value || ""
    );
    const [isOpen, setIsOpen] = useState<boolean>(false);

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
      <FormControl fullWidth data-testid={dataTestId} disabled={disabled}>
        {label && <FormLabel sx={labelSx}>{label}</FormLabel>}
        <Select
          value={value || selectedItem}
          onOpen={handleOpenState(true)}
          onClose={handleOpenState(false)}
          open={isOpen}
          onChange={handleOnChange}
          IconComponent={ExpandMore}
          MenuProps={menuProps || DEFAULT_MENU_PROPS}
          sx={{
            ...DEFAULT_SELECT_STYLE,
            ...selectSx,
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
