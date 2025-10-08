import { FC, useMemo } from "react";
import CommonSelect, {
  CommonSelectProps,
} from "../../../../../../components/common/dropdown/CommonSelect";
import { useTheme } from "@mui/material";
import rc8Theme from "../../../../../../styles/themeRC8";

interface DownloadSelectProps extends CommonSelectProps<string> {}

const DownloadSelect: FC<DownloadSelectProps> = ({
  disabled,
  items,
  label,
  value,
  onSelectCallback,
}) => {
  const theme = useTheme();

  const selectSxProps = useMemo(
    () => ({
      height: "38px",
      textAlign: "start",
      backgroundColor: "transparent",
      boxShadow: theme.shadows[5],
      border: "none",
    }),
    [theme]
  );

  const menuProps = useMemo(
    () => ({
      PaperProps: {
        sx: {
          backgroundColor: "#fff",
          border: "none",
          boxShadow: theme.shadows[5],
          mt: "6px",
          "& .MuiMenuItem-root": {
            color: rc8Theme.palette.text1,
            "&.Mui-selected": {
              backgroundColor: rc8Theme.palette.primary5,
            },
          },
        },
      },
    }),
    [theme]
  );

  return (
    <CommonSelect
      disabled={disabled}
      items={items}
      label={label}
      value={value}
      onSelectCallback={onSelectCallback}
      selectSx={selectSxProps}
      labelSx={{ ...rc8Theme.typography.title1Medium, pb: "9px" }}
      menuProps={menuProps}
    />
  );
};

export default DownloadSelect;
