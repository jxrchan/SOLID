import React, { useState } from "react";

const Home = () => {
  const [isFirstLogin, setIsFirstLogin] = useState(false);

  const checkIfFirstLogin = () => {
    setIsFirstLogin(true);
  };
  return <Box></Box>;
};

export default Home;
