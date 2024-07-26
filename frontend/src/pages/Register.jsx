import {
  Box,
  Button,
  Grid,
  Paper,
  TextField,
  Typography
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import useFetch from "../hooks/useFetch";
import RegistrationDialog from "../components/RegistrationDialog";
import { useNavigate } from "react-router-dom";


const Register = () => {
  const [email, setEmail] = useState("");
  const [showRegistrationDialog, setShowRegistrationDialog] = useState(true);

  const usingFetch = useFetch();
  const navigate = useNavigate();

  const { mutate, isSuccess } = useMutation({
    mutationFn: async () => {
      const response = await usingFetch("/auth/checkEmail", "POST", { email });
      return response;
    }
  });

  useEffect(() => {
    if (email) {
      mutate();
    }
  }, [email, mutate]);

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
          backgroundImage: "url(../images/LandingPage.jpeg)", // Replace with your background image URL
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
                  fullWidth
                  variant="outlined"
                  label="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  margin="normal"
                />
                {isSuccess && (
                  <Typography>
                    Email is available. Click Register to complete registration.
                  </Typography>
                )}
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={() => setShowRegistrationDialog(true)}
                  sx={{ mt: 2 }}
                >
                  CONTINUE
                </Button>
                <Button
                  fullWidth
                  variant="contained"
                  color="secondary"
                  onClick={() => navigate('/login')}
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
