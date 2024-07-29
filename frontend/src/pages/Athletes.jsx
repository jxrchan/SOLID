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
import { Delete } from "@mui/icons-material";

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
        "/users/athletes/" + userCtx.decoded.id,
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
    mutationFn: async (athlete_id) => {
      return await usingFetch(
        "/users/athletes",
        "DELETE",
        { coach_id: userCtx.decoded.id, athlete_id },
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
        { email, coach_id: userCtx.decoded.id },
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
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h6">Add Athletes by Email</Typography>
        </Grid>
        <Grid item xs={8}>
          <TextField
            fullWidth
            variant="outlined"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
          />
        </Grid>
        <Grid item xs={4}>
          <Button
            fullWidth
            variant="contained"
            onClick={() => addAthlete.mutate()}
          >
            ADD
          </Button>
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ mt: 4 }}>
        <Grid item xs={12}>
          <Typography variant="h6">My Athletes</Typography>
        </Grid>
        {athletes && athletes.length !== 0 &&
          athletes.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <Card
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  height: "100%",
                }}
              >
                <CardHeader title={item.name} />
                <CardMedia
                  component="img"
                  height="200"
                  image={item.profile_picture}
                  alt="Profile picture"
                  sx={{ objectFit: "contain" }}
                />
                <CardContent>
                  <Typography variant="body2" color="textSecondary">
                    {item.description}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {item.goals}
                  </Typography>
                </CardContent>
                <CardActions disableSpacing>
                  <IconButton
                    onClick={() => deleteAthlete.mutate(item.athlete_id)}
                  >
                    <Delete />
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
