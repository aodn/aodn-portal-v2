import { Grid, Box } from '@mui/material';

import AIOMS from '@/assets/logos/aioms-logo2.png';
import AustralianGovernment from '@/assets/logos/aioms-logo1.png';
import BOM from '@/assets/logos/bom-logo.png';
import CSIRO from '@/assets/logos/csiro-logo.png';
import CurtinUniversity from '@/assets/logos/curtinuni-logo.png';
import DeakingUniversity from '@/assets/logos/deakinuniversity-logo.png';
import GovSA from '@/assets/logos/govsa-logo.png';
import IMOS from '@/assets/logos/imos-logo.png';
import MacquarieUniversity from '@/assets/logos/macquarie-logo.png';
import NCRIS from '@/assets/logos/ncris-logo.png';
import SARDI from '@/assets/logos/sardi-logo.png';
import SIMS from '@/assets/logos/sims-logo.png';
import UniversityOfMelbourne from '@/assets/logos/The-University-of-Melbourne-Logo.png';
import UniversityOfSydney from '@/assets/logos/unisyd-logo.png';
import UNSW from '@/assets/logos/unsw-logo.png';
import UTAS from '@/assets/logos/utas-logo.png';
import UTS from '@/assets/logos/uts-logo.png';
import UWA from '@/assets/logos/uwa.logo.png';

const LogoList = () => {
  const logos = [
    AIOMS,
    AustralianGovernment,
    BOM,
    CSIRO,
    CurtinUniversity,
    DeakingUniversity,
    GovSA,
    IMOS,
    MacquarieUniversity,
    NCRIS,
    SARDI,
    SIMS,
    UniversityOfMelbourne,
    UniversityOfSydney,
    UNSW,
    UTAS,
    UTS,
    UWA,
  ];

  return (
    <Grid container spacing={2}>
      {logos.map((logo, index) => (
        <Grid item xs={3} key={index}>
          <Box
            component="img"
            src={logo}
            alt={`logo-${index}`}
            sx={{ height: '40px' }}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default LogoList;
