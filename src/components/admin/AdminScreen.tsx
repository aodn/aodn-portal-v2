import { PropsWithChildren, startTransition, useEffect, useState } from "react";
import {
  Box,
  Typography,
  Drawer,
  TextField,
  Divider,
  IconButton,
  Switch,
  Paper,
  Button,
  Chip,
  Stack,
} from "@mui/material";
import AdminPanelSettings from "@mui/icons-material/AdminPanelSettings";
import Close from "@mui/icons-material/Close";
import Security from "@mui/icons-material/Security";
import Map from "@mui/icons-material/Map";
import Keyboard from "@mui/icons-material/Keyboard";
import RestartAlt from "@mui/icons-material/RestartAlt";
import AdminScreenContext from "./AdminScreenContext";

interface AdminScreenProps {
  visible?: boolean;
}

// This needs to be const function and global to avoid re-render
const DEFAULT_MAX_MAP_CENTROIDS = 800;
let maxMapCentroids = DEFAULT_MAX_MAP_CENTROIDS;
const getMaxMapCentroids = () => maxMapCentroids;
const setMaxMapCentroids = (max: number) => (maxMapCentroids = max);

const AdminScreen = ({
  visible = false,
  children,
}: PropsWithChildren<AdminScreenProps>) => {
  const [open, setOpen] = useState<boolean>(visible);
  const [enableGeoServerWhiteList, setEnableGeoServerWhiteList] =
    useState<boolean>(true);
  const [centroidValue, setCentroidValue] = useState<string>(
    DEFAULT_MAX_MAP_CENTROIDS.toString()
  );
  const [centroidError, setCentroidError] = useState<string>("");

  useEffect(() => {
    startTransition(() => setOpen(visible));
  }, [visible]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === "G") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", handler);
    return () => {
      document.removeEventListener("keydown", handler);
    };
  }, []);

  const applyCentroidValue = (val: number) => {
    setCentroidValue(val.toString());
    setCentroidError("");
    setMaxMapCentroids(val);
  };

  const handleCentroidChange = (valStr: string) => {
    setCentroidValue(valStr);
    const num = Number(valStr);
    if (valStr === "" || isNaN(num) || num <= 0) {
      setCentroidError("Must be a positive number");
    } else {
      setCentroidError("");
      setMaxMapCentroids(num);
    }
  };

  const handleResetDefaults = () => {
    setEnableGeoServerWhiteList(true);
    applyCentroidValue(DEFAULT_MAX_MAP_CENTROIDS);
  };

  const handleClose = () => {
    const num = Number(centroidValue);
    if (isNaN(num) || num <= 0) {
      applyCentroidValue(DEFAULT_MAX_MAP_CENTROIDS);
    } else {
      setMaxMapCentroids(num);
    }
    setOpen(false);
  };

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
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: { xs: "100%", sm: 440 },
            boxSizing: "border-box",
            backgroundColor: "#f8fafc",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              p: 2.5,
              pb: 2,
              backgroundColor: "white",
              borderBottom: "1px solid",
              borderColor: "divider",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <AdminPanelSettings color="primary" sx={{ fontSize: 28 }} />
              <Box>
                <Typography variant="h6" fontWeight="bold" lineHeight={1.2}>
                  Admin & Debug Settings
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Developer tools & system configurations
                </Typography>
              </Box>
            </Box>
            <IconButton
              onClick={handleClose}
              size="small"
              aria-label="Close settings"
            >
              <Close />
            </IconButton>
          </Box>

          {/* Scrollable Content Body */}
          <Box
            sx={{
              flexGrow: 1,
              overflowY: "auto",
              p: 2.5,
              display: "flex",
              flexDirection: "column",
              gap: 2.5,
            }}
          >
            {/* Section 1: Network & Access Control */}
            <Paper
              elevation={0}
              sx={{
                p: 2,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                backgroundColor: "white",
              }}
            >
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}
              >
                <Security color="action" fontSize="small" />
                <Typography variant="subtitle2" fontWeight="600">
                  Network & Access Control
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                }}
              >
                <Box sx={{ pr: 2 }}>
                  <Typography variant="body2" fontWeight="500">
                    GeoServer Whitelist
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                    sx={{ mt: 0.5 }}
                  >
                    Enforce domain whitelist check for GeoServer requests and
                    layer download services.
                  </Typography>
                </Box>
                <Switch
                  checked={enableGeoServerWhiteList}
                  onChange={(e) =>
                    setEnableGeoServerWhiteList(e.target.checked)
                  }
                  color="primary"
                />
              </Box>
            </Paper>

            {/* Section 2: Map & Spatial Performance */}
            <Paper
              elevation={0}
              sx={{
                p: 2,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                backgroundColor: "white",
              }}
            >
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}
              >
                <Map color="action" fontSize="small" />
                <Typography variant="subtitle2" fontWeight="600">
                  Map Performance Settings
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                <Typography variant="body2" fontWeight="500">
                  Map Max Centroid Points
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Maximum centroid markers rendered on search map before
                  aggregation occurs.
                </Typography>
                <TextField
                  size="small"
                  type="number"
                  value={centroidValue}
                  onChange={(e) => handleCentroidChange(e.target.value)}
                  error={!!centroidError}
                  helperText={centroidError || "Default: 800 points"}
                  fullWidth
                  inputProps={{ min: 1, max: 100000 }}
                />
                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    flexWrap: "wrap",
                    alignItems: "center",
                    mt: 0.5,
                  }}
                >
                  <Typography variant="caption" color="text.secondary">
                    Presets:
                  </Typography>
                  {[500, 800, 1500, 3000].map((val) => (
                    <Chip
                      key={val}
                      label={`${val}`}
                      size="small"
                      variant={
                        Number(centroidValue) === val ? "filled" : "outlined"
                      }
                      color={
                        Number(centroidValue) === val ? "primary" : "default"
                      }
                      onClick={() => applyCentroidValue(val)}
                      clickable
                    />
                  ))}
                </Box>
              </Box>
            </Paper>

            {/* Section 3: Keyboard Shortcuts */}
            <Paper
              elevation={0}
              sx={{
                p: 2,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                backgroundColor: "white",
              }}
            >
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}
              >
                <Keyboard color="action" fontSize="small" />
                <Typography variant="subtitle2" fontWeight="600">
                  Keyboard Shortcuts
                </Typography>
              </Box>
              <Divider sx={{ mb: 1.5 }} />
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Toggle Admin Panel
                </Typography>
                <Stack direction="row" spacing={0.5}>
                  <Chip
                    label="Ctrl"
                    size="small"
                    variant="outlined"
                    sx={{
                      height: 22,
                      fontSize: "0.7rem",
                      fontFamily: "monospace",
                    }}
                  />
                  <Chip
                    label="Shift"
                    size="small"
                    variant="outlined"
                    sx={{
                      height: 22,
                      fontSize: "0.7rem",
                      fontFamily: "monospace",
                    }}
                  />
                  <Chip
                    label="G"
                    size="small"
                    variant="outlined"
                    sx={{
                      height: 22,
                      fontSize: "0.7rem",
                      fontFamily: "monospace",
                    }}
                  />
                </Stack>
              </Box>
            </Paper>
          </Box>

          {/* Footer */}
          <Box
            sx={{
              p: 2,
              backgroundColor: "white",
              borderTop: "1px solid",
              borderColor: "divider",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Button
              size="small"
              color="inherit"
              startIcon={<RestartAlt fontSize="small" />}
              onClick={handleResetDefaults}
            >
              Reset Defaults
            </Button>
            <Button variant="contained" size="small" onClick={handleClose}>
              Close
            </Button>
          </Box>
        </Box>
      </Drawer>
      {children}
    </AdminScreenContext.Provider>
  );
};

export default AdminScreen;
