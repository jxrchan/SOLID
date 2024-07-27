import React, { useState, useEffect, useContext } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import useFetch from "../hooks/useFetch";
import UserContext from "../context/user";


const ProfileDialog = (props) => {
  const [name, setName] = useState(props.name);
  const [gender, setGender] = useState(props.gender);
  const [description, setDescription] = useState(props.description);
  const [profilePicture, setProfilePicture] = useState(props.profilePicture);
  const [goals, setGoals] = useState(props.goals);
  const [contact, setContact] = useState(props.contact);
  const [facebook, setFacebook] = useState(props.facebook);
  const [instagram, setInstagram] = useState(props.instagram);
  const [isUploadPicture, setIsUploadPicture] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

const usingFetch = useFetch();
const userCtx = useContext(UserContext);

const updateProfile = useMutation({
  mutationFn: async () => {
    await usingFetch('/users/profile/' + userCtx.decoded.id, "PATCH", {
      name, description, sports, goals, contact, facebook, instagram 
    }, userCtx.accessToken )
  }}
)

const updateProfilePicture = async (formData) => {
try {
  const res = await fetch(import.meta.env.VITE_SERVER + '/users/upload/' + userCtx.decoded.id, {
    method: "POST",
    body: formData,
    headers: {"Content-Type": "multipart/form-data",
      "Authorization": "Bearer " + userCtx.accessToken
    }
  });
 if (!res.ok)
  throw new Error ('fetch error');
console.log(res)
}
catch {error}
  console.error(error.message);
}

const handleFileChange = async () => {
  setIsUploadPicture(true);
}

const handleUpdate = async (event) => {
 updateProfile.mutate();
  if (isUploadPicture) {
   const formData = new FormData()
   formData.append('image', event.target.files[0]);
   await updateProfilePicture();
  }
}





  return (
    <Dialog open onClose={() => props.setShowProfileDialog(false)}>

      <DialogTitle> Update your Profile </DialogTitle>
      <DialogContent>
      <Box component="form" noValidate autoComplete="off">
      <Button
            variant="contained"
            component="label"
            sx={{ mt: 2 }}
          >
            Upload Profile Picture
            <input
              type="file"
              hidden
              onChange={handleFileChange}
            />
          </Button>
        <TextField
          fullWidth
          variant="outlined"
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          margin="normal"
        />
        <TextField
          fullWidth
          variant="outlined"
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          margin="normal"
          multiline
          rows={4}
          inputProps={{ maxLength: 200 }}
          helperText={`${description.length}/200`}
        />
        <TextField
          fullWidth
          variant="outlined"
          label="Sports (separate each sport with a comma)"
          value={sports}
          onChange={(e) => setSports(e.target.value)}
          margin="normal"
          inputProps={{ maxLength: 200 }}
          helperText={`${sports.length}/200`}
          
        />
           <TextField
          fullWidth
          variant="outlined"
          label="Goals (separate each goal with a comma)"
          value={goals}
          onChange={(e) => setGoals(e.target.value)}
          margin="normal"
          inputProps={{ maxLength: 200 }}
          helperText={`${goals.length}/200`}
          
        />
           <TextField
          fullWidth
          variant="outlined"
          label="Contact Number"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          margin="normal"
          inputProps={{ maxLength: 10 }}
          
        />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => props.setShowProfileDialog(false)}
          color="secondary"
        >
          Cancel
        </Button>
        <Button
          onClick={() => {handleUpdate()}}
          color="primary"
          variant="contained"
          disabled={!isFormValid}
        >
          Update
        </Button>
      </DialogActions>
    </Dialog>

  )
};

export default ProfileDialog;
