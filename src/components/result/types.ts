import { SxProps } from "@mui/material";
import { OGCCollection } from "@/app/store/OGCCollectionDefinitions";
import { OpenType } from "../../hooks/useTabNavigation";

export interface ResultCardBasicProps {
  selectedUuid?: string;
  sx?: SxProps;
  isSimplified?: boolean;
}

export interface ResultCardBasicEvent {
  onClickCard?: (item: OGCCollection | undefined) => void;
  onMouseEnterCard?: (item: OGCCollection | undefined) => void;
  onMouseLeaveCard?: (item: OGCCollection | undefined) => void;
  onClickDetail?: (uuid: string, type?: OpenType) => void;
  onClickDownload?: (uuid: string, type?: OpenType) => void;
  onClickLinks?: (uuid: string, type?: OpenType) => void;
}

export interface ResultCardBasicType
  extends ResultCardBasicEvent, ResultCardBasicProps {
  content?: OGCCollection;
}
