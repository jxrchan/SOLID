import React, { useContext, useState } from "react";
import useFetch from "../hooks/useFetch";
import UserContext from "../context/user"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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

  return 
  <Box>
    
  </Box>;
};

export default Home;
