import React, { useContext } from 'react';
import { useMutation } from '@tanstack/react-query';
import useFetch from '../hooks/useFetch';
import UserContext from '../context/user';
import UpdateActivityDialog from './UpdateActivityDialog';


const ActivityCard = (props) => {

    const [showUpdateDialog, setShowUpdateDialog] = useState(false);
    const usingFetch = useFetch();
    const userCtx = useContext(UserContext);


      
    const deleteActivity = useMutation({
        mutationFn: async () => {await usingFetch('/users/activities/' + activityId, 'DELETE',
      undefined, userCtx.accessToken)},
      onSuccess: ()=> {
       queryClient.invalidateQueries('activities')
      }})
    return (
        <>
        {showUpdateDialog && <UpdateActivityDialog />}

        <div>
            
        </div>
        </>
    );
};

export default ActivityCard;