import { Paper } from "@mui/material";
import { useDetailPageContext } from "../../context/detail-page-context";
import LinkCard from "../../../../components/list/listItem/subitem/LinkCard";
import { useState } from "react";

const LinksPanel = () => {
  const { collection } = useDetailPageContext();
  const links = collection?.getDistributionLinks();
  const [clickedCopyLinkButtonIndex, setClickedCopyLinkButtonIndex] = useState<
    number[]
  >([]);

  if (!links) return;

  return (
    <Paper elevation={0}>
      {links.map((link, index) => (
        <LinkCard
          key={index}
          index={index}
          link={link}
          clickedCopyLinkButtonIndex={clickedCopyLinkButtonIndex}
          setClickedCopyLinkButtonIndex={setClickedCopyLinkButtonIndex}
        />
      ))}
    </Paper>
  );
};

export default LinksPanel;
