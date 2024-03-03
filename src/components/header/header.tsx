import { Box, Container, Divider, Grid, Typography } from '@mui/material';

const Header = () => {
  return (
    <Box
      sx={{
        backgroundColor: '#FFFFFF',
        color: 'primary.main',
        padding: '10px 0',
      }}
    >
      <Container>
        <Grid container spacing={2}>
          <Grid item alignContent="left" xs={12}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                color: 'primary.main',
                '& svg': {
                  m: 1,
                },
                '& hr': {
                  mx: 0.5,
                },
              }}
            >
              <a href="/">
                <img
                  height="40px"
                  src="public\logo\imos_logo.png"
                  alt="IMOS Logo"
                  style={{ padding: '10px' }}
                />
              </a>
              <Divider orientation="vertical" flexItem></Divider>
              <Typography
                variant="h6"
                component="h1"
                textAlign="left"
                fontWeight="300"
                padding="10px"
              >
                Australian Ocean <br />
                Data Network
              </Typography>
            </Box>
          </Grid>
          {/* This is where the menu items/links will go */}
          <Grid item xs={12} sm={6} md={6}></Grid>
          {/* This is where the login/logout buttons or profile will go */}
          <Grid item xs={12} sm={6} md={3}></Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Header;
