import { FC, useMemo } from "react";
import CommonSelect, {
  CommonSelectProps,
} from "../../../../components/common/dropdown/CommonSelect";
import { useTheme } from "@mui/material";
import { portalTheme } from "../../../../styles";

type DownloadSelectProps = CommonSelectProps<string>;

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
          backgroundColor: theme.palette.background.paper,
          boxShadow: theme.shadows[5],
          mt: "6px",
          "& .MuiList-root": {
            py: "4px",
          },
          "& .MuiMenuItem-root": {
            ...portalTheme.typography.body1Medium,
            my: "2px",
            mx: "4px",
            borderRadius: "4px",
            "&.Mui-selected, &.Mui-selected:hover": {
              backgroundColor: portalTheme.palette.primary5,
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
      labelSx={{
        ...portalTheme.typography.title1Medium,
        pb: "9px",
        "&.Mui-focused": { color: portalTheme.typography.title1Medium.color },
      }}
      menuProps={menuProps}
    />
  );
};

export default DownloadSelect;
