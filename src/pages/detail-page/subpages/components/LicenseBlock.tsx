import { Grid, Link } from "@mui/material";
import { margin } from "../../../../styles/constants";
import { ILicense } from "../../../../components/common/store/OGCCollectionDefinitions";
import React from "react";
import BlockList from "./BlockList";

interface LicenseBlockProps {
  license: ILicense;
}

const LicenseBlock: React.FC<LicenseBlockProps> = ({ license }) => {
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
                {license.title}
              </Grid>
              <Grid item md={12}>
                <Link
                  href={license.url}
                  target="_blank"
                  rel="noreferrer"
                  sx={{
                    color: "#468CB6",
                  }}
                >
                  {license.url}
                </Link>
              </Grid>
              <Grid item md={12}>
                <img src={license.licenseGraphic} alt="license graphic" />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  };
  return <BlockList title={"License"} childrenList={[licenseComponent()]} />;
};

export default LicenseBlock;
