import React, { useContext, useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Box,
  Toolbar,
  Link as MuiLink,
  Typography,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import PersonIcon from "@mui/icons-material/Person";
import GroupIcon from "@mui/icons-material/Group";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import InfoIcon from "@mui/icons-material/Info";
import AboutDialog from "./AboutDialog";
import UserContext from "../context/user";
import { Link as RouterLink } from "react-router-dom";

const NavDrawer = () => {
  const [showAboutDialog, setShowAboutDialog] = useState(false);
  const userCtx = useContext(UserContext);

  const handleLogout = () => {
    window.localStorage.removeItem("access");
    window.localStorage.removeItem("refresh");
    userCtx.setIsLoggedIn(false);
    window.location.reload();
  };

  return (
    <>
      {showAboutDialog && (
        <AboutDialog setShowAboutDialog={setShowAboutDialog} />
      )}
      <Drawer
        variant="permanent"
        sx={{
          width: 300,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 300,
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          },
        }}
      >
        <Box>
          <Toolbar />
          <Box sx={{ overflow: "auto" }}>
            <List sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <ListItem sx={{ justifyContent: "center", py: 2 }}>
                <Box
                  component="img"
                  src="../../images/SolidLogoWithTitle.png"
                  alt="App Logo"
                  sx={{ width: "80%", height: "auto" }}
                />
              </ListItem>
              <Divider />
              <ListItem
                component={RouterLink}
                to="/home"
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  "&:hover .MuiListItemIcon-root, &:hover .MuiTypography-root": {
                    color: "#3f51b5",
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: "auto", marginRight: 11 }}>
                  <HomeIcon />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography
                      sx={{
                        fontSize: "17px",
                        color: "grey",
                        width: "100%",
                        fontWeight: '500',
                      }}
                    >
                      HOME
                    </Typography>
                  }
                />
              </ListItem>

              <ListItem
                component={RouterLink}
                to="/profile"
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  "&:hover .MuiListItemIcon-root, &:hover .MuiTypography-root": {
                    color: "#3f51b5",
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: "auto", marginRight: 10 }}>
                  <PersonIcon />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography
                      sx={{
                        fontSize: "17px",
                        color: "grey",
                        width: "100%",
                        fontWeight: '500',
                      }}
                    >
                      PROFILE
                    </Typography>
                  }
                />
              </ListItem>
              {userCtx.decoded.role === "ATHLETE" && (
                <ListItem
                  component={RouterLink}
                  to="/coaches"
                  sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    "&:hover .MuiListItemIcon-root, &:hover .MuiTypography-root": {
                      color: "#3f51b5",
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: "auto", marginRight: 9.5 }}>
                    <GroupIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography
                        sx={{
                          fontSize: "17px",
                          color: "grey",
                          width: "100%",
                          fontWeight: '500',

                        }}
                      >
                        COACHES
                      </Typography>
                    }
                  />
                </ListItem>
              )}
              {userCtx.decoded.role === "COACH" && (
                <ListItem
                  component={RouterLink}
                  to="/athletes"
                  sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    "&:hover .MuiListItemIcon-root, &:hover .MuiTypography-root": {
                      color: "#3f51b5",
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: "auto", marginRight: 9 }}>
                    <GroupIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography
                        sx={{
                          fontSize: "17px",
                          color: "grey",
                          width: "100%",
                          fontWeight: '500',
                        }}
                      >
                        ATHLETES
                      </Typography>
                    }
                  />
                </ListItem>
              )}
            </List>
          </Box>
        </Box>
        <Box sx={{ mb: 2, textAlign: "center" }}>
          <Divider />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <MuiLink
              component="button"
              onClick={handleLogout}
              sx={{
                display: "flex",
                alignItems: "center",
                py: 1,
                color: "inherit",
                "&:hover": {
                  color: "#3f51b5",
                },
              }}
              underline="none"
            >
              <ExitToAppIcon sx={{ mr: 1 }} />
              Logout
            </MuiLink>
            <MuiLink
              component="button"
              onClick={() => setShowAboutDialog(true)}
              sx={{
                display: "flex",
                alignItems: "center",
                py: 1,
                color: "inherit",
                "&:hover": {
                  color: "#3f51b5",
                },
              }}
              underline="none"
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
