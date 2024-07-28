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
      await usingFetch("/auth/register", "POST", {
        email,
        password,
        role,
        name,
        gender,
        description,
      });
    },
    onSuccess: ()=>{
     
     setIsRegistrationComplete(true);
    }
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
    <Dialog open onClose={() => setShowRegistrationDialog(false)}>
      <DialogTitle>Complete Registration</DialogTitle>
      <Box component="form" noValidate autoComplete="off">
        <DialogContent>
          <Typography>Email: {email}</Typography>
          <Typography variant="h6" sx={{ mt: 2 }}>
            Select Your Role
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
          <TextField
            fullWidth
            variant="outlined"
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            variant="outlined"
            label="Confirm Password"
            type="password"
            value={repeatPassword}
            onChange={(e) => setRepeatPassword(e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            variant="outlined"
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            margin="normal"
          />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Select Your Gender
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
          <TextField
            fullWidth
            variant="outlined"
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            margin="normal"
            multiline
            rows={3}
            inputProps={{ maxLength: 200 }}
            helperText={`${description.length}/200`}
          />
        </DialogContent>
        {isError && (
          <Typography color="error" sx={{ mx: 3 }}>
            {error.message}
          </Typography>
        )}
        {isFetching && <Typography> Fetching </Typography>}
        {isError && <Typography> {error.message} </Typography>}
        {isSuccess && data &&
          <Typography color="primary" sx={{ mx: 3 }}>
            Registration is successful
          </Typography>
        }
      </Box>
      <DialogActions>
        {!isRegistrationComplete ? (<>
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
        </Button> </>) : (<>
          <Button
          onClick={()=>{navigate('/login')}}
          color="primary"
          variant="contained"
        > 
          Return to Login
        </Button> </>)
        }
      </DialogActions>
    </Dialog>
  );
};

export default RegistrationDialog;
