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
  ReactElement,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from "react";
import { CommonSelectProps, SelectItem } from "./CommonSelect";
import { borderRadius, color, margin } from "../../../styles/constants";
import { IconProps } from "../../icon/types";
import { mergeWithDefaults } from "../../../utils/ObjectUtils";
import { disableScroll, enableScroll } from "../../../utils/ScrollUtils";
import { portalTheme } from "../../../styles";

interface IconSelectColorConfig {
  defaultColor: string;
  displayColor: string;
  selectedColor: string;
  defaultBgColor: string;
  selectedBgColor: string;
}
const defaultColorConfig = {
  defaultColor: portalTheme.palette.text1,
  displayColor: portalTheme.palette.primary1,
  selectedColor: "#fff",
  defaultBgColor: "#FFF",
  selectedBgColor: portalTheme.palette.primary1,
};

export interface IconSelectProps<T = string> extends CommonSelectProps<T> {
  selectName: string;
  colorConfig?: IconSelectColorConfig;
  isIconOnly?: boolean;
}

export const ICON_SELECT_DEFAULT_HEIGHT = 40;

const getSelectedItem = <T extends string | number>(
  value: T,
  items: SelectItem<T>[]
) => {
  return items.find((item) => item.value === value);
};

// Function to render the icon wrapped in a Box
const renderIcon = (
  icon: ReactElement | FunctionComponent<IconProps> | undefined,
  color: string,
  iconBgColor: string,
  isIconOnly?: boolean
): ReactNode => {
  if (!icon) return null;

  // Handle React Element
  if (isValidElement(icon)) {
    return (
      <Box mr={isIconOnly ? 0 : margin.lg} mb={"-5px"}>
        {icon}
      </Box>
    );
  }

  // Handle FunctionComponent
  const IconComponent = icon as FunctionComponent<IconProps>;
  return (
    <Box mr={isIconOnly ? 0 : margin.lg} mb={"-5px"}>
      <IconComponent color={color} bgColor={iconBgColor} />
    </Box>
  );
};

const renderSelectValue = (
  icon: ReactElement | FunctionComponent<IconProps> | undefined,
  label: string | undefined,
  color: string,
  iconBgColor: string,
  isIconOnly?: boolean
) => {
  return (
    <Box
      display={isIconOnly ? "block" : "flex"}
      justifyContent={isIconOnly ? "center" : "flex-start"}
      alignItems="center"
      flexWrap="nowrap"
      gap={isIconOnly ? 0 : 1}
      //temp fix for mobile
      ml={isIconOnly ? "-3.2px" : 0}
      mt={isIconOnly ? "1px" : 0}
    >
      {renderIcon(icon, color, iconBgColor, isIconOnly)}
      {!isIconOnly && label && (
        <Box flex={1} minWidth={0} overflow="hidden" textAlign="center">
          <Typography
            variant="title2Regular"
            color={color}
            sx={{
              width: "100%",
              display: "block",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {label}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

const defaultValue = <T extends string | number = string>(
  selectName: string,
  items: SelectItem<T>[],
  config: IconSelectColorConfig,
  isIconOnly: boolean
) => {
  const defaultIcon = items[0].icon;
  return renderSelectValue(
    defaultIcon,
    selectName,
    config.defaultColor,
    config.defaultBgColor,
    isIconOnly
  );
};

const selectedValue = <T extends string | number = string>(
  value: T,
  items: SelectItem<T>[],
  config: IconSelectColorConfig,
  isIconOnly: boolean
) => {
  const selectedIcon = getSelectedItem(value, items);
  return renderSelectValue(
    selectedIcon?.icon,
    selectedIcon?.label,
    config.selectedColor,
    config.selectedBgColor,
    isIconOnly
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
  selectSx: sx,
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

  useEffect(() => {
    if (value) setSelectedItem(value);
  }, [value]);

  return (
    <FormControl fullWidth>
      <Select
        value={selectedItem || items[0]?.value}
        renderValue={(value) =>
          selectedItem
            ? selectedValue(value, items, config, isIconOnly)
            : defaultValue(selectName, items, config, isIconOnly)
        }
        id={testId}
        data-testid={`${testId}${value ? `-${value}` : ""}`}
        onChange={handleOnChange}
        onOpen={handleOpenState(true)}
        onClose={handleOpenState(false)}
        open={isOpen}
        IconComponent={() => null}
        MenuProps={{
          disablePortal: true,
          sx: {
            "& .MuiPaper-root": {
              marginTop: "6px",
              borderRadius: "6px",
              border: `0.5px solid ${portalTheme.palette.primary1}`,
              boxShadow: "0 2px 2px 0 rgba(0, 0, 0, 0.15)",
            },
          },
        }}
        sx={{
          padding: 0,
          height: ICON_SELECT_DEFAULT_HEIGHT,
          border: `0.5px solid ${portalTheme.palette.grey500}`,
          borderRadius: borderRadius.small,
          backgroundColor: selectedItem
            ? portalTheme.palette.primary1
            : color.white.sixTenTransparent,
          "& fieldset": {
            border: "none",
          },
          ...sx,
        }}
      >
        {items.map((item) => (
          <MenuItem
            key={item.value}
            value={item.value}
            data-testid={`menuitem-${item.value}`}
          >
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
