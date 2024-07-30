import React, { useContext, useEffect, useState } from "react";
import useFetch from "../hooks/useFetch";
import UserContext from "../context/user";
import { useQuery } from "@tanstack/react-query";
import { Box } from "@mui/system";
import {
  Grid,
  Typography,
  Stack,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { DateCalendar } from "@mui/x-date-pickers";
import ActivityCard from "../components/ActivityCard";
import NewActivityDialog from "../components/NewActivityDialog";

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
    enabled: false,
  });

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
    enabled: false,
  });

  const getActivities = useQuery({
    queryKey: [
      "activities",
      userCtx.decoded.id,
      dateStart,
      dateEnd,
      athleteId,
      coachId,
    ],
    queryFn: async () => {
      let queryBody = {};
      if (dateStart) queryBody.dateStart = dateStart;
      if (dateEnd) queryBody.dateEnd = dateEnd;
      if (athleteId) queryBody.athleteId = athleteId;
      if (coachId) queryBody.coachId = coachId;
      return await usingFetch(
        "/users/activities/",
        undefined,
        queryBody,
        userCtx.accessToken
      );
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      if (userCtx.decoded.role === "ATHLETE") {
        await getOwnCoaches.refetch();
        if (getOwnCoaches.isSuccess && getOwnCoaches.data) {
          setCoaches(getOwnCoaches.data);
        }
      } else if (userCtx.decoded.role === "COACH") {
        await getOwnAthletes.refetch();
        if (getOwnAthletes.isSuccess && getOwnAthletes.data) {
          setAthletes(getOwnAthletes.data);
        }
      }
    };

    fetchData();
  }, [userCtx.decoded.role]);

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
        <Grid
          container
          justifyContent="center"
          spacing={2}
          textAlign="center"
          sx={{ maxWidth: "900px", width: "100%" }}
        >
          <Grid item xs={12} textAlign="left">
            <Typography>Activity Dashboard</Typography>
          </Grid>

          <Box component="form" noValidate autoComplete="off">
            <Grid item xs={8}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Select by Date</InputLabel>
                <DateCalendar onChange={(newDate) => setDateStart(newDate)} />
              </FormControl>
            </Grid>

            <Grid item xs={8}>
              <FormControl fullWidth margin="normal">
                {userCtx.decoded.role === "ATHLETE" && (
                  <>
                    <InputLabel id="athlete-label">Select Coach</InputLabel>
                    <Select
                      labelId="athlete-label"
                      value={coachId}
                      onChange={(e) => setCoachId(e.target.value)}
                      label="Select Athlete"
                    >
                      {athletes.map((item) => (
                        <MenuItem key={item.id} value={item.id}>
                          {item.name}
                        </MenuItem>
                      ))}
                    </Select>{" "}
                  </>
                )}
                {userCtx.decoded.role === "COACH" && (
                  <>
                    <InputLabel id="athlete-label">Select Athlete</InputLabel>
                    <Select
                      labelId="athlete-label"
                      value={athleteId}
                      onChange={(e) => setAthleteId(e.target.value)}
                      label="Select Athlete"
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

            <Grid item xs={8}>
              <Button onClick={() => getActivities.refetch()} color="secondary">
                Search
              </Button>
            </Grid>
          </Box>

          {userCtx.decoded.role === "COACH" && (
            <Grid item xs={10} textAlign="right">
              <Button onClick={() => setShowNewActivityDialog(true)}>
                New Activity
              </Button>
            </Grid>
          )}

          <Stack>
            {getActivities.isSuccess &&
              activities.length !== 0 &&
              activities.map((item, index) => (
                <Grid item xs={10} key={index}>
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
                  />
                </Grid>
              ))}
          </Stack>
        </Grid>
      </Box>
    </>
  );
};

export default Home;
