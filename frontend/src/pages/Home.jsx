import React, { useContext, useEffect, useState } from "react";
import useFetch from "../hooks/useFetch";
import UserContext from "../context/user"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Box } from "@mui/system";
import { Grid, Typography } from "@mui/material";

const Home = () => {
const usingFetch = useFetch();
const userCtx = useContext(UserContext);
const queryClient = useQueryClient();

const [dateStart, setDateStart] = useState('');
const [dateEnd, setDateEnd] = useState('');
const [coachId, setCoachId] = useState('');
const [athleteId, setAthleteId] = useState('');
const [activityId, setActivityId] = useState('');


const getActivityTypes = useQuery({ 
  queryKey: ['activity types'],
  queryFn: async () => {
    await usingFetch('/users/activity_types', undefined, undefined, userCtx.accessToken)
  }
})

const getActivities = useQuery({
  queryKey: ["activities"],
  queryFn: async () => {
    await usingFetch('/users/activities/', 
      undefined, {dateStart, dateEnd, coachId, athleteId}, 
      userCtx.accessToken
    )
  }
});


const addActivity = useMutation({
  mutationFn: async () => {
    await usingFetch('/users/activities', "PUT", {
      athleteId,
      coachId,
      name,
      type,
      date,
      duration,
      comment
  }, userCtx.accessToken)
  },
  onSuccess: () => {
    queryClient.invalidateQueries('activities')
  }
})


//KIV Coach and Athlete name get

useEffect(()=> {
  if (userCtx.decoded.role === "ATHLETE")
  setAthleteId(userCtx.decoded.id);
  else setCoachId(userCtx.decoded.id);
},[])

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
<Grid>
    <Typography>
      Calendar goes here
    </Typography>

  </Grid>

  <Grid>
    <Typography>
      Add Activity Goes Here
          </Typography>

  </Grid>

  <Grid>
    <Typography>
Activities go here          
</Typography>

  </Grid>


  
    
  </Box>)
};

export default Home;
