import { FC } from "react";
import { Box } from "@mui/system";
import { borderRadius } from "../../styles/constants";
import { PinListButtonControlProps } from "../map/mapbox/controls/PinListButtonControl";
import ComplexMapHoverTip from "../common/hover-tip/ComplexMapHoverTip";

interface PinListProps extends PinListButtonControlProps {}

const PinList: FC<PinListProps> = ({ showList, datasetsSelected }) => {
  const hasSelectedDatasets =
    Array.isArray(datasetsSelected) && datasetsSelected.length > 0;
  if (!showList) return null;
  return (
    <Box
      sx={{
        display: "flex",
        height: 370,
        width: 250,
        borderRadius: borderRadius.menu,
        backgroundColor: "#fff",
        zIndex: 1,
      }}
    >
      {hasSelectedDatasets && (
        <ComplexMapHoverTip collection={datasetsSelected[0]} />
      )}
    </Box>
  );
};

export default PinList;
