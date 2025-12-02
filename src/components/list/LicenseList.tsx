import { Grid, Link, Typography, useTheme } from "@mui/material";
import React, { useMemo } from "react";
import ExpandableList from "./ExpandableList";
import ItemBaseGrid from "./listItem/ItemBaseGrid";
import { MODE } from "./CommonDef";
import NaList from "./NaList";
import rc8Theme from "../../styles/themeRC8";
import CopyButton from "../common/buttons/CopyButton";
import { openInNewTab } from "../../utils/LinkUtils";

interface LicenseListProps {
  license?: string;
  url?: string;
  graphic?: string;
  title?: string;
  selected?: boolean;
  mode?: MODE;
}

const LicenseList: React.FC<LicenseListProps> = ({
  license,
  url,
  graphic,
  title = "License",
  selected = false,
  mode = MODE.NORMAL,
}) => {
  const theme = useTheme();

  const licenseComponent = useMemo(() => {
    if (!license && !url && !graphic) {
      return null;
    }

    const licenseCopyContent = `${license} ${url}`;

    return (
      <ItemBaseGrid
        container
        key="licenseList"
        disableHover={mode === MODE.COMPACT}
      >
        <Grid container item xs={12}>
          {license && (
            <Grid item xs={12}>
              <Typography
                variant="body2Regular"
                sx={{ color: rc8Theme.palette.text1 }}
              >
                {license}
              </Typography>
            </Grid>
          )}
          {url && (
            <Grid
              item
              xs={12}
              sx={{ overflowWrap: "break-word", overflow: "hidden" }}
            >
              <Link href={url} target="_blank" rel="noreferrer">
                {url}
              </Link>
              <CopyButton
                copyText={licenseCopyContent}
                copyButtonConfig={{
                  tooltipText: ["Copy license", "License copied"],
                }}
              />
            </Grid>
          )}
          {graphic && (
            <Grid item xs={12} sx={{ marginTop: theme.mp.md }}>
              {graphic && <img src={graphic} alt="license graphic" />}
            </Grid>
          )}
        </Grid>
      </ItemBaseGrid>
    );
  }, [license, url, graphic, mode, theme]);

  switch (mode) {
    case MODE.COMPACT:
      return (
        <>
          <Typography
            variant="title1Medium"
            sx={{ color: rc8Theme.palette.text1 }}
          >
            {title}
            {!licenseComponent ? (
              <NaList title={title ? title : ""} />
            ) : (
              licenseComponent
            )}
          </Typography>
        </>
      );

    case MODE.NORMAL:
    default:
      return (
        <ExpandableList
          selected={selected}
          title={title}
          childrenList={licenseComponent ? [licenseComponent] : []}
        />
      );
  }
};

export default LicenseList;
