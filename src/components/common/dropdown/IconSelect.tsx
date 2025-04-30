import {
  Box,
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import {
  FunctionComponent,
  isValidElement,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";
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
import { disableScroll, enableScroll } from "../../../utils/ScrollUtils";

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
  isIconOnly?: boolean;
}

export const ICON_SELECT_DEFAULT_HEIGHT = 36;

const getSelectedItem = <T extends string | number>(
  value: T,
  items: SelectItem<T>[]
) => {
  return items.find((item) => item.value === value);
};

// Function to render the icon wrapped in a Box
const renderIcon = (
  icon: Element | FunctionComponent<IconProps> | undefined,
  color: string,
  iconBgColor: string,
  isIconOnly?: boolean
): ReactNode => {
  if (!icon) return null;

  // Handle React Element
  if (isValidElement(icon)) {
    return (
      <Box mr={isIconOnly ? 0 : margin.lg} mb={-1}>
        {icon}
      </Box>
    );
  }

  // Handle FunctionComponent
  const IconComponent = icon as FunctionComponent<IconProps>;
  return (
    <Box mr={isIconOnly ? 0 : margin.lg} mb={-1}>
      <IconComponent color={color} bgColor={iconBgColor} />
    </Box>
  );
};

const renderSelectValue = (
  icon: Element | FunctionComponent<IconProps> | undefined,
  label: string | undefined,
  color: string,
  iconBgColor: string,
  isIconOnly?: boolean
) => {
  return (
    <Box
      display={isIconOnly ? "block" : "flex"}
      justifyContent="center"
      alignItems="center"
      flexWrap="nowrap"
      gap={isIconOnly ? 0 : 1}
    >
      {renderIcon(icon, color, iconBgColor, isIconOnly)}
      {!isIconOnly && label && (
        <Typography
          padding={0}
          fontSize={fontSize.info}
          color={color}
          overflow="hidden"
          textOverflow="ellipsis"
        >
          {label}
        </Typography>
      )}
    </Box>
  );
};

const IconSelect = <T extends string | number = string>({
  items,
  selectName,
  value,
  colorConfig,
  onSelectCallback,
  dataTestId: testId,
  isIconOnly = false,
  sx,
}: IconSelectProps<T>) => {
  const [selectedItem, setSelectedItem] = useState<T | null>(value ?? null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleOnChange = useCallback(
    (event: SelectChangeEvent<T>) => {
      const selectedItem = event.target.value as T;
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

  const config = mergeWithDefaults(defaultColorConfig, colorConfig);

  const defaultValue = (isIconOnly: boolean) => {
    const defaultIcon = items[0].icon;
    return renderSelectValue(
      defaultIcon,
      selectName,
      config.defaultColor,
      config.defaultBgColor,
      isIconOnly
    );
  };

  const selectedValue = (value: T, isIconOnly: boolean) => {
    const selectedIcon = getSelectedItem(value, items);
    return renderSelectValue(
      selectedIcon?.icon,
      selectedIcon?.label,
      config.selectedColor,
      config.selectedBgColor,
      isIconOnly
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
          selectedItem
            ? selectedValue(value, isIconOnly)
            : defaultValue(isIconOnly)
        }
        id={testId}
        data-testid={`${testId}${value ? `-${value}` : ""}`}
        onChange={handleOnChange}
        onOpen={handleOpenState(true)}
        onClose={handleOpenState(false)}
        open={isOpen}
        IconComponent={() => null}
        sx={{
          padding: 0,
          height: ICON_SELECT_DEFAULT_HEIGHT,
          border: `${border.xs} ${color.blue.darkSemiTransparent}`,
          borderRadius: borderRadius.small,
          backgroundColor: selectedItem
            ? color.blue.dark
            : color.white.sixTenTransparent,
          "& fieldset": {
            border: "none",
          },
          "& .MuiSelect-select": {
            // Need to override paddingRight to remove the default padding
            paddingRight: "0px !important",
            padding: "8px",
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
