import {
  Box,
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import { FC, useCallback, useEffect, useState } from "react";
import { CommonSelectProps, SelectItem } from "./CommonSelect";
import {
  border,
  borderRadius,
  color,
  fontSize,
  margin,
} from "../../../styles/constants";
import { IconProps } from "../../icon/types";
import { mergeWithDefaults } from "../../../utils/ObjectUtils";
import { disableScroll, enableScroll } from "../../../utils/ScrollbarUtils";

interface IconSelectColorConfig {
  defaultColor: string;
  displayColor: string;
  selectedColor: string;
  defaultBgColor: string;
  selectedBgColor: string;
}
const defaultColorConfig = {
  defaultColor: color.gray.dark,
  displayColor: color.blue.dark,
  selectedColor: "#fff",
  defaultBgColor: color.white.sixTenTransparent,
  selectedBgColor: color.blue.dark,
};

interface IconSelectProps<T = string> extends CommonSelectProps<T> {
  selectName: string;
  colorConfig?: IconSelectColorConfig;
}

const getSelectedItemIcon = <T extends string | number>(
  value: T,
  items: SelectItem<T>[]
) => {
  const selectedItem = items.find((item) => item.value === value);
  return selectedItem ? selectedItem.icon : null;
};

const renderSelectValue = (
  icon: FC<IconProps> | JSX.Element | undefined | null,
  label: string,
  color: string,
  iconBgColor: string
) => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexWrap="nowrap"
      gap={1}
    >
      {icon && (
        <Box mr={margin.lg} mb={-1}>
          {typeof icon === "function"
            ? icon({ color, bgColor: iconBgColor })
            : icon}
        </Box>
      )}
      <Typography padding={0} fontSize={fontSize.info} color={color}>
        {label}
      </Typography>
    </Box>
  );
};

const IconSelect = <T extends string | number = string>({
  items,
  selectName,
  value,
  colorConfig,
  onSelectCallback,
  "data-testid": testId,
  sx,
}: IconSelectProps<T>) => {
  const [selectedItem, setSelectedItem] = useState<T | null>(value ?? null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleOnChange = useCallback(
    (event: SelectChangeEvent<T>) => {
      const selectedItem = event.target.value as T;
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

  const config = mergeWithDefaults(defaultColorConfig, colorConfig);

  const defaultValue = () => {
    const defaultIcon = items[0].icon;
    return renderSelectValue(
      defaultIcon,
      selectName,
      config.defaultColor,
      config.defaultBgColor
    );
  };

  const selectedValue = (value: T) => {
    const selectedIcon = getSelectedItemIcon(value, items);
    return renderSelectValue(
      selectedIcon,
      selectName,
      config.selectedColor,
      config.selectedBgColor
    );
  };

  useEffect(() => {
    if (value) setSelectedItem(value);
  }, [value]);

  return (
    <FormControl fullWidth>
      <Select
        value={selectedItem || items[0].value}
        renderValue={(value) =>
          selectedItem ? selectedValue(value) : defaultValue()
        }
        data-testid={testId}
        onChange={handleOnChange}
        onOpen={handleOpen}
        onClose={handleClose}
        open={isOpen}
        IconComponent={() => null}
        sx={{
          padding: "0",
          height: "36px",
          border: `${border.xs} ${color.blue.darkSemiTransparent}`,
          borderRadius: borderRadius.small,
          backgroundColor: selectedItem
            ? color.blue.dark
            : color.white.sixTenTransparent,
          "& fieldset": {
            border: "none",
          },
          ...sx,
        }}
      >
        {items.map((item) => (
          <MenuItem key={item.value} value={item.value}>
            {renderSelectValue(
              item.icon,
              item.label,
              config.displayColor,
              config.defaultBgColor
            )}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default IconSelect;
