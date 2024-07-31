import React, { ReactNode } from "react";
import PlainTextFragment from "./PlainTextFragment";
import BlockList from "./BlockList";
import { Link } from "@mui/material";

interface PlainLinkBlockProps {
  url: string;
}

const PlainLinkBlock: React.FC<PlainLinkBlockProps> = ({ url }) => {
  const link: ReactNode[] = [];
  link.push(
    <PlainTextFragment>
      <Link href={url} target="_blank" rel="noopener noreferrer">
        {url}
      </Link>
    </PlainTextFragment>
  );

  return <BlockList title={"Full Metadata Link"} childrenList={link} />;
};

export default PlainLinkBlock;
