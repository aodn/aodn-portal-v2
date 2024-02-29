import {
  Box,
  Container,
  Grid,
  IconButton,
  Link,
  List,
  Typography,
} from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import XIcon from '@mui/icons-material/X';
//import YouTubeIcon from '@mui/icons-material/YouTube';

const Footer = () => {
  return (
    <Box
      sx={{
        backgroundColor: '#F4F5F6',
        color: 'primary.main',
        padding: '50px 0',
      }}
    >
      <Container>
        <Grid container spacing={2}>
          <Grid textAlign="left" item xs={12}>
            <Typography
              variant="h5"
              component="h1"
              textAlign="left"
              fontWeight="700"
              padding="20px 0 20 0"
            >
              Australian Ocean Data Network
            </Typography>
          </Grid>
          <Grid textAlign="left" item xs={12} sm={6} md={3}>
            <List>
              <Typography variant="h6">Contact Us</Typography>
              <Typography variant="body1" padding="20px 0 0 0">
                <Link href="mailto:contact@aodn.org.au">
                  contact@aodn.org.au
                </Link>
              </Typography>
              <Typography variant="body1" padding="20px 0 0 0">
                +61 3 6226 7549
              </Typography>
              <Typography variant="body1" padding="20px 0 0 0">
                20 Castray Esplanade, <br />
                Battery Point, TAS, 7004
              </Typography>
            </List>
          </Grid>
          <Grid textAlign="left" item xs={12} sm={6} md={3}>
            <Typography variant="h6" padding="10px 0 0 0">
              Data
            </Typography>
            {/* This is where the menu items/links for 'Data' will go */}
            <Typography variant="body1">
              <Link color="#F4F5F6" href="#">
                Link 1
              </Link>
            </Typography>
            <Typography variant="body1">
              <Link color="#F4F5F6" href="#">
                Link 2
              </Link>
            </Typography>
            <Typography variant="body1">
              <Link color="#F4F5F6" href="#">
                Link 3
              </Link>
            </Typography>
          </Grid>
          <Grid textAlign="left" item xs={12} sm={6} md={3}>
            <Typography variant="h6" padding="10px 0 0 0">
              Learn
            </Typography>
            {/* This is where the menu items/links for 'Learn' will go */}
            <Typography variant="body1">
              <Link color="#F4F5F6" href="#">
                Link 1
              </Link>
            </Typography>
            <Typography variant="body1">
              <Link color="#F4F5F6" href="#">
                Link 2
              </Link>
            </Typography>
            <Typography variant="body1">
              <Link color="#F4F5F6" href="#">
                Link 3
              </Link>
            </Typography>
          </Grid>
          <Grid textAlign="left" item xs={12} sm={6} md={3}>
            <Typography variant="h6" padding="10px 0 0 0">
              About
            </Typography>
            <Typography variant="body1">
              <Link href="#">About Us</Link>
            </Typography>
            <Typography variant="h6" padding="40px 0 10px 0">
              Follow Us
            </Typography>
            <div>
              <IconButton
                color="primary"
                aria-label="Facebook"
                onClick={() =>
                  window.open(
                    'https://www.facebook.com/IntegratedMarineObservingSystem'
                  )
                }
              >
                <FacebookIcon />
              </IconButton>

              <IconButton
                color="primary"
                aria-label="LinkedIn"
                onClick={() =>
                  window.open('https://www.linkedin.com/company/18409795')
                }
              >
                <LinkedInIcon />
              </IconButton>

              {/* <IconButton
                color="primary"
                aria-label="YouTube"
                onClick={() =>
                  window.open('https://www.youtube.com/user/IMOS5395')
                }
              >
                <YouTubeIcon />
              </IconButton> */}

              <IconButton
                color="primary"
                aria-label="X"
                onClick={() => window.open('https://twitter.com/IMOS_AUS')}
              >
                <XIcon />
              </IconButton>

              <IconButton
                color="primary"
                aria-label="Instagram"
                onClick={() =>
                  window.open('https://www.instagram.com/imos_australia')
                }
              >
                <InstagramIcon />
              </IconButton>
              <Typography variant="body2" padding="50px 0 20px 0">
                Copyright © 2024. All rights reserved.{' '}
              </Typography>
            </div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Footer;
