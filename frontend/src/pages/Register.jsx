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
        <Grid container justifyContent="center" alignItems="center">
          <Grid item xs={12} sm={8} md={4}>
            <Paper sx={{ padding: 4 }}>
              <form>
                <TextField
                  autoComplete="off"
                  fullWidth
                  variant="outlined"
                  label="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  margin="normal"
                />

                {isError && <Typography> <span style ={{color: 'red'}}> Invalid email or email already exists </span></Typography>}
                {isSuccess && data && <Typography> <span style={{color: 'green'}}> Email is available. Click continue to complete registration. </span></Typography>}
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
                  color="secondary"
                  onClick={() => navigate("/login")}
                  sx={{ mt: 2 }}
                >
                  RETURN TO LOGIN
                </Button>
              </form>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default Register;
