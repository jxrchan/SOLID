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
  MenuItem,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import useFetch from "../hooks/useFetch";
import UserContext from "../context/user";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

const Coaches = () => {
  const [sport, setSport] = useState('');
  const [gender, setGender] = useState('');
  const [ownCoaches, setOwnCoaches] = useState([]);
  const [searchedCoaches, setSearchedCoaches] = useState([]);

  const usingFetch = useFetch();
  const userCtx = useContext(UserContext);

  const getOwnCoaches = useQuery({
    queryKey: ["ownCoaches", userCtx.decoded.id],
    queryFn: async () => {
     return await usingFetch(
        "/users/coaches",
        undefined,
        undefined,
        userCtx.accessToken
      );
    },
  });

  useEffect(() => {
    if (getOwnCoaches.isSuccess && getOwnCoaches.data)
      setOwnCoaches(getOwnCoaches.data);
  }, [getOwnCoaches.isSuccess, getOwnCoaches.data]);

  const getCoaches = useQuery({
    queryKey: ["coaches"],
    queryFn: async () => {
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
    retry: 0,
  });

  useEffect(() => {
    if (getCoaches.isSuccess && getCoaches.data)
      setSearchedCoaches(getCoaches.data);
  }, [getCoaches.isSuccess, getCoaches.data]);

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
      <Grid container justifyContent="center" sx={{ maxWidth: "lg" }}>
        <Grid item xs={12}>
          <Typography variant="h6" textAlign="left">My Coaches</Typography>
        </Grid>
        {ownCoaches &&
          ownCoaches.length !== 0 &&
          ownCoaches.map((item, index) => (
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
                </CardContent>
                <CardActions disableSpacing sx={{ justifyContent: "center" }}>
                  <IconButton href={item.facebook}>
                    <FacebookIcon />
                  </IconButton>
                  <IconButton href={item.instagram}>
                    <InstagramIcon />
                  </IconButton>
                  <IconButton>
                    <WhatsAppIcon />
                  </IconButton>
                  <Typography variant='body2' color='textSecondary'>
                    {item.contact_number}
                  </Typography>
                </CardActions>
              </Card>
            </Grid>
          ))}
      </Grid>

      <Grid container justifyContent="center" spacing={2} sx={{ maxWidth: 'lg', mt: 4 }}>
        <Grid item xs={12}>
          <Typography variant="h6" textAlign="left">Search for coaches</Typography>
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

      <Grid container justifyContent="center" spacing={2} sx={{ maxWidth: "900px", width: "100%", mt: 4 }}>
        {getCoaches.isSuccess && getCoaches.data && JSON.stringify(getCoaches)}
        {getCoaches.isError && (
          <Typography color="error">
            {getCoaches.error.message}
          </Typography>
        )}
        {searchedCoaches &&
          searchedCoaches.length !== 0 &&
          searchedCoaches.map((item, index) => (
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
                  <Typography variant="body2" color="textSecondary">
                    {item.goals}
                  </Typography>
                </CardContent>
                <CardActions disableSpacing sx={{ justifyContent: "center" }}>
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
