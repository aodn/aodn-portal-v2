import { Grid, hexToRgb, Typography, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";

const RecordNotFoundPanel = () => {
  const theme = useTheme();
  const uuid = new URLSearchParams(location.search).get("uuid");
  const border = theme.border.detailNa.replace(
    "#52BDEC",
    theme.palette.warning.main
  );

  const rgba = alpha(hexToRgb(theme.palette.warning.main), 0.15);
  return (
    <Grid
      container
      sx={{
        backgroundColor: rgba,
        margin: theme.mp.xxlg,
        borderRadius: theme.borderRadius.sm,
        // width: "99%",
        height: "120px",
        // padding: `${theme.mp.sm} ${theme.mp.xlg}`,
        paddingY: theme.mp.xxlg,
        border: border,
      }}
    >
      <Grid
        item
        md={12}
        justifyContent="center"
        display="flex"
        alignContent="center"
      >
        <Typography variant="detailTitle" sx={{ fontWeight: 500 }}>
          There is no matching result for &quot;{uuid}&quot;
        </Typography>
      </Grid>
      <Grid
        item
        md={12}
        justifyContent="center"
        display="flex"
        alignContent="center"
      >
        <Typography variant="detailTitle" sx={{ fontWeight: 500 }}>
          Please check the related information
        </Typography>
      </Grid>
    </Grid>
  );
};

export default RecordNotFoundPanel;
