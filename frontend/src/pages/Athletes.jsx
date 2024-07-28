import React, { useContext, useState, useEffect } from "react";
import useFetch from "../hooks/useFetch";
import UserContext from "../context/user";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Box, Typography, TextField, Card, Stack, Grid, IconButton, Button } from "@mui/material";
import { Delete } from "@mui/icons-material";


const Athletes = () => {

  const [email, setEmail] = useState('');
  const [athletes, setAthletes] = useState();
  const [athlete_id, setAthlete_id] = useState('')

  const usingFetch = useFetch();
  const userCtx = useContext(UserContext);
  const queryClient = useQueryClient();

  const getOwnAthletes = useQuery({
    queryKey: ["ownAthletes"],
    queryFn: async () => {
      await usingFetch('/users/athletes/' + userCtx.decoded.id,
        undefined, undefined,
        userCtx.accessToken
      )
    },
    onSuccess: ()=> {
      setAthletes(data);
    }
  });

  const deleteAthlete = useMutation({
    mutationFn: async () => {
      await usingFetch(
        '/users/athletes/' + userCtx.decoded.id,
        "DELETE",
        { athlete_id },
        userCtx.accessToken
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries('ownAthletes');
    }
  });

  const addAthlete = useMutation({
    mutationFn: async ()=>{
      await usingFetch(
        'users/athletes/' + userCtx.decoded.id,
        "PUT", { email }, userCtx.accessToken
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries('ownAthletes');
    }
  })



  return (
    <Box
      sx={{
        ml: 37, // To accommodate the 300px NavDrawer and add some padding
        p: 3,
        width: 'calc(100vw - 300px)', // To ensure the width accounts for the drawer
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
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

      <Stack spacing={2} sx={{ mt: 4 }}>
        <Typography variant="h6">My Athletes</Typography>
        {athletes.map((item, index) => (
          <Card key={index} sx={{ p: 2, display: 'flex', justifyContent: 'space-between' }}>
            <Box>
              <Typography>{item.name}</Typography>
              <Typography>{item.gender}</Typography>
              <Typography>{item.description}</Typography>
              <Typography>{item.goals}</Typography>
            </Box>
            <IconButton onClick={() => deleteAthlete.mutate(item._id)}>
              <Delete />
            </IconButton>
          </Card>
        ))}
      </Stack>
    </Box>
  );
};

export default Athletes;