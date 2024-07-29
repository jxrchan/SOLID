import React, { useContext, useState, useEffect } from "react";
import {
  Box,
  Card,
  Typography,
  Select,
  Grid,
  IconButton,
  TextField,
  Button,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  MenuItem
} from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import useFetch from "../hooks/useFetch";
import UserContext from "../context/user";


const Coaches = () => {
  const [sport, setSport] = useState('');
  const [gender, setGender] = useState('');
  const [ownCoaches, setOwnCoaches] = useState([]);
  const [searchedCoaches, setSearchedCoaches] = useState([]);

  const usingFetch = useFetch();
  const userCtx = useContext(UserContext);
  const queryClient = useQueryClient();



  const getOwnCoaches = useQuery({
    queryKey: ["ownCoaches", userCtx.decoded.id],
    queryFn: async () => {
      const data = await usingFetch(
        "/users/coaches/" + userCtx.decoded.id,
        "GET",
        undefined,
        userCtx.accessToken
      );
      return data;
    },
  });

  useEffect(() => {
    if (getOwnCoaches.isSuccess && getOwnCoaches.data)
      setOwnCoaches(getOwnCoaches.data);
  }, [getOwnCoaches.isSuccess, getOwnCoaches.data]);

  const getCoaches = useQuery({
    queryKey: ["coaches"],
    queryFn: async () => {
      console.log('activated')
      let queryBody = {}
      if (sport.length > 0) queryBody.sport = sport;
      if (gender.length > 0) queryBody.gender = gender;
      if (sport.length === 0 && gender.length === 0) queryBody = undefined;
      return await usingFetch(
        "/users/coaches",
        "POST",
       queryBody,
        userCtx.accessToken
      );
    },
    enabled: false,
  });

  useEffect(() => {
    if (getCoaches.isSuccess && getCoaches.data)
      setSearchedCoaches(getCoaches.data);
  }, [getCoaches.isSuccess, getCoaches.data]);

  // const addReview = useMutation({
  //   mutationFn: async ({ review, coachId }) => {
  //     await usingFetch(
  //       "/users/coaches/" + userCtx.decoded.id,
  //       "PUT",
  //       { review, coachId },
  //       userCtx.accessToken
  //     );
  //   },
  //   onSuccess: () => {
  //     queryClient.invalidateQueries("coaches");
  //   },
  // });

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
      <Grid container spacing={2} sx={{ mt: 4 }}>
        <Grid item xs={12}>
          <Typography variant="h6"> My Coaches </Typography>
        </Grid>
        {ownCoaches &&
          ownCoaches.length !== 0 &&
          ownCoaches.map((item, index) => (
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
                  height="250"
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
                  <IconButton href={item.facebook}>
                    <FacebookIcon />
                  </IconButton>
                  <IconButton href={item.instagram}>
                    <InstagramIcon />
                  </IconButton>
               <IconButton>
                    <WhatsAppIcon /> 
                    </IconButton>
                     <Typography variant='body2' color='textSecondary'> {item.contact_number} </Typography>
                </CardActions>
              </Card>
            </Grid>
          ))}
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h6">Search for coaches</Typography>
        </Grid>
        <Grid item xs={6}>
          <TextField
          autoComplete="off"
            label="Sport"
            variant="outlined"
            value={sport}
            onChange={(e) => setSport(e.target.value)}
            margin="normal"
            fullWidth
          />
        </Grid>
        <Grid item xs={6}>
          <Select
            label="Gender"
            variant="outlined"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            fullWidth
          >
            <MenuItem value=''>All</MenuItem>
            <MenuItem value="MALE">Male</MenuItem>
            <MenuItem value="FEMALE">Female</MenuItem>
            <MenuItem value='NON-BINARY'>Non-Binary</MenuItem>
            <MenuItem value='OTHER'> Other </MenuItem>
          </Select>
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={handleSearch}>
            SEARCH
          </Button>
        </Grid>
      </Grid>

      {gender}
      {sport}

      <Grid container spacing={2} sx={{ mt: 4 }}>
        {getCoaches.isSuccess && getCoaches.data && JSON.stringify(getCoaches)}
      {getCoaches.isError && (
        <Typography color="error">
          {getCoaches.error.message}
        </Typography>
      )}
        {searchedCoaches &&
          searchedCoaches.length !== 0 &&
          searchedCoaches.map((item, index) => (
            <Grid item xs={12} sm={8} md={6} lg={3} key={index}>
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
                  height="150"
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
                  <IconButton href={item.facebook}>
                    <FacebookIcon />
                  </IconButton>
                  <IconButton href={item.instagram}>
                    <InstagramIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
      </Grid>
    </Box>
  );
};

export default Coaches;
