import React, { useContext, useEffect, useState } from "react";
import useFetch from "../hooks/useFetch";
import UserContext from "../context/user";
import { useQuery } from "@tanstack/react-query";
import ProfileDialog from '../components/ProfileDialog';
import { Button, Typography, Box } from "@mui/material";


const Profile = () => {
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [description, setDescription] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [goals, setGoals] = useState('');
  const [sports, setSports] = useState('');
  const [contact, setContact] = useState("");
  const [facebook, setFacebook] = useState("");
  const [instagram, setInstagram] = useState("");
  const [showProfileDialog, setShowProfileDialog] = useState(false);

  const usingFetch = useFetch();
  const userCtx = useContext(UserContext);

  const { isSuccess, isError, error, isFetching, data } = useQuery({
    queryKey: ["profile", userCtx.decoded.id],
    queryFn: async () => {
     return await usingFetch(
        "/users/profile",
        undefined,
        undefined,
        userCtx.accessToken
      );
    },
  });

  useEffect(()=> {
    if (isSuccess && data){
      setName(data.name);
      setGender(data.gender);
      setDescription(data.description);
      setProfilePicture(data.profile_picture);
      setGoals(data.goals);
      setSports(data.sports);
      setContact(data.contact_number);
      setFacebook(data.facebook);
      setInstagram(data.instagram);
    }
  }, [isSuccess, data])

  return (
    <>
      {showProfileDialog && (
        <ProfileDialog
          name={name}
          gender={gender}
          description={description}
          profilePicture={profilePicture}
          goals={goals}
          contact={contact}
          sports = {sports}
          facebook={facebook}
          instagram={instagram}
          setShowProfileDialog={setShowProfileDialog}
        />
      )}

      <Box
        sx={{
          ml: 37, // To accommodate the 300px NavDrawer and add some padding
          p: 3,
          width: 'calc(100vw - 300px)', // To ensure the width accounts for the drawer
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center', // Center the items horizontally
        }}
      >
        <Box
          sx={{
            width: 200,
            height: 200,
            borderRadius: '50%',
            overflow: 'hidden',
            border: '2px solid blue',
            mb: 3,
          }}
        >
          <img src={profilePicture} alt="" style={{ width: '100%', height: '100%' }} />
        </Box>

        {userCtx.decoded.role === "ATHLETE" && (
          <>
            <Typography variant="h6">Name: {name}</Typography>
            <Typography>Gender: {gender}</Typography>
            <Typography>Description: {description}</Typography>
            <Typography>Sports: {sports}</Typography>
            <Typography>Goals: {goals}</Typography>
            <Typography>Contact Number: {contact}</Typography>
          </>
        )}

        {userCtx.decoded.role === "COACH" && (
          <>
            <Typography variant="h6">Name: {name}</Typography>
            <Typography>Gender: {gender}</Typography>
            <Typography>Description: {description}</Typography>
            <Typography>Sports: {sports}</Typography>
            <Typography>Contact Number: {contact}</Typography>
            <Typography>Facebook: {facebook}</Typography>
            <Typography>Instagram: {instagram}</Typography>
          </>
        )}

        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setShowProfileDialog(true);
          }}
          sx={{ mt: 3 }}
        >
          Update Profile
        </Button>
      </Box>
    </>
  );
};

export default Profile;