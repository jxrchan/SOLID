import React, { useContext, useEffect, useState } from "react";
import useFetch from "../hooks/useFetch";
import UserContext from "../context/user";
import { useQuery } from "@tanstack/react-query";
import { Box, Container, Grid, Typography, Stack, Button, FormControl, InputLabel, Select, MenuItem, IconButton } from "@mui/material";
import { DateCalendar } from "@mui/x-date-pickers";
import ActivityCard from "../components/ActivityCard";
import NewActivityDialog from "../components/NewActivityDialog";
import AddIcon from '@mui/icons-material/Add'
import { format } from "date-fns";

const Home = () => {
  const usingFetch = useFetch();
  const userCtx = useContext(UserContext);

  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const [coaches, setCoaches] = useState([]);
  const [athletes, setAthletes] = useState([]);
  const [coachId, setCoachId] = useState("");
  const [athleteId, setAthleteId] = useState("");
  const [activities, setActivities] = useState([]);
  const [showNewActivityDialog, setShowNewActivityDialog] = useState(false);

  const getOwnAthletes = useQuery({
    queryKey: ["athletesHome", userCtx.decoded.id],
    queryFn: async () => {
      return await usingFetch(
        "/users/athletes",
        undefined,
        undefined,
        userCtx.accessToken
      );
    },
    enabled: (userCtx.decoded.role === 'COACH'),
  });

  useEffect(() => {
    if (getOwnAthletes.isSuccess && getOwnAthletes.data)
      setAthletes(getOwnAthletes.data)
  }, [getOwnAthletes.isSuccess, getOwnAthletes.data]);

  const getOwnCoaches = useQuery({
    queryKey: ["coachesHome", userCtx.decoded.id],
    queryFn: async () => {
      return await usingFetch(
        "/users/coaches",
        undefined,
        undefined,
        userCtx.accessToken
      );
    },
    enabled: (userCtx.decoded.role === 'ATHLETE'),
  });

  useEffect(() => {
    if (getOwnCoaches.isSuccess && getOwnCoaches.data)
      setCoaches(getOwnCoaches.data)
  }, [getOwnCoaches.isSuccess, getOwnCoaches.data]);

  const getActivities = useQuery({
    queryKey: ["activities", userCtx.decoded.id],
    queryFn: async () => {
      let queryBody = {};
      if (dateStart) queryBody.dateStart = format(dateStart, 'yyyy-MM-dd');
      if (dateEnd) queryBody.dateEnd = format(dateEnd, 'yyyy-MM-dd');
      if (athleteId) queryBody.athleteId = athleteId;
      if (coachId) queryBody.coachId = coachId;
      return await usingFetch(
        "/users/activities/",
        "POST",
        queryBody,
        userCtx.accessToken
      );
    },
    retry: 1,
  });

  useEffect(() => {
    if (getActivities.isSuccess && getActivities.data) {
      setActivities(getActivities.data);
    }
  }, [getActivities]);

  return (
    <>
      {showNewActivityDialog && (
        <NewActivityDialog
          ownAthletes={athletes}
          setShowNewActivityDialog={setShowNewActivityDialog}
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
        }}
      >
        <Container maxWidth="lg">
          <Grid
            container
            justifyContent="center"
            spacing={2}
            textAlign="center"
            sx={{ width: "100%" }}
          >
            <Grid item xs={12} textAlign="left">
              <Typography variant='h6'>Activity Dashboard</Typography>
            </Grid>

            <Grid item xs={2}>

            </Grid>

            <Grid item xs={8}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Select by Date</InputLabel>
                <DateCalendar
                  onChange={(newDate) => {setDateStart(newDate);
                    setDateEnd(newDate);}
                  }
                />
              </FormControl>
            </Grid>

            <Grid item xs={2}>
              </Grid>


              <Grid item xs={3}>
              </Grid>
  

            <Grid item xs={6}>
              <FormControl fullWidth margin="normal">
                {userCtx.decoded.role === "ATHLETE" && (
                  <>
                    <InputLabel id="coach-label">Select Coach</InputLabel>
                    <Select
                      labelId="coach-label"
                      value={coachId}
                      onChange={(e) => setCoachId(e.target.value)}
                      label="Select Coach"
                    >
                      {coaches.map((item) => (
                        <MenuItem key={item.id} value={item.id}>
                          {item.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </>
                )}
                {userCtx.decoded.role === "COACH" && (
                  <>
                    <InputLabel id="athlete-label">Select Athlete</InputLabel>
                    <Select
                      labelId="athlete-label"
                      value={athleteId}
                      onChange={(e) => setAthleteId(e.target.value)}
                      label="Select by Athlete"
                    >
                      {athletes.map((item) => (
                        <MenuItem key={item.id} value={item.id}>
                          {item.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={3}>

            </Grid>

            <Grid item xs={3}>
              
            </Grid>

            <Grid item xs={6}>
              <Button fullWidth variant="contained" onClick={() => {getActivities.refetch();
                setDateStart(null);
                setDateEnd(null);
                setCoachId('');
                setAthleteId('');
              }} color="primary">
                SEARCH
              </Button>
            </Grid>

            <Grid item xs={3}>
              
            </Grid>

            {userCtx.decoded.role === "COACH" && (
              <Grid item xs={12} textAlign="right">
                <IconButton onClick={() => setShowNewActivityDialog(true)} color="primary">
                  <AddIcon fontSize="large"/>
                </IconButton>
              </Grid>
            )}

            <Grid item xs={12}>
              <Stack spacing={2} alignItems="center">
                {getActivities.isSuccess && activities.length !== 0 && activities.map((item, index) => (
                  <Box key={index} sx={{ width: "80%" }}>
                    <ActivityCard
                      id={item.id}
                      athleteId={item.athlete_id}
                      coachId={item.coach_id}
                      name={item.name}
                      type={item.type}
                      date={item.date}
                      duration={item.duration}
                      coachComment={item.coach_comment}
                      athleteComment={item.athlete_comment}
                      activityLink={item.activity_link}
                    />
                  </Box>
                ))}
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default Home;
