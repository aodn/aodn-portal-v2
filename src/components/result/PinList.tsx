import { FC } from "react";
import { Box } from "@mui/system";
import { borderRadius } from "../../styles/constants";
import { PinListButtonControlProps } from "../map/mapbox/controls/PinListButtonControl";
import PinListAccordionGroup from "../common/accordion/PinListAccordionGroup";
import { PIN_LIST_WIDTH } from "./constants";

interface PinListProps extends PinListButtonControlProps {}

const PinList: FC<PinListProps> = ({
  showList,
  pinList,
  selectedUuid,
  setSelectedUuid,
}) => {
  const hasContent = Array.isArray(pinList) && pinList.length > 0;
  if (!showList) return null;
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: PIN_LIST_WIDTH,
        borderRadius: borderRadius.menu,
        backgroundColor: "#fff",
        zIndex: 1,
      }}
    >
      {hasContent && (
        <PinListAccordionGroup
          pinList={pinList}
          selectedUuid={selectedUuid}
          setSelectedUuid={setSelectedUuid}
        />
      )}
    </Box>
  );
};

export default PinList;
