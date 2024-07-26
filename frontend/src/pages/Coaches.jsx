import React, { useContext, useEffect } from "react";
import useFetch from "../hooks/useFetch";
import UserContext from "../context/user";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const Coaches = () => {
  const [sport, setSport] = useState('');
  const [gender, setGender] = useState('');
  const [coachId, setCoachId] = useState('');

  const usingFetch = useFetch();
  const userCtx = useContext(UserContext);
  const queryClient = useQueryClient();


  const getCoaches = useQuery({
    queryKey: ["coaches"],
    queryFn: async () => {
      await usingFetch(
        "/users/coaches",
        undefined,
        {
          sport,
          gender,
        },
        userCtx.accessToken
      );
    },
  });

  const getOwnCoaches = useQuery({
    queryKey: ["own coaches"],
    queryFn: async () => {
      await usingFetch(
        "/users/coaches/" + userCtx.decoded.id,
        undefined,
        undefined,
        userCtx.accessToken
      );
    },
  });

  const addReview  = useMutation({
    mutationFn: async () => {
      await usingFetch('/users/coaches/' + userCtx.decoded.id, "PUT", {review, coachId} ,
        userCtx.accessToken)
      },
      onSuccess: () => {
        queryClient.invalidateQueries('coaches');
      }
    })


  return <div></div>;
};

export default Coaches;
