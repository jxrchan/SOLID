import React, { useContext } from "react";
import useFetch from "../hooks/useFetch";
import UserContext from "../context/user";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const Athletes = () => {

  const [email, setEmail] = useState('');
  const [athlete_id, setAthlete_id] = useState('')

  const usingFetch = useFetch();
  const userCtx = useContext(UserContext);
  const queryClient = useQueryClient();

  const getOwnAthletes = useQuery({
    queryKey: ["ownAthletes"],
    queryFn: async () => {
      await usingFetch('/users/athletes/' + userCtx.decoded.id,
        undefined, undefined,
        userCtx.accessToken
      )
    }
  });

  const deleteAthlete = useMutation({
    mutationFn: async () => {
      await usingFetch(
        '/users/athletes/' + userCtx.decoded.id,
        "DELETE",
        { athlete_id },
        userCtx.accessToken
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries('ownAthletes');
    }
  });

  const addAthlete = useMutation({
    mutationFn: async ()=>{
      await usingFetch(
        'users/athletes/' + userCtx.decoded.id,
        "PUT", { email }, userCtx.accessToken
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries('ownAthletes');
    }
  })



  return <div></div>;
};

export default Athletes;
