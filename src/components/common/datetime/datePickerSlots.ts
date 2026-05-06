import theme from "../../../styles/themeRC8";

const paperStyle = {
  sx: {
    ".MuiDateCalendar-root": {
      backgroundColor: "#fff",
    },
    ".MuiPickersCalendarHeader-root": {
      marginTop: "8px",
    },
    // --- Year buttons ---
    ".MuiPickersYear-yearButton.MuiPickersYear-yearButton": {
      color: theme.palette.text1,
      padding: 0,
    },
    ".MuiPickersYear-yearButton.MuiPickersYear-yearButton:hover": {
      color: theme.palette.text1,
      backgroundColor: theme.palette.primary5,
    },
    ".MuiPickersYear-yearButton.MuiPickersYear-yearButton:focus-visible": {
      outline: `2px solid ${theme.palette.primary1}`,
      outlineOffset: "1px",
    },
    ".MuiPickersYear-yearButton.MuiPickersYear-yearButton.Mui-selected, .MuiPickersYear-yearButton.MuiPickersYear-yearButton.Mui-selected:hover, .MuiPickersYear-yearButton.MuiPickersYear-yearButton.Mui-selected:focus":
      {
        color: "#fff",
        backgroundColor: theme.palette.primary1,
      },
    ".MuiPickersYear-yearButton.MuiPickersYear-yearButton.Mui-disabled": {
      color: theme.palette.grey600,
    },
    // --- Month buttons ---
    ".MuiPickersMonth-monthButton.MuiPickersMonth-monthButton": {
      color: theme.palette.text1,
      padding: 0,
    },
    ".MuiPickersMonth-monthButton.MuiPickersMonth-monthButton:hover": {
      color: theme.palette.text1,
      backgroundColor: theme.palette.primary5,
    },
    ".MuiPickersMonth-monthButton.MuiPickersMonth-monthButton:focus-visible": {
      outline: `2px solid ${theme.palette.primary1}`,
      outlineOffset: "1px",
    },
    ".MuiPickersMonth-monthButton.MuiPickersMonth-monthButton.Mui-selected, .MuiPickersMonth-monthButton.MuiPickersMonth-monthButton.Mui-selected:hover, .MuiPickersMonth-monthButton.MuiPickersMonth-monthButton.Mui-selected:focus":
      {
        color: "#fff",
        backgroundColor: theme.palette.primary1,
      },
    ".MuiPickersMonth-monthButton.MuiPickersMonth-monthButton.Mui-disabled": {
      color: theme.palette.grey600,
    },
    // --- Day buttons ---
    ".MuiPickersDay-root.MuiPickersDay-root": {
      color: theme.palette.text1,
    },
    ".MuiPickersDay-root.MuiPickersDay-root:hover": {
      color: theme.palette.text1,
      backgroundColor: theme.palette.primary5,
    },
    ".MuiPickersDay-root.MuiPickersDay-root:focus-visible": {
      outline: `2px solid ${theme.palette.primary1}`,
      outlineOffset: "1px",
    },
    ".MuiPickersDay-root.MuiPickersDay-root.Mui-selected, .MuiPickersDay-root.MuiPickersDay-root.Mui-selected:hover, .MuiPickersDay-root.MuiPickersDay-root.Mui-selected:focus":
      {
        color: "#fff",
        backgroundColor: theme.palette.primary1,
      },
    ".MuiPickersDay-root.MuiPickersDay-root.Mui-disabled": {
      color: theme.palette.grey600,
    },
  },
  popper: {
    disablePortal: true,
    sx: {
      zIndex: 1400,
      "& .MuiPaper-root": {
        transform: "none !important",
      },
      "& .MuiPickersPopper-paper": {
        transformOrigin: "top left",
      },
    },
    modifiers: [
      {
        name: "preventOverflow",
        enabled: true,
        options: {
          altAxis: true,
          boundary: "clippingParents",
        },
      },
      {
        name: "offset",
        options: {
          offset: [0, 8],
        },
      },
    ],
  },
};

export const DEFAULT_DATE_PICKER_SLOT = {
  desktopPaper: paperStyle,
  mobilePaper: paperStyle,
};
