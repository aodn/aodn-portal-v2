import { SvgIcon, useTheme } from "@mui/material";

const NoSuchDataIcon = () => {
  const theme = useTheme();
  return (
    <SvgIcon
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      fill="none"
    >
      <circle cx="50" cy="50" r="45" fill={theme.palette.detail.na.dark} />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dy=".3em"
        fontSize="30"
        fill="transparent"
        stroke="white"
        strokeWidth="2"
      >
        N / A
      </text>
    </SvgIcon>
  );
};

export default NoSuchDataIcon;
