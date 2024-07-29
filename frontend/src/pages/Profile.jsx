import React, { useContext, useEffect, useState } from "react";
import useFetch from "../hooks/useFetch";
import UserContext from "../context/user";
import { useQuery } from "@tanstack/react-query";
import ProfileDialog from "../components/ProfileDialog";
import { Grid, Paper, Button, Typography, Box } from "@mui/material";
import {
  Facebook,
  WhatsApp,
  SportsScore,
  SportsBasketball,
  Instagram,
} from "@mui/icons-material";

const Profile = () => {
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [description, setDescription] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [goals, setGoals] = useState("");
  const [sports, setSports] = useState("");
  const [contact, setContact] = useState("");
  const [facebook, setFacebook] = useState("");
  const [instagram, setInstagram] = useState("");
  const [showProfileDialog, setShowProfileDialog] = useState(false);

  const usingFetch = useFetch();
  const userCtx = useContext(UserContext);

  const { isSuccess, isError, error, isFetching, data, refetch } = useQuery({
    queryKey: ["profile", userCtx.decoded.id],
    queryFn: async () => {
      return await usingFetch(
        "/users/profile",
        undefined,
        undefined,
        userCtx.accessToken
      );
    },
    refetchOnWindowFocus: true,
    staleTime: 0,
  });

  useEffect(() => {
    if (isSuccess && data) {
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
  }, [isSuccess, data]);

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
          sports={sports}
          facebook={facebook}
          instagram={instagram}
          setShowProfileDialog={setShowProfileDialog}
          refetchProfile={refetch} // Pass the refetch function to the dialog
        />
      )}

      <Box
        sx={{
          ml: 37,
          p: 3,
          width: "calc(100vw - 300px)",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Grid container justifyContent="center">
          <Grid item xs={12} sm={8} md={5} justifyContent="center">
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <Box
                sx={{
                  width: 200,
                  height: 200,
                  borderRadius: "50%",
                  overflow: "hidden",
                  border: "2px solid blue",
                  mb: 3,
                  mx: "auto",
                }}
              >
                <img
                  src={profilePicture}
                  alt=""
                  style={{ width: "100%", height: "100%" }}
                />
              </Box>

              {userCtx.decoded.role === "ATHLETE" && (
                <>
                  <Typography variant="h6">{name}</Typography>
                  <Typography>{gender}</Typography>
                  <Typography>
                    <em>{description}</em>
                  </Typography>
                  <br />
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <SportsBasketball sx={{ mr: 1 }} />
                    <Typography>{sports}</Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <SportsScore sx={{ mr: 1 }} />
                    <Typography>{goals}</Typography>
                  </Box>
                  <br />
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <WhatsApp sx={{ mr: 1 }} />
                    <Typography>{contact}</Typography>
                  </Box>
                </>
              )}

              {userCtx.decoded.role === "COACH" && (
                <>
                  <Typography variant="h6">{name}</Typography>
                  <Typography>{gender}</Typography>
                  <Typography>
                    <em>{description}</em>
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <SportsBasketball sx={{ mr: 1 }} />
                    <Typography>{sports}</Typography>
                  </Box>
                  <br />
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <WhatsApp sx={{ mr: 1 }} />
                    <Typography>{contact}</Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Facebook sx={{ mr: 1 }} />
                    <Typography>{facebook}</Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Instagram sx={{ mr: 1 }} />
                    <Typography>{instagram}</Typography>
                  </Box>
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
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default Profile;
