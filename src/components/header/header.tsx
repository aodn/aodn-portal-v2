import { Box, Container, Divider, Grid, Typography } from "@mui/material";
import IMOS from "@/assets/logos/imos-logo.png";
import { StyledButton } from "../menu/StyledMenu";

type HeaderProps = {
  isLandingPage?: boolean;
};

const Header = ({ isLandingPage }: HeaderProps) => {
  return (
    <Box
      sx={{
        backgroundColor: "#FFFFFF",
        color: "primary.main",
        padding: "10px 0",
      }}
    >
      <Container>
        <Grid container>
          <Grid item alignContent="left" xs={12} sm={4}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                color: "primary.main",
                "& svg": {
                  m: 1,
                },
                "& hr": {
                  mx: 0.5,
                },
              }}
            >
              <a href="/">
                <img
                  height="40px"
                  src={IMOS}
                  alt="IMOS Logo"
                  style={{ padding: "10px" }}
                />
              </a>
              <Divider orientation="vertical" flexItem></Divider>
              <Typography
                variant="h6"
                component="h1"
                textAlign="left"
                fontWeight="300"
                padding="10px"
                lineHeight="1.2"
              >
                Australian Ocean <br />
                Data Network
              </Typography>
            </Box>
          </Grid>
          {/* This is where the menu items/links will go */}
          <Grid item xs={12} sm={8} md={7}>
            {!isLandingPage && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-evenly",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <StyledButton
                  name={"Data"}
                  items={[{ name: "Item1", handler: () => {} }]}
                />

                <StyledButton
                  name={"Learn"}
                  items={[{ name: "Item1", handler: () => {} }]}
                />

                <StyledButton
                  name={"Engage"}
                  items={[{ name: "Item1", handler: () => {} }]}
                />

                <StyledButton
                  name={"Contact"}
                  items={[{ name: "Item1", handler: () => {} }]}
                />

                <StyledButton
                  name={"About"}
                  items={[{ name: "Item1", handler: () => {} }]}
                />
              </Box>
            )}
          </Grid>
          {/* This is where the login/logout buttons or profile will go */}
          <Grid item xs={12} sm={6} md={3}></Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Header;
