import { FC } from "react";
import LabelChip from "@/components/common/label/LabelChip";
import { portalTheme } from "@/styles";

interface DownloadSourceChipProps {
  isImosOnly?: boolean;
  isIntegrated?: boolean;
}

const DownloadSourceChip: FC<DownloadSourceChipProps> = ({
  isImosOnly,
  isIntegrated,
}) => {
  let text = "External";
  let color = portalTheme.palette.warning.light;

  if (isImosOnly) {
    text = "IMOS";
    color = portalTheme.palette.tag3;
  } else if (isIntegrated) {
    text = "Integrated";
  }

  return (
    <LabelChip
      text={[text]}
      color={color}
      sx={{
        padding: "2px 8px",
        ...portalTheme.typography.body3Small,
      }}
    />
  );
};

export default DownloadSourceChip;
