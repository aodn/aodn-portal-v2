import * as React from "react";
import { Box, Grid, Typography } from "@mui/material";
import StoryBoard from "./StoryBoard";
import NotebookModel, {
  //NotebookModelCallbackProps,
  NotebookModelProps,
} from "../../../../components/common/ipython/NotebookModel";
import { padding } from "../../../../styles/constants";

const StoryBoardPanel = () => {
  const [value] = React.useState(0);
  const [notebook, setNotebook] = React.useState<NotebookModelProps>({
    showDialog: false,
  });

  // const handleChange = (event: React.SyntheticEvent, newValue: number) => {
  //   setValue(newValue);
  // };

  return (
    <Box sx={{ paddingY: padding.triple }}>
      <NotebookModel
        url={notebook.url}
        showDialog={notebook.showDialog}
        callback={() => setNotebook({ showDialog: false })}
      />
      <Grid container>
        <Grid
          item
          sx={{
            textAlign: "left",
          }}
          xs={12}
        >
          <StoryBoard
            isActive={value === 0}
            url="KtCb9TNuZsc"
            caption={
              <>
                <Typography variant="h4" component="em">
                  Data Story 01
                </Typography>
                <Typography variant="h4" fontWeight={600}>
                  OceanHackWeek 2023: Data Access{" "}
                </Typography>
                <Typography variant="h4" fontWeight={500}>
                  Marty Hidas
                </Typography>
              </>
            }
            content="This tutorial demonstrates several ways data can be accessed remotely and loaded into a Python environment, including OPeNDAP, OGC Web Feature Service (WFS), direct access to files on cloud storage (AWS S3), cloud-optimised formats Zarr & Parquet. The examples here use data from Australia's Integrated Marine Observing System (IMOS)"
            buttons={[
              {
                label: "iPython",
                onClick: () =>
                  setNotebook({
                    url: "https://raw.githubusercontent.com/oceanhackweek/ohw-tutorials/OHW23/01-Tue/Data_access_methods_Python.ipynb?raw=true",
                    showDialog: true,
                  }),
              },
              { label: "OGC Web Feature Service (WFS)" },
              { label: "S3" },
              { label: "Zarr" },
              { label: "Parquet" },
              { label: "OPeNDAP" },
            ]}
          />
          <StoryBoard
            isActive={value === 1}
            url="AGaLVYoM1E8"
            caption="Data Story 02 : What is Australias Integrated Marine Observing System (IMOS)?"
            content="What is Australias Integrated Marine Observing System (IMOS)?"
            buttons={[
              { label: "Metadata" },
              { label: "NISB maps" },
              { label: "netCDF" },
            ]}
          />
          <StoryBoard
            isActive={value === 2}
            url="xamjQ9hgEpk"
            caption="Data Story 03 : Integrated Marine Observing System (IMOS) Southern Ocean flux station buoy"
            content="IMOS is celebrating the successful retrieval of the first moored weather buoy deployed in the remote Southern Ocean.
                                        Marine and climate scientists are still analysing the wealth of data relayed back to shore by the South Ocean Flux Station about this climatically important region of the world. The data includes hourly observations of wind, temperature, humidity, air pressure, sunlight and rain."
            buttons={[
              { label: "Metadata" },
              { label: "NISB maps" },
              { label: "netCDF" },
            ]}
          />
        </Grid>
        <Grid item xs={12}>
          {/* <UnderlineTabs value={value} onChange={handleChange}>
            <UnderlineTab />
            <UnderlineTab />
            <UnderlineTab />
          </UnderlineTabs> */}
        </Grid>
      </Grid>
    </Box>
  );
};

export default StoryBoardPanel;
