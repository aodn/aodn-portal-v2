import { SxProps } from "@mui/material";
import { OGCCollection } from "@/app/store/OGCCollectionDefinitions";
import { OpenType } from "../../hooks/useTabNavigation";

export interface ResultCardBasicType {
  content?: OGCCollection;
  onClickCard?: (item: OGCCollection | undefined) => void;
  onClickDetail?: (uuid: string, type?: OpenType) => void;
  onClickDownload?: (uuid: string, type?: OpenType) => void;
  onClickLinks?: (uuid: string, type?: OpenType) => void;
  selectedUuid?: string;
  sx?: SxProps;
  isSimplified?: boolean;
}
