import React, { Suspense, useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {jwtDecode} from "jwt-decode";



import UserContext from "./context/user";
import NavDrawer from "./components/NavDrawer";

const Home = React.lazy(() => import("./pages/Home"));
const Profile = React.lazy(() => import("./pages/Profile"));
const Athletes = React.lazy(() => import("./pages/Athletes"));
const Coaches = React.lazy(() => import("./pages/Coaches"));
const NotFound = React.lazy(() => import("./pages/NotFound"));
const Login = React.lazy(() => import("./pages/Login"));
const Register = React.lazy(() => import("./pages/Register"));


function App() {
  const queryClient = new QueryClient();

  const [accessToken, setAccessToken] = useState('');
  const [decoded, setDecoded] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const checkLoggedIn = (token) => {
    setAccessToken(token);
    const decodedToken = jwtDecode(token);
    setDecoded(decodedToken);
    setIsLoggedIn(true);
  };

  useEffect(() => {
    const token = window.localStorage.getItem('token');
    if (token) {
      checkLoggedIn(token);
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <UserContext.Provider
        value={{
          accessToken,
          setAccessToken,
          decoded,
          setDecoded,
          setIsLoggedIn,
        }}
      >
          {/* {isLoggedIn && <NavDrawer />} */}
          <NavDrawer/>
            <Suspense fallback={<div>Loading...</div>}>
              <Routes>
                <Route path="/login" 
                  element={isLoggedIn ? <Home/> : <Navigate replace to="/login" />}/>
               
                  <Route path="/"
                  element={isLoggedIn ? <Home/> : <Navigate replace to="/login" />}
                />
                <Route path="/register" element={<Register />} />
                <Route
                  path="/home"
                  element={isLoggedIn ? <Home /> : <Navigate replace to="/login" />}
                />
                <Route
                  path="/profile"
                  element={isLoggedIn ? <Profile /> : <Navigate replace to="/login" />}
                />
                <Route
                  path="/coaches"
                  element={
                    isLoggedIn && decoded.role === "COACH" ? (
                      <Coaches />
                    ) : (
                      <Navigate replace to="/login" />
                    )
                  }
                />
                <Route
                  path="/athletes"
                  element={
                    isLoggedIn && decoded.role === "ATHLETE" ? (
                      <Athletes />
                    ) : (
                      <Navigate replace to="/login" />
                    )
                  }
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
      </UserContext.Provider>
    </QueryClientProvider>
  );
}

export default App;
