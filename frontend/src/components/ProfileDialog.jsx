import React, { useState, useEffect, useContext } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useFetch from "../hooks/useFetch";
import UserContext from "../context/user";

const ProfileDialog = (props) => {
  const [name, setName] = useState(props.name);
  const [description, setDescription] = useState(props.description);
  const [goals, setGoals] = useState(props.goals || "");
  const [sports, setSports] = useState(props.sports || "");
  const [contact, setContact] = useState(props.contact || "");
  const [facebook, setFacebook] = useState(props.facebook || "");
  const [instagram, setInstagram] = useState(props.instagram || "");
  const [isNewPictureUploaded, setIsNewPictureUploaded] = useState(false);
  const [fileName, setFileName] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const [isUploadComplete, setIsUploadComplete] = useState(false);
  const [selectedFile, setSelectedFile] = useState();

  const usingFetch = useFetch();
  const userCtx = useContext(UserContext);
  const queryClient = useQueryClient();

  const updateProfile = useMutation({
    mutationFn: async () => {
      return await usingFetch(
        "/users/profile",
        "PATCH",
        {
          name,
          description,
          sports,
          goals,
          contact,
          facebook,
          instagram,
        },
        userCtx.accessToken
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["profile", userCtx.decoded.id]);
    }
  });

  const updateProfilePicture = async (formData) => {
    try {
      const res = await fetch(import.meta.env.VITE_SERVER + "/users/upload", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: "Bearer " + userCtx.accessToken,
        },
      });
      if (!res.ok) throw new Error("fetch error");
      console.log(res);
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleFileChange = (e) => {
    setIsNewPictureUploaded(true);
    setFileName(e.name);
    setSelectedFile(e);
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
   updateProfile.mutate();
    if (isNewPictureUploaded && selectedFile) {
      const formData = new FormData();
      formData.append("image", selectedFile);
      await updateProfilePicture(formData);
      queryClient.invalidateQueries(["profile", userCtx.decoded.id]);
    }
    setIsUploadComplete(true);
  };

  useEffect(() => {
    setIsFormValid(name.trim() && description.trim());
  }, [name, description]);

  return (
    <Dialog
      open
      onClose={() => props.setShowProfileDialog(false)}
      sx={{
        ".MuiPaper-root": {
          borderRadius: 6,
          boxShadow: 3,
        },
      }}
    >
      <DialogTitle>Update your Profile</DialogTitle>
      <DialogContent>
        <Box
          component="form"
          noValidate
          autoComplete="off"
          onSubmit={handleUpdate}
        >
          {/* Profile Picture */}
          <Button variant="contained" component="label" sx={{ mt: 2 }}>
            Upload Profile Picture
            <input
              type="file"
              hidden
              onChange={(e) => handleFileChange(e.target.files[0])}
            />
          </Button>

          {fileName && <Typography sx={{ mt: 2 }}>{fileName}</Typography>}
{/* Name */}
          <TextField
            fullWidth
            variant="outlined"
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            margin="normal"
          />
    {/* Description  */}
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

          {/* Sports */}
          <TextField
            fullWidth
            variant="outlined"
            label="Sports"
            value={sports}
            onChange={(e) => setSports(e.target.value)}
            margin="normal"
            inputProps={{ maxLength: 200 }}
            helperText={`${sports.length}/200`}
          />
          {/* Goals */}
          {userCtx.decoded.role === "ATHLETE" && (
            <TextField
              fullWidth
              variant="outlined"
              label="Goals"
              value={goals}
              onChange={(e) => setGoals(e.target.value)}
              margin="normal"
              inputProps={{ maxLength: 200 }}
              helperText={`${goals.length}/200`}
            />
          )}
          {/* Contact */}
          <TextField
            fullWidth
            variant="outlined"
            label="Contact Number"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            margin="normal"
            inputProps={{ maxLength: 10 }}
          />
          {userCtx.decoded.role === "COACH" && (
            <>
            {/* Facebook */}
              <TextField
                fullWidth
                variant="outlined"
                label="Facebook"
                value={facebook}
                onChange={(e) => setFacebook(e.target.value)}
                margin="normal"
              />
              {/* Instagram */}
              <TextField
                fullWidth
                variant="outlined"
                label="Instagram"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                margin="normal"
              />
            </>
          )}
          <DialogActions>
            {!isUploadComplete ? (
              <>
                <Button
                  onClick={() => props.setShowProfileDialog(false)}
                  color="secondary"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  color="primary"
                  variant="contained"
                  disabled={!isFormValid}
                >
                  Update
                </Button>
              </>
            ) : (
              <>
              {/* Success and error messages */}
                {updateProfile.isError && updateProfile.error && 
                 <Typography color = 'error'> Error updating profile</Typography>}
                {updateProfile.isSuccess && updateProfile.data &&
                  <Typography color="green">Profile updated</Typography>}
                {updateProfilePicture.isError && updateProfilePicture.error && 
                 <Typography color = 'error'> Error updating profile picture</Typography>}
                {updateProfilePicture.isSuccess && updateProfilePicture.data &&
                  <Typography color="green">Profile picture updated</Typography>}
                <Button
                  onClick={() => {
                    props.setShowProfileDialog(false);
                    setIsUploadComplete(false);
                  }}
                  color="secondary"
                >
                  Close
                </Button>
              </>
            )}
          </DialogActions>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileDialog;
