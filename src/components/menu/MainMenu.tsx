import { StyledButton } from './StyledMenu';
import { Grid } from '@mui/material';

const Menu = () => {
  return (
    <Grid
      container
      sx={{
        flexGrow: 1,
        backgroundColor: 'transparent',
        padding: '5px 0',
      }}
      spacing={2}
    >
      <Grid item xs={12}>
        <Grid
          container
          justifyContent="center"
          spacing={10} // Space between buttons
        >
          <Grid key="menu-grid-item-data" item>
            <StyledButton
              name={'Data'}
              items={[{ name: 'Item1', handler: () => {} }]}
            />
          </Grid>
          <Grid key="menu-grid-item-learn" item>
            <StyledButton
              name={'Learn'}
              items={[{ name: 'Item1', handler: () => {} }]}
            />
          </Grid>
          <Grid key="menu-grid-item-engage" item>
            <StyledButton
              name={'Engage'}
              items={[{ name: 'Item1', handler: () => {} }]}
            />
          </Grid>
          <Grid key="menu-grid-item-contact" item>
            <StyledButton
              name={'Contact'}
              items={[{ name: 'Item1', handler: () => {} }]}
            />
          </Grid>
          <Grid key="menu-grid-item-about" item>
            <StyledButton
              name={'About'}
              items={[{ name: 'Item1', handler: () => {} }]}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Menu;
