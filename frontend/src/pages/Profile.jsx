import React, { useContext, useEffect, useState } from "react";
import useFetch from "../hooks/useFetch";
import UserContext from "../context/user";
import { useQuery } from "@tanstack/react-query";
import AthleteUpdateDialog from '../components/AthleteProfileDialog';
import CoachUpdateDialog from '../components/CoachProfileDialog';

const Profile = () => {
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [description, setDescription] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [goals, setGoals] = useState("");
  const [contact, setContact] = useState("");
  const [facebook, setFacebook] = useState("");
  const [instagram, setInstagram] = useState("");
  const [showUpdateProfileDialog, setShowUpdateProfileDialog] = useState(false);

  const usingFetch = useFetch();
  const userCtx = useContext(UserContext);

  const { isSuccess, isError, error, isFetching, data } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
    await usingFetch(
        "/users/profile/" + userCtx.decoded.id,
        undefined,
        undefined,
        userCtx.accessToken
      );
    },
  });

  useEffect(()=> {
    if (isSuccess && data){
      setName(data.name);
      setGender(data.gender);
      setDescription(data.description);
      setProfilePicture(data.profile_picture);
      setGoals(data.goals);
      setContact(data.contact);
      setFacebook(data.facebook);
      setInstagram(data.instagram);
    }
  }, [isSuccess, data])

  return <div>

    {userCtx.decoded.role === "ATHLETE" && showUpdateProfileDialog && <AthleteUpdateDialog
    name = {name}
    gender = {gender}
    description = {description}
    profilePicture = {profilePicture} 
    goals = {goals}
    contact = {contact}
    facebook = {facebook}
    instagram = {instagram}
    setShowUpdateProfileDialog = {setShowUpdateProfileDialog} /> }
    {userCtx.decoded.role === "COACH" && showUpdateProfileDialog && <CoachUpdateDialog 
      name = {name}
      gender = {gender}
      description = {description}
      profilePicture = {profilePicture} 
      goals = {goals}
      contact = {contact}
      facebook = {facebook}
      instagram = {instagram}
      setShowUpdateProfileDialog = {setShowUpdateProfileDialog}
      />}

  </div>;
};

export default Profile;
