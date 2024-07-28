import React, { useContext, useState } from "react";
import useFetch from "../hooks/useFetch";
import UserContext from "../context/user";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Box, Card, Rating, Select, Stack, Grid, IconButton, TextField, Button } from "@mui/material";

const Coaches = () => {
  const [sport, setSport] = useState('');
  const [gender, setGender] = useState('');
  const [coachId, setCoachId] = useState('');
  const [coaches, setCoaches] = useState([]);

  const usingFetch = useFetch();
  const userCtx = useContext(UserContext);
  const queryClient = useQueryClient();

  const getCoaches = useQuery({
    queryKey: ["coaches"],
    queryFn: async () => {
      const data = await usingFetch(
        "/users/coaches",
        "GET",
        { sport, gender },
        userCtx.accessToken
      );
      return data;
    },
    enabled: false,
  });

  const getOwnCoaches = useQuery({
    queryKey: ["ownCoaches"],
    queryFn: async () => {
      const data = await usingFetch(
        "/users/coaches/" + userCtx.decoded.id,
        "GET",
        undefined,
        userCtx.accessToken
      );
      return data;
    },
    onSuccess: (data) => {
      setCoaches(data);
    },
  });

  const addReview = useMutation({
    mutationFn: async ({ review, coachId }) => {
      await usingFetch(
        "/users/coaches/" + userCtx.decoded.id,
        "PUT",
        { review, coachId },
        userCtx.accessToken
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries("coaches");
    },
  });

  const handleSearch = () => {
    getCoaches.refetch();
  };

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
      <Stack>
        {getOwnCoaches.isSuccess &&
          getOwnCoaches.data &&
          coaches.map((item, index) => (
            <Card key={index}>
              {item.profile_picture}
              {item.name}
              {item.gender}
              {item.description}
              {item.contact}
              {item.facebook}
              {item.instagram}
              <IconButton>
                <Rating />
              </IconButton>
            </Card>
          ))}
      </Stack>

      <Grid container>
        <Grid item xs={12}>
          Search for coaches with the following
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Sport"
            variant="outlined"
            value={sport}
            onChange={(e) => setSport(e.target.value)}
            margin="normal"
          />
        </Grid>
        <Grid item xs={6}>
          <Select
            label="Gender"
            variant="outlined"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            margin="normal"
          />
        </Grid>
        <Grid item xs={12}>
          <Button onClick={handleSearch}>
            SEARCH
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Coaches;
