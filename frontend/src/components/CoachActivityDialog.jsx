import React, { useContext } from 'react';
import useFetch from '../hooks/useFetch';
import UserContext from '../context/user'
import {useMutation, useQueryClient } from '@tanstack/react-query';

const CoachActivityDialog = (props) => {

const [name, setName] = useState(props.name);
const [type, setType] = useState(props.type);
const [date, setDate] = useState(props.date);
const [duration, setDuration] = useState(props.duration);
const [coachComment, setCoachComment] = useState(props.coachComment);
const [athleteComment, setAthleteComment] = useState(props.athleteComment);
const [activityLink, setActivityLink] = useState(props.activityLink);


const usingFetch = useFetch();
const userCtx = useContext(UserContext);
const queryClient = useQueryClient();


const updateActivity = useMutation({
    mutationFn: async () => {
        await usingFetch('/users/activity/' + id, "PATCH",
            {name, type, date, duration, coachComment, athleteComment, activityLink},
            userCtx.accessToken)
    },
    onSuccess: () => {
        queryClient.invalidateQueries('activities')
    }
})
 
    return (
        <div>
            
        </div>
    );
};

export default CoachActivityDialog;