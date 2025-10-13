import React, { ReactNode } from "react";
import TiltedChainIcon from "../../icon/TiltedChainIcon";
import CollapseItem from "./CollapseItem";
import rc8Theme from "../../../styles/themeRC8";

interface CollapseAssociatedRecordItemProps {
  title: string;
  titleAction: () => void;
  children: ReactNode;
}

const CollapseAssociatedRecordItem: React.FC<
  CollapseAssociatedRecordItemProps
> = ({ title, titleAction, children }) => {
  return (
    <CollapseItem
      title={title}
      icon={<TiltedChainIcon />}
      onIconClick={titleAction}
      useBaseGrid={false}
      titleColor={rc8Theme.palette.primary1}
      collapseBtnColor={rc8Theme.palette.primary1}
    >
      {children}
    </CollapseItem>
  );
};

export default CollapseAssociatedRecordItem;
