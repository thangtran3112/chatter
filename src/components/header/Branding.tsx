import { Typography } from '@mui/material';
import ForumIcon from '@mui/icons-material/Forum';
import router from '../Routes';

//Using router.navigate('/') we would avoid trigger full page refresh
//Alternative: href='/', which would trigger full page refresh
const Branding = () => {
  return (
    <>
      <ForumIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
      <Typography
        variant="h6"
        noWrap
        component="a"
        onClick={() => router.navigate('/')}
        sx={{
          mr: 2,
          display: { xs: 'none', md: 'flex' },
          fontFamily: 'monospace',
          cursor: 'pointer',
          fontWeight: 700,
          letterSpacing: '.3rem',
          color: 'inherit',
          textDecoration: 'none',
        }}
      >
        CHATTER
      </Typography>
    </>
  );
};

export default Branding;
