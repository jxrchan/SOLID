import React, { useContext } from 'react';
import useFetch from '../hooks/useFetch';
import { useQuery } from '@tanstack/react-query';
import UserContext  from '../context/user';

const CoachReviews = (props) => {

    const [coachId, setCoachId] = useState(props.coachId)
    const usingFetch = useFetch();
    const userCtx = useContext(UserContext);


    const getCoachReviews = useQuery({
        queryKey: ['review', props.coachId],
        queryFn: async () => {
            await usingFetch('/users/coaches/review', undefined, { coachId}, 
                userCtx.accessToken
            )
        }
    
    })

    
    return (
        <div>
            
        </div>
    );
};

export default CoachReviews;