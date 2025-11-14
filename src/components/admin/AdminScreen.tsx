import React, { PropsWithChildren, useEffect, useState } from "react";
import {
  Box,
  Typography,
  FormControlLabel,
  Checkbox,
  Drawer,
} from "@mui/material";
import AdminScreenContext from "./AdminScreenContext";

interface AdminScreenProps {
  visible?: boolean;
}

const AdminScreen = ({
  visible = false,
  children,
}: PropsWithChildren<AdminScreenProps>) => {
  const [open, setOpen] = useState<boolean>(visible);
  const [enableGeoServerWhiteList, setEnableGeoServerWhiteList] =
    useState<boolean>(true);

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
      value={{ enableGeoServerWhiteList: enableGeoServerWhiteList }}
    >
      <Drawer anchor="left" open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            width: "90%",
            height: "90%",
            justifyContent: "center",
            backgroundColor: "white",
          }}
        >
          <Typography variant="h5">Global Settings</Typography>
          <FormControlLabel
            control={
              <Checkbox
                checked={enableGeoServerWhiteList}
                onClick={() => setEnableGeoServerWhiteList((v) => !v)}
              />
            }
            label="Geoserver White List"
          />
        </Box>
      </Drawer>
      {children}
    </AdminScreenContext.Provider>
  );
};

export default AdminScreen;
