import React, { useContext, useState } from "react";
import useFetch from "../hooks/useFetch";
import UserContext from '../context/user'
import { useMutation } from "@tanstack/react-query";

const CoachUpdateDialog = (props) => {
  const [name, setName] = useState(props.name);
  const [gender, setGender] = useState(props.gender);
  const [description, setDescription] = useState(props.description);
  const [profilePicture, setProfilePicture] = useState(props.profilePicture);
  const [goals, setGoals] = useState(props.goals);
  const [contact, setContact] = useState(props.contact);
  const [facebook, setFacebook] = useState(props.facebook);
  const [instagram, setInstagram] = useState(props.instagram);
  const [isUploadPicture, setIsUploadPicture] = useState(false);

const usingFetch = useFetch();
const userCtx = useContext(UserContext);



const updateProfile = useMutation({
  mutationFn: async () => {
    await usingFetch('/users/profile/' + userCtx.decoded.id, "PATCH", {
      name, description, sports, goals, contact, facebook, instagram 
    }, userCtx.accessToken )
  }}
)

const updateProfilePicture  = useMutation ({
  mutationFn: async () => {
    await usingFetch('/users/upload/' + userCtx.decoded.id, "POST", undefined,
      userCtx.accessToken)
  }})

const handleSubmit = async () => {
  await updateProfile.mutate();
  if (updatePicture) {
    await updateProfilePicture.mutate();
  }
}

  return <div>

    
  </div>;
};

export default CoachUpdateDialog;
