import React, { useContext, useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogTitle, DialogContent, DialogActions, Box, TextField, FormControl, InputLabel, Select, MenuItem, Button, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import useFetch from '../hooks/useFetch';
import UserContext from '../context/user';
import {format} from 'date-fns';

const UpdateActivityDialog = (props) => {
  const [id, setId] = useState(props.id);
  const [name, setName] = useState(props.name);
  const [type, setType] = useState(props.type);
  const [date, setDate] = useState(props.date);
  const [duration, setDuration] = useState(props.duration);
  const [coachComment, setCoachComment] = useState(props.coachComment);
  const [athleteComment, setAthleteComment] = useState(props.athleteComment);
  const [activityLink, setActivityLink] = useState(props.activityLink);
  const [formActivityTypes, setFormActivityTypes] = useState([]);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isUpdateComplete, setIsUpdateComplete] = useState(false);

  const usingFetch = useFetch();
  const userCtx = useContext(UserContext);
  const queryClient = useQueryClient();

  const getActivityTypes = useQuery({
    queryKey: ["activity types"],
    queryFn: async () => {
      return await usingFetch(
        "/users/activity_types",
        undefined,
        undefined,
        userCtx.accessToken
      );
    },
    enabled: (userCtx.decoded.role === 'COACH'),
  });

  useEffect(() => {
    if (getActivityTypes.isSuccess && getActivityTypes.data) {
      setFormActivityTypes(getActivityTypes.data);
    }
  }, [getActivityTypes.isSuccess, getActivityTypes.data]);

  const updateActivity = useMutation({
    mutationFn: async () => {
      await usingFetch('/users/activity/' + id, "PATCH",
        { name, type, date: format(date, 'yyyy-MM-dd'), duration, coachComment, athleteComment, activityLink },
        userCtx.accessToken)
    },
    onSuccess: () => {
      queryClient.invalidateQueries('activities', userCtx.decoded.id);
    }
  });

  useEffect(() => {
    if (userCtx.decoded.role === 'COACH' && name.length > 0 && type.length > 0 && date) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [userCtx.decoded.role, name, type, date]);

  useEffect(()=> {
    if (userCtx.decoded.role === 'ATHLETE' && athleteComment
    )
    setIsFormValid(true);
    else {
      setIsFormValid(false);
    }
  }, [userCtx.decoded.role, athleteComment])

  return (
    <Dialog
      open
      onClose={() => props.setShowUpdateDialog(false)}
      sx={{
        ".MuiPaper-root": {
          borderRadius: 6,
          boxShadow: 3,
        },
      }}
    >
      <DialogTitle variant="h6">Update Activity</DialogTitle>

      <Box component="form" noValidate autoComplete="off">
        <DialogContent>
          {userCtx.decoded.role === 'COACH' &&
            <>
              <TextField
                fullWidth
                variant="outlined"
                label="Name of Activity"
                value={name}
                onChange={(e) => setName(e.target.value)}
                margin="normal"
              />

              <FormControl fullWidth margin="normal">
                <InputLabel id="activity-type-label">Type of Activity</InputLabel>
                <Select
                  labelId="activity-type-label"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  label="Type of Activity"
                >
                  {formActivityTypes.map((item) => (
                    <MenuItem key={item.type} value={item.type}>
                      {item.type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <DatePicker
                label="Date"
                value={date}
                onChange={(newDate) => setDate(newDate)}
                renderInput={(params) => (
                  <TextField {...params} fullWidth margin="normal" />
                )}
                format="yyyy-MM-dd"
              />

              <TextField
                fullWidth
                variant="outlined"
                label="Duration"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                margin="normal"
                multiline
              />

              <TextField
                fullWidth
                variant="outlined"
                label="Comment"
                value={coachComment}
                onChange={(e) => setCoachComment(e.target.value)}
                margin="normal"
                multiline
                rows={2}
              />
            </>
          }
          {userCtx.decoded.role === 'ATHLETE' &&
            <>
              <TextField
                fullWidth
                variant="outlined"
                label="Comment"
                value={athleteComment}
                onChange={(e) => setAthleteComment(e.target.value)}
                margin="normal"
                multiline
                rows={2}
              />
            </>
          }
        </DialogContent>
        {updateActivity.isError && (
          <Typography color="error" sx={{ mx: 3 }}>
            {updateActivity.error.message}
          </Typography>
        )}
      </Box>

      <DialogActions>
        {!isUpdateComplete ? (
          <>
            <Button
              onClick={() => props.setShowUpdateDialog(false)}
              color="secondary"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                updateActivity.mutate();
                setIsUpdateComplete(true);
              }}
              color="primary"
              variant="contained"
              disabled={!isFormValid}
            >
              Complete
            </Button>
          </>
        ) : (
          <>
          <Typography color="green" sx={{ mx: 3 }}>
          Activity is updated
        </Typography>
          <Button
            onClick={() => props.setShowUpdateDialog(false)}
            color="primary"
            variant="contained"
          >
            Close
          </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default UpdateActivityDialog;
