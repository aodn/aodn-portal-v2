import { Grid, Link, Typography, useTheme } from "@mui/material";
import React, { useMemo } from "react";
import ExpandableList from "./ExpandableList";
import ItemBaseGrid from "./listItem/ItemBaseGrid";
import { MODE } from "./CommonDef";
import NaList from "./NaList";

interface LicenseListProps {
  license?: string;
  url?: string;
  graphic?: string;
  title?: string;
  mode?: MODE;
}

const LicenseList: React.FC<LicenseListProps> = ({
  license,
  url,
  graphic,
  title = "License",
  mode = MODE.NORMAL,
}) => {
  const theme = useTheme();
  const licenseComponent = useMemo(() => {
    if (!license && !url && !graphic) {
      return null;
    }
    return (
      <ItemBaseGrid container key="licenseList">
        <Grid container item md={12}>
          {license && (
            <Grid item md={12}>
              <Typography variant="detailContent">{license}</Typography>
            </Grid>
          )}
          {url && (
            <Grid item md={12}>
              <Link href={url} target="_blank" rel="noreferrer">
                {url}
              </Link>
            </Grid>
          )}
          {graphic && (
            <Grid item md={12} sx={{ marginTop: theme.mp.md }}>
              {graphic && <img src={graphic} alt="license graphic" />}
            </Grid>
          )}
        </Grid>
      </ItemBaseGrid>
    );
  }, [graphic, license, theme.mp.md, url]);

  switch (mode) {
    case MODE.COMPACT:
      return (
        <>
          <Typography padding={1}>
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
          title={title}
          childrenList={licenseComponent ? [licenseComponent] : []}
        />
      );
  }
};

export default LicenseList;
