import React, { useContext, useState } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Box,
  Toolbar,
  Link as MuiLink
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import InfoIcon from '@mui/icons-material/Info';
import AboutDialog from './AboutDialog';
import UserContext from '../context/user';
import { Link as RouterLink } from 'react-router-dom';

const NavDrawer = () => {
  const [showAboutDialog, setShowAboutDialog] = useState(false);
  const userCtx = useContext(UserContext);

  const handleLogout = () => {
    window.localStorage.removeItem('token');
    userCtx.setAccessToken('');
    userCtx.setDecode('');
    userCtx.setIsLoggedIn(false);
    window.location.reload();
  };

  return (
    <>
      {showAboutDialog && <AboutDialog setShowAboutDialog={setShowAboutDialog} />}
      <Drawer
        variant="permanent"
        sx={{
          width: 300,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 300,
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between', // to align items at the bottom
          },
        }}
      >
        <Box>
          <Toolbar />
          <Box sx={{ overflow: 'auto' }}>
            <List>
              <ListItem sx={{ justifyContent: 'center', py: 2 }}>
                <Box
                  component="img"
                  src="../../images/SolidLogoWithTitle.png"
                  alt="App Logo"
                  sx={{ width: '80%', height: 'auto' }}
                />
              </ListItem>
              <Divider />
              <ListItem button component={RouterLink} to="/home">
                <ListItemIcon><HomeIcon /></ListItemIcon>
                <ListItemText primary="Home" />
              </ListItem>
              <ListItem button component={RouterLink} to="/profile">
                <ListItemIcon><PersonIcon /></ListItemIcon>
                <ListItemText primary="Profile" />
              </ListItem>
              {userCtx.decoded.role === "ATHLETE" &&
              <ListItem button component={RouterLink} to="/coaches">
                <ListItemIcon><GroupIcon /></ListItemIcon>
                <ListItemText primary="Coaches" />
              </ListItem>}
              {userCtx.decoded.role === "COACH" &&
              <ListItem button component={RouterLink} to="/athletes">
                <ListItemIcon><GroupIcon /></ListItemIcon>
                <ListItemText primary="Athletes" />
              </ListItem>}
            </List>
          </Box>
        </Box>
        <Box sx={{ mb: 2, textAlign: 'center' }}>
          <Divider />
          <Box
            sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
          >
            <MuiLink
              component="button"
              onClick={handleLogout}
              sx={{ display: 'flex', alignItems: 'center', py: 1 }}
              underline="none"
              color="inherit"
            >
              <ExitToAppIcon sx={{ mr: 1 }} />
              Logout
            </MuiLink>
            <MuiLink
              component="button"
              onClick={() => setShowAboutDialog(true)}
              sx={{ display: 'flex', alignItems: 'center', py: 1 }}
              underline="none"
              color="inherit"
            >
              <InfoIcon sx={{ mr: 1 }} />
              What is SOLID?
            </MuiLink>
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default NavDrawer;
