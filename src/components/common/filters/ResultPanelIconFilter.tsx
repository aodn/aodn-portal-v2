import { Grid, Stack } from "@mui/material";

import dateTime from "@/assets/logos/time-range.png";
import depth from "@/assets/logos/depth.png";
import dataSettings from "@/assets/logos/data-settings.png";
import parameter from "@/assets/logos/parameter.png";
import { SmallCard } from "../../../pages/landing-page/subpages/smartpanel/SmartCard";
import { border, color, fontColor } from "../../../styles/constants";

type IconFilters = {
  title: string;
  icon: string;
};
const ICON_FILTERS: IconFilters[] = [
  { title: "Date Range", icon: dateTime },
  { title: "Depth", icon: depth },
  { title: "Data Settings", icon: dataSettings },
  { title: "Parameter", icon: parameter },
];
const ResultPanelIconFilter = () => {
  return (
    <Grid container sx={{ pl: 2 }}>
      <Grid item xs={12}>
        <Stack direction="column" spacing={2}>
          {ICON_FILTERS.map((item: IconFilters) => (
            <SmallCard
              key={item.title}
              title={item.title}
              icon={item.icon}
              containerStyle={{
                border: `${border.sm} ${color.blue.darkSemiTransparent}`,
                bgcolor: color.white.sixTenTransparent,
              }}
              typoStyle={{ color: fontColor.gray.light }}
            />
          ))}
        </Stack>
      </Grid>
    </Grid>
  );
};

export default ResultPanelIconFilter;
