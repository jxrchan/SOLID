import React, { useContext, useEffect } from "react";
import useFetch from "../hooks/useFetch";
import UserContext from "../context/user";
import { jwtDecode } from "jwt-decode";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import AboutDialog from "../components/AboutDialog";
import {Typography} from "@mui/material";
import {Link} from '@mui/material';

function Login({}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showAboutDialog, setShowAboutDialog] = useState(false);


  const usingFetch = useFetch();
  const userCtx = useContext(UserContext);
  const navigate = useNavigate();


  const handleClickShowPassword = () => setShowPassword((initial)=>(!initial));

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  }

  const { isError, isSuccess, error, data, refetch } = useQuery({
    queryKey: ["login"],
    queryFn: async () => {
      try {
        return await usingFetch("/auth/login", "POST", { email, password });
      } catch (error) {
        throw error.message;
      }
    },
    enabled: false,
    retry: 1,
  });

  
// Storing Access and Refresh Tokens
  useEffect(() => {
    if (isSuccess && data) {
      window.localStorage.setItem("access", data.access)
      window.localStorage.setItem("refresh", data.refresh);
      userCtx.setAccessToken(data.access);
      const decodedToken = jwtDecode(data.access);
      userCtx.setDecoded(decodedToken);
      userCtx.setIsLoggedIn(true) 
      navigate("/home");
    }
  }, [isSuccess, data]);

  return (
    <>
    {showAboutDialog && <AboutDialog setShowAboutDialog = {setShowAboutDialog} />}
    <Box
      sx={{
        minHeight: "100vh",
        backgroundImage: "url(../images/LandingPage2.jpeg)", 
        backgroundSize: "cover",
        backgroundPosition: "center top",
        display: "flex",
        alignItems: "center",
        padding: 4,
      }}
    >
      <Grid container justifyContent="flex-end">
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={3}
          sx={{
            borderRadius: "50px", 
            overflow: "hidden",  
            boxShadow: 3,
          }}
        >
          <Paper sx={{ padding: 4, position: "relative", textAlign: 'center'}}>
            <Box sx={{ textAlign: "center", mb: 1 }}>
              <img src="../images/SolidLogo.png" alt="SOLID" width="150" />
            </Box>

            <Box component="form" noValidate autoComplete="off">
              {/* EMAIL */}
              <TextField
                fullWidth
                autoComplete="off"
                variant="outlined"
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                margin="dense"
              />

              {/* PASSWORD */}
              <FormControl fullWidth variant="outlined" margin="dense">
                <InputLabel>Password</InputLabel>
                <OutlinedInput
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  inputProps={{
                    minLength: 8,
                    maxLength: 50,
                  }}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Password"
                />
              </FormControl>

              {isError && error && <Typography color='error'> Email or password is invalid. Please try again.  </Typography>}

              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={refetch}
                sx={{ mt: 2 }}
              >
                Submit
              </Button>
              <Button
                fullWidth
                variant="contained"
                onClick={() => { navigate("/register") }}
                sx={{ backgroundColor: '#357a38', mt: 2 }}
              >
                Register
              </Button>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Link
                component="button"
                onClick={() => setShowAboutDialog(true)}
                sx={{
                  color: "inherit",
                  textDecoration: "none",
                  ':hover': {
                    color: '#3f51b5',
                  }
                }}
                underline="none"
              >
                <Typography variant="body1">
                  What is SOLID?
                </Typography>
              </Link>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
    </>
  );
}

export default Login;
