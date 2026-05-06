import {
  FC,
  KeyboardEvent,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Box,
  ButtonBase,
  ClickAwayListener,
  FormControl,
  FormLabel,
  List,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import { CommonSelectProps } from "../../../../components/common/dropdown/CommonSelect";
import { portalTheme } from "../../../../styles";

interface DownloadSelectProps extends CommonSelectProps<string> {
  onOpenChange?: (open: boolean) => void;
}

const itemTextSx = {
  fontFamily: "Open Sans",
  fontSize: "14px",
  fontWeight: 400,
  lineHeight: "22px",
  color: "#090C02",
};

const truncateSx = {
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
};

const listItemButtonSx = {
  py: 0,
  my: "2px",
  mx: "8px",
  px: "6px",
  backgroundColor: "#FFF",
  ...itemTextSx,
  "& .MuiListItemText-root": { mt: 0, mb: 0 },
  "& .MuiListItemText-primary": {
    py: "4px",
    ...itemTextSx,
    ...truncateSx,
  },
  "&:hover": {
    backgroundColor: "rgba(0, 0, 0, 0.04)",
    borderRadius: "4px",
  },
  "&.Mui-selected, &.Mui-selected:hover": {
    backgroundColor: portalTheme.palette.primary5,
    borderRadius: "4px",
  },
};

const triggerSx = {
  width: "100%",
  height: "38px",
  px: "14px",
  justifyContent: "space-between",
  ...itemTextSx,
  transition: "background-color 120ms ease",
  "&:hover": {
    backgroundColor: "rgba(0, 0, 0, 0.04)",
  },
  "&:focus-visible": {
    outline: `2px solid ${portalTheme.palette.primary1}`,
    outlineOffset: "-2px",
  },
};

const listSx = {
  maxHeight: 300,
  overflowY: "auto",
  py: "4px",
  "&::-webkit-scrollbar": {
    width: "6px",
  },
  "&::-webkit-scrollbar-track": {
    background: "transparent",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    borderRadius: "3px",
  },
  "&::-webkit-scrollbar-thumb:hover": {
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
};

const emptyStateSx = {
  ...itemTextSx,
  color: "rgba(0, 0, 0, 0.5)",
  pt: 0,
  pb: 0,
  textAlign: "center",
};

const DownloadSelect: FC<DownloadSelectProps> = ({
  disabled,
  items,
  label,
  value,
  onSelectCallback,
  onOpenChange,
  dataTestId = "download-select",
}) => {
  const [open, setOpen] = useState(false);
  const [internalValue, setInternalValue] = useState<string | undefined>();

  // Derive during render — no effect needed. Falls back to items[0] when
  // the user hasn't picked yet, or when their pick is no longer in items.
  const currentValue = useMemo(() => {
    if (value !== undefined) return value;
    if (internalValue && items.some((item) => item.value === internalValue)) {
      return internalValue;
    }
    return items[0]?.value;
  }, [value, internalValue, items]);

  const selectedIndex = useMemo(
    () => items.findIndex((item) => item.value === currentValue),
    [items, currentValue]
  );
  const selectedLabel = items[selectedIndex]?.label ?? "";

  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const restoreFocusOnClose = useRef(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const listboxId = useId();

  const setOpenState = useCallback(
    (next: boolean, focusIndexOnOpen?: number) => {
      if (disabled) return;
      if (next === open) return;
      setOpen(next);
      onOpenChange?.(next);
      if (next) {
        setFocusedIndex(
          focusIndexOnOpen ?? (selectedIndex >= 0 ? selectedIndex : 0)
        );
      } else {
        setFocusedIndex(-1);
      }
    },
    [disabled, open, onOpenChange, selectedIndex]
  );

  // Move DOM focus to the focused item when the list is open.
  useEffect(() => {
    if (open && focusedIndex >= 0) {
      itemRefs.current[focusedIndex]?.focus();
    }
  }, [open, focusedIndex]);

  // Restore focus to the trigger after closing via Enter / Escape / item click
  // (deferred — trigger is display:none until the open→false render lands).
  useEffect(() => {
    if (!open && restoreFocusOnClose.current) {
      triggerRef.current?.focus();
      restoreFocusOnClose.current = false;
    }
  }, [open]);

  const handleSelect = useCallback(
    (newValue: string) => {
      setInternalValue(newValue);
      onSelectCallback?.(newValue);
      restoreFocusOnClose.current = true;
      setOpenState(false);
    },
    [onSelectCallback, setOpenState]
  );

  const handleClickAway = useCallback(() => {
    if (open) setOpenState(false);
  }, [open, setOpenState]);

  const handleTriggerKeyDown = useCallback(
    (e: KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setOpenState(true);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setOpenState(true, items.length - 1);
      }
    },
    [items.length, setOpenState]
  );

  const handleListKeyDown = useCallback(
    (e: KeyboardEvent<HTMLUListElement>) => {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setFocusedIndex((prev) => (prev + 1) % items.length);
          break;
        case "ArrowUp":
          e.preventDefault();
          setFocusedIndex((prev) => (prev - 1 + items.length) % items.length);
          break;
        case "Home":
          e.preventDefault();
          setFocusedIndex(0);
          break;
        case "End":
          e.preventDefault();
          setFocusedIndex(items.length - 1);
          break;
        case "Escape":
          e.preventDefault();
          restoreFocusOnClose.current = true;
          setOpenState(false);
          break;
        case "Tab":
          setOpenState(false);
          break;
      }
    },
    [items.length, setOpenState]
  );

  const containerSx = useMemo(
    () => ({
      backgroundColor: "#FFF",
      boxShadow: "1px 1px 4px 0 rgba(0, 0, 0, 0.25)",
      borderRadius: "6px",
      border: `1px solid ${open ? "#BFBFBF" : "transparent"}`,
      overflow: "hidden",
      opacity: disabled ? 0.5 : 1,
      transition: "border-color 120ms ease",
    }),
    [open, disabled]
  );

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <FormControl fullWidth disabled={disabled} data-testid={dataTestId}>
        {label && (
          <FormLabel sx={{ ...portalTheme.typography.title1Medium, pb: "9px" }}>
            {label}
          </FormLabel>
        )}
        <Box sx={containerSx}>
          <ButtonBase
            ref={triggerRef}
            onClick={() => setOpenState(!open)}
            onKeyDown={handleTriggerKeyDown}
            disabled={disabled}
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-controls={listboxId}
            sx={{
              ...triggerSx,
              display: open ? "none" : "flex",
            }}
          >
            <Box
              component="span"
              sx={{ textAlign: "start", flex: 1, ...truncateSx }}
            >
              {selectedLabel}
            </Box>
            <ExpandMore fontSize="small" />
          </ButtonBase>
          <List
            id={listboxId}
            disablePadding
            role="listbox"
            aria-label={label}
            onKeyDown={handleListKeyDown}
            sx={{ ...listSx, display: open ? "block" : "none" }}
          >
            {items.length === 0 ? (
              <Box sx={emptyStateSx}>No options</Box>
            ) : (
              items.map((item, index) => (
                <ListItemButton
                  key={item.value}
                  ref={(el) => {
                    itemRefs.current[index] = el;
                  }}
                  selected={item.value === currentValue}
                  onClick={() => handleSelect(item.value)}
                  role="option"
                  aria-selected={item.value === currentValue}
                  sx={listItemButtonSx}
                >
                  <ListItemText primary={item.label} />
                </ListItemButton>
              ))
            )}
          </List>
        </Box>
      </FormControl>
    </ClickAwayListener>
  );
};

export default DownloadSelect;
