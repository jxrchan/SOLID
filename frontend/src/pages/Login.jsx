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
import Input from "@mui/material/Input";
import FilledInput from "@mui/material/FilledInput";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

function Login({}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const usingFetch = useFetch();
  const userCtx = useContext(UserContext);
  const navigate = useNavigate();

  const handleClickShowPassword = () => setShowPassword((initial)=>(!initial));

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const { isError, error, data, refetch } = useQuery({
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
    if (data) {
      userCtx.setAccessToken(data.access);
      const decoded = jwtDecode(data.access);
      userCtx.setRole(decoded.role);
      userCtx.setUserId(decoded.id);
      window.localStorage.setItem("token", data.access);
      navigate("/home");
    }
  }, [data]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundImage: "url(../images/LoginBg.jpeg)", // Replace with your background image URL
        backgroundSize: "cover",
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        padding: 2,
      }}
    >
      <Grid container justifyContent="flex-end">
        <Grid item xs={12} sm={8} md={4}>
          <Paper sx={{ padding: 4 }}>
            <form>
              {/* Email Field */}
              <TextField
                fullWidth
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
            </form>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Login;
