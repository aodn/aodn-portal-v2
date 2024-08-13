import { Grid, Link } from "@mui/material";
import { margin } from "../../styles/constants";
import React from "react";
import ExpandableList from "./ExpandableList";

interface LicenseListProps {
  license: string;
  url: string;
  graphic: string;
}

const LicenseList: React.FC<LicenseListProps> = ({ license, url, graphic }) => {
  const licenseComponent = () => {
    return (
      <Grid
        container
        sx={{
          width: "98%",
          backgroundColor: "#F2F6F9",
          margin: margin.lg,
          borderRadius: "var(----s, 4px)",
          color: "#676767",
          fontFamily: "Noto Sans",
        }}
      >
        <Grid item md={12}>
          <Grid container>
            <Grid item md={1} />
            <Grid container item md={11}>
              <Grid item md={12}>
                {license}
              </Grid>
              <Grid item md={12}>
                <Link
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  sx={{
                    color: "#468CB6",
                  }}
                >
                  {url}
                </Link>
              </Grid>
              <Grid item md={12}>
                {graphic && <img src={graphic} alt="license graphic" />}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  };
  return (
    <ExpandableList title={"License"} childrenList={[licenseComponent()]} />
  );
};

export default LicenseList;
