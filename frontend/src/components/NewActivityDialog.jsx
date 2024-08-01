import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useContext, useEffect, useState } from "react";
import useFetch from "../hooks/useFetch";
import UserContext from "../context/user";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Box,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { format } from "date-fns";

const NewActivityDialog = ({ setShowNewActivityDialog, ownAthletes }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [date, setDate] = useState(null);
  const [athlete, setAthlete] = useState('')
  const [myAthletes, setMyAthletes] = useState(ownAthletes)
  const [duration, setDuration] = useState('');
  const [comment, setComment] = useState('');
  const [formActivityTypes, setFormActivityTypes] = useState([]);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isActivityAdded, setIsActivityAdded] = useState(false);

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
  });

  useEffect(() => {
    if (getActivityTypes.isSuccess && getActivityTypes.data)
      setFormActivityTypes(getActivityTypes.data);
  }, [getActivityTypes.isSuccess, getActivityTypes.data]);

  const addActivity = useMutation({
    mutationFn: async (athleteId) => {
      return await usingFetch(
        "/users/activity",
        "PUT",
        {
          athleteId,
          name,
          type,
          date: format(date, "yyyy-MM-dd"),
          duration,
          comment,
        },
        userCtx.accessToken
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries("activities", userCtx.decoded.id);
    },
  });

  useEffect(() => {
    if (name.length > 0 && athlete.length > 0 && type.length > 0 && date) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  }, [name, athlete, type, date]);

  return (
    <Dialog
      open
      onClose={() => setShowNewActivityDialog(false)}
      sx={{
        ".MuiPaper-root": {
          borderRadius: 6,
          boxShadow: 3,
          padding: 2, 
        },
      }}
    >
      <DialogTitle variant="h6">Add Activity</DialogTitle>

      <Box component="form" noValidate autoComplete="off">
        <DialogContent>

          {/* Select Athlete */}
          <FormControl fullWidth margin="normal">
            <InputLabel id="athlete-label">Select Athlete</InputLabel>
            <Select
              labelId="athlete-label"
              value={athlete}
              onChange={(e) => setAthlete(e.target.value)}
              label="Select Athlete"
            >
              {myAthletes.map((item) => (
                <MenuItem key={item.id} value={item.id}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/*  Activity Name */}
          <TextField
            fullWidth
            variant="outlined"
            label="Name of Activity"
            value={name}
            onChange={(e) => setName(e.target.value)}
            margin="normal"
          />

        {/* Type of Activity  */}
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

            {/* Date */}
          <DatePicker
            label="Date"
            value={date}
            onChange={(newDate) => setDate(newDate)}
            renderInput={(params) => (
              <TextField {...params} fullWidth margin="normal" />
            )}
            format="yyyy-MM-dd"
          />

          {/* Duration */}
          <TextField
            fullWidth
            variant="outlined"
            label="Duration"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            margin="normal"
            multiline
          />

          {/* Coach Comments */}
          <TextField
            fullWidth
            variant="outlined"
            label="Comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            margin="normal"
            multiline
            rows={2}
          />
        </DialogContent>
        {/* Error */}
        {addActivity.isError && addActivity.error && (
          <Typography color="error" sx={{ mx: 3 }}>
            Error adding activity
          </Typography>
        )}
        {/* Success */}
        {addActivity.isSuccess && addActivity.data && (
          <Typography color="green" sx={{ mx: 3 }}>
            Activity has been successfully added
          </Typography>
        )}
      </Box>
      {/* Buttons */}
      <DialogActions>
        {!isActivityAdded ? (
          <>
            <Button
              onClick={() => setShowNewActivityDialog(false)}
              color="secondary"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                addActivity.mutate(athlete);
                setIsActivityAdded(true);
              }}
              color="primary"
              variant="contained"
              disabled={!isFormValid}
            >
              Complete
            </Button>
          </>
        ) : (
          <Button
            onClick={() => {
              setShowNewActivityDialog(false);
            }}
            color="primary"
            variant="contained"
          >
            Close
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default NewActivityDialog;
