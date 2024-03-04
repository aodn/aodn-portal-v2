import * as React from 'react';
import { Grid } from '@mui/material';
import StoryBoard from './StoryBoard';
import { margin } from '../common/constants';
import { UnderlineTab, UnderlineTabs } from '../common/tabs/UnderlineTabs';
import NotebookModel, {
  NotebookModelCallbackProps,
  NotebookModelProps,
} from '../common/ipython/NotebookModel';

const StoryBoardPanel = () => {
  const [value, setValue] = React.useState(0);
  const [notebook, setNotebook] = React.useState<NotebookModelProps>({
    showDialog: false,
  });

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <>
      <NotebookModel
        url={notebook.url}
        showDialog={notebook.showDialog}
        callback={(p: NotebookModelCallbackProps) =>
          setNotebook({ showDialog: false })
        }
      />
      <Grid
        container
        sx={{
          backgroundColor: 'white',
        }}
      >
        <Grid item xs={12}>
          <Grid
            container
            justifyContent="center"
            marginTop={margin['tripleTop']}
            marginBottom={margin['tripleBottom']}
          >
            <Grid
              item
              xs={8}
              sx={{
                textAlign: 'left',
              }}
            >
              <StoryBoard
                isActive={value === 0}
                url="https://www.youtube.com/embed/KtCb9TNuZsc?si=tsc-AtRie1HOhl8e"
                caption={
                  <>
                    Data Story 01
                    <br />
                    OceanHackWeek 2023: Data Access <br />
                    Marty Hidas
                  </>
                }
                content="This tutorial demostrates several ways data can be accessed remotely and loaded into a Python environment , direct access to files on cloud storage (AWS S3), cloud-optimised formats Zarr & Parquet"
                buttons={[
                  {
                    label: 'iPython',
                    onClick: (event) =>
                      setNotebook({
                        url: 'https://raw.githubusercontent.com/oceanhackweek/ohw-tutorials/OHW23/01-Tue/Data_access_methods_Python.ipynb?raw=true',
                        showDialog: true,
                      }),
                  },
                  { label: 'OGC Web Feature Service (WFS)' },
                  { label: 'S3' },
                  { label: 'Zarr' },
                  { label: 'Parquet' },
                  { label: 'OPeNDAP' },
                ]}
              />
              <StoryBoard
                isActive={value === 1}
                url="https://www.youtube.com/embed/AGaLVYoM1E8?si=wcqO_3BhCLdK88e7"
                caption="Data Story 02 : What is Australias Integrated Marine Observing System (IMOS)?"
                content="What is Australias Integrated Marine Observing System (IMOS)?"
                buttons={[
                  { label: 'Metadata' },
                  { label: 'NISB maps' },
                  { label: 'netCDF' },
                ]}
              />
              <StoryBoard
                isActive={value === 2}
                url="https://www.youtube.com/embed/xamjQ9hgEpk?si=QDvoDzO0bpzLVhGS"
                caption="Data Story 03 : Integrated Marine Observing System (IMOS) Southern Ocean flux station buoy"
                content="IMOS is celebrating the successful retrieval of the first moored weather buoy deployed in the remote Southern Ocean.
                                        Marine and climate scientists are still analysing the wealth of data relayed back to shore by the South Ocean Flux Station about this climatically important region of the world. The data includes hourly observations of wind, temperature, humidity, air pressure, sunlight and rain."
                buttons={[
                  { label: 'Metadata' },
                  { label: 'NISB maps' },
                  { label: 'netCDF' },
                ]}
              />
            </Grid>
            <Grid item xs={6}>
              <UnderlineTabs value={value} onChange={handleChange}>
                <UnderlineTab />
                <UnderlineTab />
                <UnderlineTab />
              </UnderlineTabs>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default StoryBoardPanel;
