import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box } from '@mui/material';

const AboutDialog = ({ setShowAboutDialog }) => {
  return (
    <Dialog 
      open 
      onClose={() => setShowAboutDialog(false)}
      fullWidth
      maxWidth="md"
      sx={{
        '& .MuiDialog-paper': {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }
      }}
    >
         <Box
          component="img"
          src="../../images/SolidLogowithTitle.png" 
          sx ={{ width: '30%', height: 'auto', m: 1 }}
       />

      <DialogContent>
        <Typography variant="body1">
          SOLID borrows its name from the word's multiple definitions. In Singapore, 'SOLID' is a common expression meaning great or superb, like, 'Your code was written so well. SOLID!' 'Solid' is also often used to describe something that is firmly built and stable, like, 'The foundation of that building is solid.'
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          SOLID facilitates athletes in building a stronger and ,more, solid foundation for physicall wellness. Fitness and sport coaches advertise their experience and services on our platform. Athletes then browse this catalog and choose to work with coaches whose philosophies align with their own. Together, they
          plan, execute, and track their progress. SOLID!
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
         SOLID was built as part of a software engineering professional course and implemented with the following technologies:
        </Typography>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-around',
            flexWrap: 'wrap',
            mt: 2
          }}
        >
          <Box
            component="img"
            src="../../images/nodeJS.png"
            alt='nodejs'
            sx={{ width: '10%', height: 'auto', mx: 1 }}
          />
          <Box
            component="img"
            src="../../images/express.png"
            alt="express 2"
            sx={{ width: '10%', height: 'auto', mx: 1 }}
          />
          <Box
            component="img"
            src="../../images/react.png"
            alt="react"
            sx={{ width: '10%', height: 'auto', mx: 1 }}
          />
          <Box
            component="img"
            src="../../images/vite.png"
            alt="vite"
            sx={{ width: '10%', height: 'auto', mx: 1 }}
          />
          <Box
            component="img"
            src="../../images/mui.png"
            alt="mui"
            sx={{ width: '10%', height: 'auto', mx: 1 }}
          />
            <Box
            component="img"
            src="../../images/postgreSQL.png"
            alt="postgresql"
            sx={{ width: '10%', height: 'auto', mx: 1 }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => setShowAboutDialog(false)}
          color="secondary"
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AboutDialog;
