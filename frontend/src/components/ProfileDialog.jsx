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
  const [goals, setGoals] = useState(props.goals || '');
  const [sports, setSports] = useState(props.sports|| '');
  const [contact, setContact] = useState(props.contact || '');
  const [facebook, setFacebook] = useState(props.facebook || '');
  const [instagram, setInstagram] = useState(props.instagram || '');
  const [isNewPictureUploaded, setIsNewPictureUploaded] = useState(false);
  const [fileName, setFileName] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const [isUploadComplete, setIsUploadComplete] = useState(false);

const usingFetch = useFetch();
const userCtx = useContext(UserContext);
const queryClient = useQueryClient();

const updateProfile = useMutation({
  mutationFn: async () => {
    return await usingFetch('/users/profile/' + userCtx.decoded.id, "PATCH", {
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

const handleFileChange = async (e) => {
  setIsNewPictureUploaded(true);
  setFileName(e.name);
}

// const handleUpdate = async (event) => {
//   event.preventDefault(); // Changed from event.prevent.default();
//   updateProfile.mutate();
//   if (isNewPictureUploaded) {
//     const formData = new FormData();
//     formData.append('image', event.target.files[0]); // Added event.target.files[0]
//     await updateProfilePicture(formData); // Added formData as argument
//   }
//   setIsUploadComplete(true);
//   queryClient.invalidateQueries('profile');
// };



const handleUpdate = async (event) => {
event.preventDefault();
 updateProfile.mutate();
  if (isNewPictureUploaded) {
   const formData = new FormData()
   formData.append('image', event.target.files[0]);
   await updateProfilePicture(formData);
  }
  setIsUploadComplete(true);
  queryClient.invalidateQueries('profile');
}

useEffect (()=>{
  setIsFormValid((name.trim() && description.trim()))
}, [name, description]);


  return (
    <Dialog open onClose={() => props.setShowProfileDialog(false)}>

      <DialogTitle> Update your Profile </DialogTitle>
      <DialogContent>
      <Box component="form" noValidate autoComplete="off" onSubmit={handleUpdate}>

        {userCtx.decoded.role === "ATHLETE" && (<>
      <Button
            variant="contained"
            component="label"
            sx={{ mt: 2 }}
          >
            Upload Profile Picture
            <input
              type="file"
              hidden
              onChange={(e)=> {handleFileChange(e.target.files[0])}}
            />
          </Button>

          {fileName && (<Typography sx ={{mt: 2}}> {fileName} </Typography>)}

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
          rows={3}
          inputProps={{ maxLength: 200 }}
          helperText={`${description.length}/200`}
        />
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
           <TextField
          fullWidth
          variant="outlined"
          label="Contact Number"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          margin="normal"
          inputProps={{ maxLength: 10 }}
          
        />
        </>
      )}


        {userCtx.decoded.role === "COACH" && (<>
      <Button
            variant="contained"
            component="label"
            sx={{ mt: 2 }}
          >
            Upload Profile Picture
            <input
              type="file"
              hidden
              onChange={(e)=> {handleFileChange(e.target.files[0])}}
            />
          </Button>

          {fileName && (<Typography sx ={{mt: 2}}> {fileName} </Typography>)}

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
          rows={3}
          inputProps={{ maxLength: 200 }}
          helperText={`${description.length}/200`}
        />
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
           <TextField
          fullWidth
          variant="outlined"
          label="Contact Number"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          margin="normal"
          inputProps={{ maxLength: 10 }}
          
        />
                   <TextField
          fullWidth
          variant="outlined"
          label="Facebook"
          value={facebook}
          onChange={(e) => setFacebook(e.target.value)}
          margin="normal"
          
        />
                   <TextField
          fullWidth
          variant="outlined"
          label="Instagram"
          value={instagram}
          onChange={(e) => setInstagram(e.target.value)}
          margin="normal"
          
        />
        </> ) }

        </Box> 
        {updateProfile.isSuccess && updateProfile.data && (
          <Typography> 
            Profile Updated
          </Typography>
        )}

      </DialogContent>
 
      <DialogActions>
      {!isUploadComplete ? ( <>
        <Button
          onClick={() => props.setShowProfileDialog(false)}
          color="secondary"
        >
          Cancel
        </Button>
        <Button
          type = "submit"
          color="primary"
          variant="contained"
          disabled={!isFormValid}
        >
          Update
        </Button> </> ) : (
          <> 
        <Button
          onClick={() => props.setShowProfileDialog(false)}
          color="secondary"
        >
          Close
        </Button> </>
  
        )
        }
      </DialogActions>
    </Dialog>

  )
};

export default ProfileDialog;
