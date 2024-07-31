import React, { useContext, useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useFetch from "../hooks/useFetch";
import UserContext from "../context/user";
import UpdateActivityDialog from "./UpdateActivityDialog";
import { Card, CardActionArea, CardContent, Typography, IconButton } from "@mui/material";
import { DeleteOutline, EditNote } from "@mui/icons-material";
import {format} from 'date-fns';

const ActivityCard = ({
  id,
  athleteId,
  coachId,
  name,
  type,
  duration,
  coachComment,
  athleteComment,
  activityLink,
  date,
}) => {
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [athleteName, setAthleteName] = useState('');
  const [coachName, setCoachName] = useState('');

  const usingFetch = useFetch();
  const userCtx = useContext(UserContext);
  const queryClient = useQueryClient();

  
  const getOwnAthleteName = useQuery({
    queryKey: ['athleteName', userCtx.decoded.id],
    queryFn: async () => {
        return await usingFetch('/users/athlete', 'POST', { athleteId }, userCtx.accessToken);
      },
    enabled: userCtx.decoded.role === 'COACH',
  });

  useEffect(() => {
    if (getOwnAthleteName.isSuccess && getOwnAthleteName.data) {
      setAthleteName(getOwnAthleteName.data.name);
    }
  }, [getOwnAthleteName.isSuccess, getOwnAthleteName.data]);

  const getOwnCoachName = useQuery({
    queryKey: ['coachName', userCtx.decoded.id],
    queryFn: async () => {
        return await usingFetch('/users/coach', 'POST', { coachId }, userCtx.accessToken);
    },
    enabled: userCtx.decoded.role === 'ATHLETE',
  });

  useEffect(() => {
    if (getOwnCoachName.isSuccess && getOwnCoachName.data) {
      setCoachName(getOwnCoachName.data.name);
    }
  }, [getOwnCoachName.isSuccess, getOwnCoachName.data]);

  const deleteActivity = useMutation({
    mutationFn: async () => {
      await usingFetch(
        "/users/activity/" + id,
        "DELETE",
        undefined,
        userCtx.accessToken
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries("activities");
    },
  });

  return (
    <>
      {showUpdateDialog && <UpdateActivityDialog 
      id = {id} 
      name = {name} 
      type = {type} 
      date = {date}
      duration = {duration}
      coachComment = {coachComment}
      athleteComment = {athleteComment} 
      activityLink = {activityLink}
      setShowUpdateDialog = {setShowUpdateDialog}
      />}
      <Card>
        <CardContent>
          <Typography>{format(date, 'yyyy-MM-dd')}</Typography>
          <Typography>{name}</Typography>
          {userCtx.decoded.role === 'COACH' && <Typography>{athleteName}</Typography>}
          {userCtx.decoded.role === 'ATHLETE' && <Typography>{coachName}</Typography>}
          <Typography>{type}</Typography>
          <Typography>{duration}</Typography>
          <Typography>{coachComment}</Typography>
          <Typography>{athleteComment}</Typography>
        </CardContent>
        <CardActionArea>
          <IconButton onClick={() => setShowUpdateDialog(true)}>
            <EditNote />
          </IconButton>
          <IconButton onClick={() => deleteActivity.mutate()}>
            <DeleteOutline />
          </IconButton>
        </CardActionArea>
      </Card>
    </>
  );
};

export default ActivityCard;
