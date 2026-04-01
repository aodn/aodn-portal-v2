import React, { PropsWithChildren, useEffect, useState, useRef } from "react";
import {
  Box,
  Typography,
  FormControlLabel,
  Checkbox,
  Drawer,
  TextField,
  Divider,
} from "@mui/material";
import AdminScreenContext from "./AdminScreenContext";

interface AdminScreenProps {
  visible?: boolean;
}

// This needs to be const function and global to avoid re-render
const DEFAULT_MAX_MAP_CENTROIDS = 1000;
let maxMapCentroids = DEFAULT_MAX_MAP_CENTROIDS;
const getMaxMapCentroids = () => maxMapCentroids;
const setMaxMapCentroids = (max: number) => (maxMapCentroids = max);

const AdminScreen = ({
  visible = false,
  children,
}: PropsWithChildren<AdminScreenProps>) => {
  const [open, setOpen] = useState<boolean>(visible);
  const inputMapMaxCentroidRef = useRef<HTMLInputElement>(null);
  const [enableGeoServerWhiteList, setEnableGeoServerWhiteList] =
    useState<boolean>(true);
  const [defaultMaxMapCentroids, setDefaultMaxMapCentroids] = useState<number>(
    DEFAULT_MAX_MAP_CENTROIDS
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === "G") {
        e.preventDefault();
        setOpen(true);
      }
    };
    document.addEventListener("keydown", handler);
    return () => {
      document.removeEventListener("keydown", handler);
    };
  }, []);

  return (
    <AdminScreenContext.Provider
      value={{
        enableGeoServerWhiteList: enableGeoServerWhiteList,
        getMaxMapCentroids: getMaxMapCentroids,
      }}
    >
      <Drawer
        anchor="left"
        open={open}
        onClose={() => {
          if (inputMapMaxCentroidRef.current) {
            const num = Number(inputMapMaxCentroidRef.current.value);
            setDefaultMaxMapCentroids(
              isNaN(num) ? DEFAULT_MAX_MAP_CENTROIDS : num
            );
            setMaxMapCentroids(isNaN(num) ? DEFAULT_MAX_MAP_CENTROIDS : num);
          }
          setOpen(false);
        }}
      >
        <Box
          component="section"
          sx={{
            mx: 2,
            width: "90%",
            height: "90%",
            justifyContent: "center",
            backgroundColor: "white",
          }}
        >
          <Typography variant="h5">Global Settings</Typography>
          <Divider sx={{ my: 1 }} />
          <FormControlLabel
            sx={{ my: 2 }}
            control={
              <Checkbox
                checked={enableGeoServerWhiteList}
                onClick={() => setEnableGeoServerWhiteList((v) => !v)}
              />
            }
            label="Geoserver White List"
          />
          <TextField
            label="Map Max Centroid Points"
            variant="outlined"
            defaultValue={defaultMaxMapCentroids}
            inputRef={inputMapMaxCentroidRef}
          />
        </Box>
      </Drawer>
      {children}
    </AdminScreenContext.Provider>
  );
};

export default AdminScreen;
