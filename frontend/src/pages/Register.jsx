import { Box, Button, Grid, Paper, TextField, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import useFetch from "../hooks/useFetch";
import RegistrationDialog from "../components/RegistrationDialog";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [email, setEmail] = useState("");
  const [showRegistrationDialog, setShowRegistrationDialog] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);

  const usingFetch = useFetch();
  const navigate = useNavigate();

  const { isFetching, isSuccess, error, isError, data, refetch } = useQuery({
    queryKey: ["email", email],
    queryFn: async () => {
      return await usingFetch("/auth/email", "POST", { email });
    },
    enabled: false,
    retry: 1,
  });



  const checkEmail = async () => {
    setIsEmailValid(false);
    console.log("email set to invalid");
    await refetch();
  };

  useEffect(()=>{
   if (isSuccess && data) {
    setIsEmailValid(true)
   }
  }, [isSuccess, data])

  return (
    <>
      {showRegistrationDialog && (
        <RegistrationDialog
          email={email}
          setShowRegistrationDialog={setShowRegistrationDialog}
        />
      )}

      <Box
        sx={{
          minHeight: "100vh",
          backgroundImage: "url(../images/LandingPage.jpeg)",
          backgroundSize: "cover",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: 4,
        }}
      >
        <Grid container justifyContent="center" alignItems="center"
        >
          <Grid item xs={12} sm={8} md={4}  sx={{
            borderRadius: "20px", 
            overflow: "hidden",  
            boxShadow: 3,
          }}>
            <Paper sx={{ padding: 4 }}>
            <Box component="form" noValidate autoComplete="off">
              {/* EMAIL */}
                <TextField
                  autoComplete="off"
                  fullWidth
                  variant="outlined"
                  label="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  margin="normal"
                  type='email'
                />

                {isError && error && <Typography color = 'error'> Invalid email or email already exists </Typography>}
                {isSuccess && data && <Typography color = 'green'> Email is available. Click continue to complete registration. </Typography>}
                {!isEmailValid ? (
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      checkEmail();
                    }}
                    sx={{ mt: 2 }}
                  >
                    CHECK EMAIL VALIDITY
                  </Button>
                ) : (
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={() => setShowRegistrationDialog(true)}
                    sx={{ mt: 2 }}
                  >
                    CONTINUE
                  </Button>
                )}
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => navigate("/login")}
                  sx={{ backgroundColor: '#357a38', mt: 2 }}
                >
                  RETURN TO LOGIN
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default Register;
