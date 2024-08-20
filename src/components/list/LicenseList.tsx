import { Grid, Link, Typography, useTheme } from "@mui/material";
import React, { useMemo } from "react";
import ExpandableList from "./ExpandableList";
import StyledItemGrid from "./listItem/StyledItemGrid";

interface LicenseListProps {
  license: string;
  url: string;
  graphic: string;
}

const LicenseList: React.FC<LicenseListProps> = ({ license, url, graphic }) => {
  const theme = useTheme();
  const licenseComponent = useMemo(() => {
    if (!license && !url && !graphic) {
      return null;
    }
    return (
      <StyledItemGrid container key="licenseList">
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
      </StyledItemGrid>
    );
  }, [graphic, license, theme.mp.md, url]);
  return (
    <ExpandableList
      title={"License"}
      childrenList={licenseComponent ? [licenseComponent] : []}
    />
  );
};

export default LicenseList;
