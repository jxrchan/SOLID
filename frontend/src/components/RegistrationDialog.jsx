import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Button,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import useFetch from "../hooks/useFetch";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

const RegistrationDialog = ({ email, setShowRegistrationDialog }) => {
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [role, setRole] = useState("");
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [description, setDescription] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const [isRegistrationComplete, setIsRegistrationComplete] = useState(false);

  const navigate = useNavigate();

  const usingFetch = useFetch();
  const { mutate, isError, isFetching, error, isSuccess, data } = useMutation({
    mutationFn: async () => {
      return await usingFetch("/auth/register", "POST", {
        email,
        password,
        role,
        name,
        gender,
        description,
      });
    },
    onSuccess: () => {
      setIsRegistrationComplete(true);
    },
  });

  const handleRegister = () => {
    mutate();
  };

  useEffect(() => {
    const isFormComplete =
      email &&
      password &&
      repeatPassword &&
      role &&
      name.trim() &&
      gender &&
      description.trim() &&
      password === repeatPassword;

    setIsFormValid(isFormComplete);
  }, [email, password, repeatPassword, role, name, gender, description]);

  return (
      <Dialog
        open
        onClose={() => setShowRegistrationDialog(false)}
        sx={{
          '.MuiPaper-root': {
            borderRadius: 6,
            boxShadow: 3,
            padding: 2,
          },
        }}
      >
   
      <DialogTitle variant="h6">Complete Registration</DialogTitle>
      <Box component="form" noValidate autoComplete="off">
        <DialogContent>
          {/* SELECT ROLE */}
          <Typography variant="body1" sx={{ mt: 0 }}>
           Role 
          </Typography>
          <ToggleButtonGroup
            value={role}
            exclusive
            onChange={(e, newRole) => setRole(newRole)}
            aria-label="role"
            fullWidth
            sx={{ my: 2 }}
          >
            <ToggleButton value="ATHLETE" aria-label="athlete">
              Athlete
            </ToggleButton>
            <ToggleButton value="COACH" aria-label="coach">
              Coach
            </ToggleButton>
          </ToggleButtonGroup>
          {/* PASSWORD */}
          <TextField
            fullWidth
            variant="outlined"
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            inputProps ={{
              minLength: 8,
              maxLength: 50,
            }}
          />
          {/* CONFIRM PASSWORD */}
          <TextField
            fullWidth
            variant="outlined"
            label="Confirm Password"
            type="password"
            value={repeatPassword}
            onChange={(e) => setRepeatPassword(e.target.value)}
            margin="normal"
            inputProps ={{
              minLength: 8,
              maxLength: 50,
            }}
          />
          {/* NAME */}
          <TextField
            fullWidth
            variant="outlined"
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            margin="normal"
          />
          {/* SELECT GENDER */}
          <Typography variant="body1" sx={{ mt: 2 }}>
           Gender
          </Typography>
          <ToggleButtonGroup
            value={gender}
            exclusive
            onChange={(e, newGender) => setGender(newGender)}
            aria-label="gender"
            fullWidth
            sx={{ my: 2 }}
          >
            <ToggleButton value="MALE" aria-label="male">
              Male
            </ToggleButton>
            <ToggleButton value="FEMALE" aria-label="female">
              Female
            </ToggleButton>
            <ToggleButton value="NON-BINARY" aria-label="non-binary">
              Non-Binary
            </ToggleButton>
            <ToggleButton value="OTHER" aria-label="other">
              Other
            </ToggleButton>
          </ToggleButtonGroup>
          {/* PERSONAL DESCRIPTION */}
          <TextField
            fullWidth
            variant="outlined"
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            margin="normal"
            multiline
            rows={2}
            inputProps={{ maxLength: 200 }}
            helperText={`${description.length}/200`}
          />
        </DialogContent>
        {/* ERROR */}
        {isError && error && <Typography color="error"> Unsuccessful registration </Typography>}
        {/* SUCCESSFUL */}
        {isSuccess && data && (
          <Typography color="green" sx={{ mx: 3 }}>
            Registration is successful
          </Typography>
        )}
      </Box>
      {/* Buttons */}
      <DialogActions>
        {!isRegistrationComplete ? (
          <>
            <Button
              onClick={() => setShowRegistrationDialog(false)}
              color="secondary"
            >
              Cancel
            </Button>
            <Button
              onClick={handleRegister}
              color="primary"
              variant="contained"
              disabled={!isFormValid}
            >
              Complete
            </Button>{" "}
          </>
        ) : (
          <>
            <Button
              onClick={() => {
                navigate("/login");
              }}
              color="primary"
              variant="contained"
            >
              Return to Login
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default RegistrationDialog;
