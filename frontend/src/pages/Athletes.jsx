import React, { useContext, useState, useEffect } from "react";
import useFetch from "../hooks/useFetch";
import UserContext from "../context/user";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Box,
  Typography,
  TextField,
  Card,
  CardMedia,
  CardActions,
  Grid,
  IconButton,
  Button,
  CardContent,
  CardHeader,
} from "@mui/material";
import { Delete, SportsScore } from "@mui/icons-material";

const Athletes = () => {
  const [email, setEmail] = useState("");
  const [athletes, setAthletes] = useState([]);

  const usingFetch = useFetch();
  const userCtx = useContext(UserContext);
  const queryClient = useQueryClient();

  const getOwnAthletes = useQuery({
    queryKey: ["ownAthletes", userCtx.decoded.id],
    queryFn: async () => {
      return await usingFetch(
        "/users/athletes",
        undefined,
        undefined,
        userCtx.accessToken
      );
    },
  });

  useEffect(() => {
    if (getOwnAthletes.isSuccess && getOwnAthletes.data)
      setAthletes(getOwnAthletes.data);
  }, [getOwnAthletes.isSuccess, getOwnAthletes.data]);

  const deleteAthlete = useMutation({
    mutationFn: async (athleteId) => {
      return await usingFetch(
        "/users/athletes",
        "DELETE",
        { athleteId },
        userCtx.accessToken
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["ownAthletes", userCtx.decoded.id]);
    },
  });

  const addAthlete = useMutation({
    mutationFn: async () => {
      return await usingFetch(
        "/users/athletes",
        "PUT",
        { email },
        userCtx.accessToken
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["ownAthletes", userCtx.decoded.id]);
    },
  });

  return (
    <Box
      sx={{
        ml: 37, // To accommodate the 300px NavDrawer and add some padding
        p: 3,
        width: "calc(100vw - 300px)", // To ensure the width accounts for the drawer
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Grid container spacing={1} justifyContent="center" sx={{ maxWidth: 'lg'}}>
        <Grid item xs={12}>
          <Typography variant="h6" textAlign="left">Add Athletes by Email</Typography>
        </Grid>
        <Grid item xs = {3}></Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            variant="outlined"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
          />
        </Grid>
        <Grid item xs={3}>
          </Grid>
          <Grid item xs={3}>
            </Grid>
            <Grid item xs={6}>
          <Button
            fullWidth
            variant="contained"
            onClick={() => addAthlete.mutate()}
          >
            ADD
          </Button>
        </Grid>
        <Grid item xs={3}>
        </Grid>
      </Grid>

      <Grid container spacing={2} justifyContent="center" sx={{ maxWidth: 'lg', mt: 4 }}>
        <Grid item xs={12}>
          <Typography variant="h6" textAlign="left">My Athletes</Typography>
        </Grid>
        {athletes && athletes.length !== 0 &&
          athletes.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  height: "100%",
                  textAlign: "center",
                }}
              >
                <CardHeader title={item.name} />
                <CardMedia>
                <Box
                sx={{
                  width: 150,
                  height: 150,
                  borderRadius: "50%",
                  overflow: "hidden",
                  border: "2px solid blue",
                  mb: 3,
                  mx: "auto",
                }}
              >
                <img
                  src={item.profile_picture}
                  alt="profile picture"
                  style={{ width: "100%", height: "100%" }}
                />
              </Box>
              </CardMedia>
                <CardContent>
                  <Typography variant="body2" color="textSecondary">
                    {item.description}
                  </Typography>
                  <br/>
                    <SportsScore  />
                    <Typography>{item.goals}</Typography>
                </CardContent>
                <CardActions disableSpacing sx={{ justifyContent: "center" }}>
                  <IconButton
                    onClick={() => deleteAthlete.mutate(item.athlete_id)}
                  >
                    <Delete sx={{'&:hover': {color: '#FF7961'}}} />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
      </Grid>
    </Box>
  );
};

export default Athletes;
