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
  });

  

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
        backgroundImage: "url(../images/LandingPage.jpeg)", // Replace with your background image URL
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        padding: 4,
     
      }}
    >
      <Grid container justifyContent="flex-end">
        <Grid item xs={12} sm={8} md={4}>
          <Paper sx={{ padding: 4 }}>
            <form>
              {/* Email Field */}
              <TextField
                fullWidth
                autoComplete="off"
                variant="outlined"
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                margin="normal"
              />

              {/* Password Field */}
              <FormControl fullWidth variant="outlined" margin="normal">
                <InputLabel>Password</InputLabel>
                <OutlinedInput
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
                color="secondary"
                onClick={()=>{navigate("/register")}}
                sx={{ mt: 2 }}
              >
                Register
              </Button>
            </form>
            <Link
              component="button"
              onClick={() => setShowAboutDialog(true)}
              sx={{ display: 'flex', alignItems: 'center', py: 1 }}
              underline="none"
              color="inherit"
            >
              What is SOLID?
            </Link>
          </Paper>
        </Grid>
      </Grid>
    </Box>
    </>
  );
}

export default Login;
